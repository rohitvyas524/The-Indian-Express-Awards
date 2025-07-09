const express = require("express");
const router = express.Router();
const Nomination = require("../models/Nomination");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // should match what you encode in login
  } catch (err) {
    console.error("JWT verify failed:", err);
    return null;
  }
}

router.post("/", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const newNomination = new Nomination({ ...req.body, userId });
    await newNomination.save();
    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    const data = user.role === "admin"
      ? await Nomination.find()
      : await Nomination.find({ userId });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all nominations (for admin only)
router.get("/all", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const nominations = await Nomination.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(nominations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const data = await Nomination.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Nomination not found" });

    const user = await User.findById(userId);
    if (data.userId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const existing = await Nomination.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const user = await User.findById(userId);
    if (existing.userId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await Nomination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const existing = await Nomination.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const user = await User.findById(userId);
    if (existing.userId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Nomination.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Nomination deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;