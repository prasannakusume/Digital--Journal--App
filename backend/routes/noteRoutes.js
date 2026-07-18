const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/hello", (req, res) => {
    res.send("Notes Route Working");
});

router.post("/add", async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);

        res.json({
            message: "Note Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports = router;