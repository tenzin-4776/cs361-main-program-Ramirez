import zmq

context = zmq.Context()

socket = context.socket(zmq.REQ)
socket.connect("tcp://localhost:5555")

request = {
    "theme": "graduation"
}

print("Sending request:")
print(request)

socket.send_json(request)

response = socket.recv_json()

print("\nReceived response:")
print(response)