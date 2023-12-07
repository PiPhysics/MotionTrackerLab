from fastapi import WebSocket
from labconfig.types import WebSocketMessage

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: WebSocketMessage, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: WebSocketMessage):
        for connection in self.active_connections:
            await connection.send_json(message)


manager = ConnectionManager()
