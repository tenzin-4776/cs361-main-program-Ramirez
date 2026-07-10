let projectFiles = [];
let previewIndex = 0;
let selectedPreviewIndex = 0;
let previewTimer = null;

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

async function uploadMedia() {
  const input = document.getElementById("mediaInput");
  const message = document.getElementById("uploadMessage");
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

  if (input.files.length === 0) {
    message.textContent = "Please select at least one file.";
    return;
  }

  for (const file of input.files) {
    if (!allowedTypes.includes(file.type)) {
      message.textContent = "Unsupported file type. Please upload JPG, PNG, or MP4 files only.";
      return;
    }
  }

  const formData = new FormData();

  for (const file of input.files) {
    formData.append("media", file);
  }

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  projectFiles = projectFiles.concat(data.files);

  message.textContent = "Upload successful. Files were added to the media list.";
  renderMediaList();
}

function renderMediaList() {
  const mediaList = document.getElementById("mediaList");
  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";

  mediaList.innerHTML = "";

  const filteredFiles = projectFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm)
  );

  if (filteredFiles.length === 0) {
    mediaList.innerHTML = "<p>No media files to show.</p>";
    return;
  }

  filteredFiles.forEach(file => {
    const originalIndex = projectFiles.indexOf(file);

    const item = document.createElement("div");
    item.className = "media-item";

    if (originalIndex === selectedPreviewIndex) {
      item.classList.add("selected");
    }

    item.onclick = () => {
      selectedPreviewIndex = originalIndex;

      document.querySelectorAll(".media-item").forEach(card => {
        card.classList.remove("selected");
      });

      item.classList.add("selected");
    };

    if (file.type.startsWith("image")) {
      item.innerHTML = `<img src="${file.path}" alt="${file.name}"><p>${file.name}</p>`;
    } else {
      item.innerHTML = `<video src="${file.path}" controls></video><p>${file.name}</p>`;
    }

    mediaList.appendChild(item);
  });
}

function startPreview() {
  if (projectFiles.length === 0) {
    alert("Please upload media before previewing.");
    return;
  }

  previewIndex = selectedPreviewIndex;
  showScreen("preview");
  showPreviewItem();
}

function showPreviewItem() {
  const previewArea = document.getElementById("previewArea");
  const nowPlaying = document.getElementById("nowPlaying");
  const file = projectFiles[previewIndex];

  if (file.type.startsWith("image")) {
    previewArea.innerHTML = `<img src="${file.path}" alt="${file.name}">`;
  } else {
    previewArea.innerHTML = `<video src="${file.path}" controls autoplay></video>`;
  }

  nowPlaying.textContent = `Now playing: ${file.name}`;
}

function playPreview() {
  if (projectFiles.length === 0) {
    return;
  }

  pausePreview();

  previewTimer = setInterval(() => {
    previewIndex = (previewIndex + 1) % projectFiles.length;
    showPreviewItem();
  }, 2000);
}

function pausePreview() {
  clearInterval(previewTimer);
}

function replayPreview() {
  previewIndex = selectedPreviewIndex;
  showPreviewItem();
  playPreview();
}

async function saveProject() {
  const response = await fetch("/save-project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ files: projectFiles })
  });

  const data = await response.json();
  console.log(data.message);
  showScreen("save");
}

async function loadProject() {
  const response = await fetch("/project");
  const data = await response.json();

  projectFiles = data.files || [];
  selectedPreviewIndex = 0;

  renderMediaList();
}

/* ===========================
   Microservice Integration
=========================== */

function getTheme() {
  return document.getElementById("themeInput")?.value || "adventure";
}

function updateThemeSummary() {
  document.getElementById("summaryTheme").textContent = getTheme();
}

async function getMusicRecommendations() {
  updateThemeSummary();

  const response = await fetch("/music-recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: getTheme() })
  });

  const data = await response.json();

  let music = "Adventure Background Track";

  if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
    music = data.recommendations[0];
  } else if (Array.isArray(data.music) && data.music.length > 0) {
    music = data.music[0];
  }

  document.getElementById("summaryMusic").textContent = music;
}

async function getTemplateRecommendations() {
  updateThemeSummary();

  const response = await fetch("/template-recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: getTheme() })
  });

  const data = await response.json();

  let template = "Adventure Highlight Reel";

  if (Array.isArray(data.templates) && data.templates.length > 0) {
    template = data.templates[0].name || data.templates[0];
  }

  document.getElementById("summaryTemplate").textContent = template;
}

async function generateTransitions() {
  updateThemeSummary();

  let mediaItems = projectFiles.map(file => file.name);

  if (mediaItems.length === 0) {
    mediaItems = ["intro.jpg", "adventure-clip.mp4", "ending.jpg"];
  }

  const response = await fetch("/transition-timing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaItems })
  });

  const data = await response.json();

  document.getElementById("summaryTransitions").textContent =
    `Generated for ${mediaItems.length} media item(s)`;

}

async function exportVideo() {
  updateThemeSummary();

  const response = await fetch("/export-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName: `${getTheme()}-video-project`,
      aspectRatio: "16:9"
    })
  });

  const data = await response.json();

  document.getElementById("summaryExport").textContent =
    data.success ? "Ready / Export complete" : "Export requested";

}

window.onload = loadProject; 