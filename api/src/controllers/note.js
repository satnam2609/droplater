const { z, ZodError } = require("zod");
const Note = require("../models/note");

const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  releaseAt: z.string(),
  webhookUrl: z.string(),
});

exports.createNote = async (req, res) => {
  try {
    const parsedData = createNoteSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const note = await Note.create({
      title: parsedData.data.title,
      body: parsedData.data.body,
      releaseAt: parsedData.data.releaseAt,
      webhookUrl: parsedData.data.webhookUrl,
    });

    return res.status(201).json({
      message: note._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: error.message,
    });
  }
};

exports.getNote = async (req, res) => {
  try {
    const status = req.query.status;
    const page = req.query.page;

    const currentPage = page || 1;
    const perPage = 20;

    let notes = [];

    if (status) {
      notes = await Note.find({ status })
        .limit(perPage)
        .skip((currentPage - 1) * perPage);
    } else {
      notes = await Note.find({})
        .limit(perPage)
        .skip((currentPage - 1) * perPage);
    }
    return res.status(200).json({
      message: notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: error.message,
    });
  }
};

exports.replayNote = async (req, res) => {
  try {
    const id=req.params.id;
    console.log('Id: ',id);
    await Note.findOneAndUpdate({
      _id:new Object(id)
    },{
      $set:{
        status:"Pending"
      }
    },{
      new:true
    });
    return res.status(201).json({message:"Replayed"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: error.message,
    });
  }
};
