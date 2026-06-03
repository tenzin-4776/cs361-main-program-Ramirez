const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.array("media"), (req, res) => {
  const files = req.files.map(file => ({
    name: file.originalname,
    filename: file.filename,
    path: `/uploads/${file.filename}`,
    type: file.mimetype
  }));

  res.json({ files });
});

app.post("/save-project", (req, res) => {
  fs.writeFileSync("data/project.json", JSON.stringify(req.body, null, 2));
  res.json({ message: "Project saved successfully!" });
});

app.get("/project", (req, res) => {
  if (!fs.existsSync("data/project.json")) {
    return res.json({ files: [] });
  }

  const data = fs.readFileSync("data/project.json");
  res.json(JSON.parse(data || '{"files": []}'));
});

app.listen(PORT, () => {
  console.log(`Video Creator running at http://localhost:${PORT}`);
});