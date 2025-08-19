const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createClient } = require("redis");
const pino = require("pino");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const logger = pino({
  level: process.env.LOG_LEVEL || "info",  
  transport: {
    target: "pino-pretty", 
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

const client = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

client
  .connect()
  .then(() => console.log("Redis connected"))
  .catch(console.error);

app.post("/sink", async (req, res) => {
  const noteId = req.headers["x-note-id"];
  const key = req.headers["x-idempotency-key"];

  if (!key) {
    return res.status(400).json({ error: "Missing X-Idempotency-Key header" });
  }

  try {
    const result = await client.set(key, 1, { NX: true, EX: 86400 });
    if (result === "OK") {
      logger.info(`noteId:${noteId} and idempotency key: ${key} is sinked now`);
      return res.status(200).json({ ok: true, stored: true });
    } else {
      logger.info("Duplicate note ignored:", noteId);
      return res.status(200).json({ ok: true, stored: false });
    }
  } catch (err) {
    logger.info("Redis error:", err);
    return res.status(500).json({ error: "Redis failure" });
  }
});

app.listen(process.env.PORT || 4000, () => {
  logger.info(`Sink server listening on port ${process.env.PORT || 4000}`);
});
