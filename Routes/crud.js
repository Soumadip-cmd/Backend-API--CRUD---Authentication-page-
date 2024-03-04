//CRUD operation on a given note.

const express = require("express");
const path = require("path");
const fetchuser = require("../middleware/fetchingUser");
const Note = require("../connection/note");
const { body, validationResult } = require("express-validator");

const router = express.Router();
//Router 1: we find all note data by sending request.
router.get("/notedata", fetchuser, async (req, res) => {
  try {
    const user = await Note.find({ user: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "Not Found." });
    }
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Problem..." });
  }
});
//Router 2: we add all note data by sending request.
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Write a valid title with suitable content.").isLength({
      min: 3,
    }),
    // password must be at least 5 chars long
    body("description", "Gives a proper description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.send(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Problem..." });
    }
  }
);
//Router 3: we update all note data by sending request.
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    const notedata = await Note.findById(req.params.id);
    if (!notedata) {
      return res.status(404).json({ error: "Not Found." });
    }

    if (notedata.user.toString() !== req.user.id) {
      return res.status(404).json({ error: "Not allowed!!!!." });
    }
    const updatenote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ updatenote });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Problem..." });
  }
});
//Router 4: we can delete all note data by sending request.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const notedata = await Note.findById(req.params.id);
    if (!notedata) {
      return res.status(404).json({ error: "Not Found." });
    }

    if (notedata.user.toString() !== req.user.id) {
      return res.status(404).json({ error: "Not allowed!!!!." });
    }
    const updatenote = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note is deleted successfully", note: updatenote });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Problem..." });
  }
});

module.exports = router;
