const zmq = require("zeromq");

async function runTransitionService() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5557");

  console.log("Microservice C running on port 5557");

  for await (const [msg] of sock) {
    const request = JSON.parse(msg.toString());
    console.log("Microservice C received:", request);

    const mediaItems = request.mediaItems || [];

    const transitions = mediaItems.map((item, index) => ({
      item,
      transitionDuration: index === 0 ? 0 : 1.5
    }));

    const response = {
      microservice: "C",
      feature: "Auto Transition Timing",
      transitions,
      message: "Transition timing generated successfully."
    };

    await sock.send(JSON.stringify(response));
  }
}

runTransitionService();