const { Queue, Worker } = require("bullmq");
const { initMongo } = require("./mongo");
const { Collection, ObjectId } = require("mongodb");
const crypto = require("crypto");
const { default: axios } = require("axios");
require("dotenv").config();

 

const notesQueue = new Queue("note-queue", {
  connection: {
    host: "redis",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: false,
    removeOnFail: false,
  },
});

function idempotentKey(note) {
  return crypto
    .createHash("sha256")
    .update(note._id.toString() + note.releaseAt)
    .digest("hex");
}

/**
 *
 * @param {Collection<Document>} collection
 */
async function pollCallback(collection) {
  const notes = await collection
    .find({
      status: "Pending",
      releaseAt: {
        $lt: new Date().toISOString(),
      },
    })
    .toArray();

  if (notes.length > 0) {
    notes.map(async (note) => {
      await notesQueue.add(note._id, {
        noteId: note._id,
        webhookUrl: note.webhookUrl,
        idempotentKey: idempotentKey(note),
      });
      console.log("A note has been enqueued for processing...");
    });
  }
}

async function init() {
  const collection = await initMongo();
  setInterval(() => pollCallback(collection), 5000);
}



(async () => {
  new Worker(
    "note-queue",
    async (job) => {
      const collection = await initMongo();

      const { noteId, webhookUrl, idempotentKey } = job.data;
      console.log("Job Attempt: ", job.attemptsMade);
      console.log(`Message rec id:${job.id}`);
      console.log("Processing msg");
      console.log("NoteID ", noteId);
      try {
        await axios.post(
          webhookUrl,
          {},
          {
            headers: {
              "X-Note-Id": noteId,
              "X-Idempotency-Key": idempotentKey,
            },
            timeout: 5000,
          }
        );
        const now = new Date().toISOString();
        await collection.updateOne(
          { _id: new ObjectId(noteId) },
          {
            $set: {
              status: "Delivered",
              delieveredAt: new Date().toISOString(),
            },
            $push: {
              attempts: {
                at: now,
                statusCode: 200,
                ok: true,
                error: "",
              },
            },
          }
        );
      } catch (error) {
        console.log("Attempt: ", job.attemptsMade);
        const now = new Date().toISOString();
        if (job.attemptsMade >= job.opts.attempts - 1) {
          await collection.updateOne(
            { _id: new ObjectId(noteId) },
            {
              $set: { status: "Dead" },
              $push: {
                attempts: {
                  at: now,
                  statusCode: 500,
                  ok: false,
                  error: error.message || "Error",
                },
              },
            }
          );
          throw error;  
        } else {
          await collection.updateOne(
            { _id: new ObjectId(noteId) },
            {
              $set: { status: "Failed" },
              $push: {
                attempts: {
                  at: now,
                  statusCode: 500,
                  ok: false,
                  error: error.message || "Error",
                },
              },
            }
          );
          throw error;
        }
      }
    },
    {
      connection: {
        host: "redis",
        port: 6379,
      },
    }
  );
})();

init();
