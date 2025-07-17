const Nomination = require("../models/Nomination");

exports.createNomination = async (req, res) => {
  try {
    const newNomination = new Nomination({ ...req.body, userId: req.user._id });
    await newNomination.save();
    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserNominations = async (req, res) => {
  try {
    const data = req.user.role === "admin"
      ? await Nomination.find()
      : await Nomination.find({ userId: req.user._id });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllNominations = async (req, res) => {
   // return;
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const nominations = await Nomination.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(nominations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNominationById = async (req, res) => {
  try {
    const data = await Nomination.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Nomination not found" });

    if (data.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNomination = async (req, res) => {
  try {
    const existing = await Nomination.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    if (existing.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await Nomination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNomination = async (req, res) => {
  try {
    const existing = await Nomination.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    if (existing.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Nomination.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Nomination deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
