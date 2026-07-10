const zmq = require("zeromq");

async function runExportService() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5558");

  console.log("Microservice D running on port 5558");

  for await (const [msg] of sock) {
    const request = JSON.parse(msg.toString());
    console.log("Microservice D received:", request);

    const aspectRatio = request.aspectRatio || "16:9";
    const projectName = request.projectName || "untitled-video";

    const response = {
      microservice: "D",
      feature: "Video Export",
      success: true,
      projectName,
      aspectRatio,
      exportPath: `exports/${projectName}-${aspectRatio.replace(":", "x")}.mp4`,
      message: "Video export completed successfully."
    };

    await sock.send(JSON.stringify(response));
  }
}

runExportService();