const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nominationRoutes = require("./routes/nominationRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();
console.log("Data sent to server");

app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/nominations", nominationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});