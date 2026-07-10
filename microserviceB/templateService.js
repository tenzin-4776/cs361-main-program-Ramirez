const zmq = require("zeromq");

async function runTemplateService() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5556");

  console.log("Microservice B running on port 5556");

  for await (const [msg] of sock) {
    const request = JSON.parse(msg.toString());
    console.log("Microservice B received:", request);

    const theme = request.theme || "general";

    const response = {
      microservice: "B",
      feature: "Template Recommendation",
      theme,
      templates: [
        {
          name: `${theme} Highlight Reel`,
          description: "Fast-paced template for short social videos.",
          style: "energetic"
        },
        {
          name: `${theme} Story Builder`,
          description: "Balanced template for explaining a story or process.",
          style: "narrative"
        },
        {
          name: `${theme} Clean Showcase`,
          description: "Simple polished template for a clean final video.",
          style: "minimal"
        }
      ]
    };

    await sock.send(JSON.stringify(response));
  }
}

runTemplateService();