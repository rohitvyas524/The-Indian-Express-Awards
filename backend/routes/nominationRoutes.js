const express = require("express");
const router = express.Router();
const Nomination = require("../models/Nomination");

router.post("/", async (req, res) => {
  try {
    const newNomination = new Nomination(req.body);
    await newNomination.save();
    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  const data = await Nomination.find();
  res.json(data);
});


router.get("/:id", async (req, res) => {
  const data = await Nomination.findById(req.params.id);
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const data = await Nomination.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedNomination = await Nomination.findByIdAndDelete(req.params.id);
    if (!deletedNomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }
    res.status(200).json({ message: "Nomination deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;