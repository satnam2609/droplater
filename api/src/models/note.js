const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  releaseAt: {
    type: String,
    index: true,
    default:new Date().toISOString()
  }, // ISO String
  webhookUrl: String,
  status: {
    type: String,
    enum: ["Pending", "Delivered", "Failed", "Dead"],
    default: "Pending",
    index: true,
  },
  attempts: [
    {
      at: String,
      statusCode: Number,
      ok: Boolean,
      error: String,
    },
  ],
  delieveredAt: String,
});

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

module.exports=Note;