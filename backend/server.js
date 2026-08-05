const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Fix CORS for GitHub Pages
app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/api/contacts", require("./routes/contacts"));

app.get("/", (req, res) => {
  res.json({ message: "Emergency Contact Directory API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});