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

module.exports = router;