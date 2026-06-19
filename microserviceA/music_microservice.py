import zmq

music_db = {
    "graduation": [
        "Celebration",
        "Achievement",
        "New Beginnings"
    ],
    "travel": [
        "Adventure",
        "Road Trip",
        "Explore"
    ],
    "birthday": [
        "Party Time",
        "Birthday Beats",
        "Celebrate"
    ]
}

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")

print("Music Recommendation Microservice is running...")

while True:
    request = socket.recv_json()

    theme = request.get("theme", "").lower()

    recommendations = music_db.get(
        theme,
        ["Default Track 1", "Default Track 2"]
    )

    response = {
        "recommendations": recommendations
    }

    socket.send_json(response)