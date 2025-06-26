const mongoose = require("mongoose");

const nominationSchema = new mongoose.Schema({
  title: String,
  category: String,
  section1: Object,
  section2: Object,
  section3: Object,
  section4: Object,
  section5: Object,
}, { timestamps: true });

module.exports = mongoose.model("Nomination", nominationSchema);