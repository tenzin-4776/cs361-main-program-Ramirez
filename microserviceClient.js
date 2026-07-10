const zmq = require("zeromq");

async function callMicroservice(port, requestData) {
  const sock = new zmq.Request();

  sock.connect(`tcp://127.0.0.1:${port}`);

  console.log(`Sending request to Microservice on port ${port}:`, requestData);

  await sock.send(JSON.stringify(requestData));

  const [result] = await sock.receive();

  const response = JSON.parse(result.toString());

  console.log(`Received response from Microservice on port ${port}:`, response);

  return response;
}

module.exports = { callMicroservice };