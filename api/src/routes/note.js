const express = require("express");
const { createNote, getNote, replayNote } = require("../controllers/note");
const { validateAdmin } = require("../middleware/note");
const { validate } = require("../models/note");

const router = express.Router();

router.post("/notes", validateAdmin, createNote);
router.get("/notes",validateAdmin, getNote);
router.post("/notes/:id/replay",validateAdmin, replayNote);

module.exports = router;
