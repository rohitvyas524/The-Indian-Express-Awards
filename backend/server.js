const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
console.log("data going to be sent to the server");

app.use(cors({
  origin: ["http://localhost:3000"], // your frontend
  credentials: true,               // allows cookies, sessions, etc.
}));

app.use(express.json());

// ✅ Routes
const nominationsRoutes = require("./routes/nominationRoutes");
app.use("/api/nominations", nominationsRoutes);


// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Server
const PORT = process.env.PORT || 5001;
app.listen(5001, () => {
  console.log(`Server is running on port ${PORT}`);
});