const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { callMicroservice } = require("./microserviceClient");

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

// Microservice A: Music Recommendations
app.post("/music-recommendations", async (req, res) => {
  try {
    const response = await callMicroservice(5555, {
      theme: req.body.theme || "general"
    });

    res.json(response);
  } catch (err) {
    console.error("Microservice A error:", err);
    res.status(500).json({
      error: "Microservice A unavailable",
      details: err.message
    });
  }
});

// Microservice B: Template Recommendations
app.post("/template-recommendations", async (req, res) => {
  try {
    const response = await callMicroservice(5556, {
      theme: req.body.theme || "general"
    });

    res.json(response);
  } catch (err) {
    console.error("Microservice B error:", err);
    res.status(500).json({
      error: "Microservice B unavailable",
      details: err.message
    });
  }
});

// Microservice C: Auto Transition Timing
app.post("/transition-timing", async (req, res) => {
  try {
    const response = await callMicroservice(5557, {
      mediaItems: req.body.mediaItems || []
    });

    res.json(response);
  } catch (err) {
    console.error("Microservice C error:", err);
    res.status(500).json({
      error: "Microservice C unavailable",
      details: err.message
    });
  }
});

// Microservice D: Video Export
app.post("/export-video", async (req, res) => {
  try {
    const response = await callMicroservice(5558, {
      projectName: req.body.projectName || "video-project",
      aspectRatio: req.body.aspectRatio || "16:9"
    });

    res.json(response);
  } catch (err) {
    console.error("Microservice D error:", err);
    res.status(500).json({
      error: "Microservice D unavailable",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Video Creator running at http://localhost:${PORT}`);
});