import { WebSocketServer } from "ws";
import { GameManager } from "./game-logic/game-manager";
import { Player } from "./game-logic/player";
import { Router } from "express";
import { isAuthenticated } from "./constants/middlewares/isAuthenticated";

const websocketRoute = Router();
const wss = new WebSocketServer({ port: 8080 });

websocketRoute.use(isAuthenticated);

console.log("Websocket available at port 8080");

const gameManger = new GameManager();

wss.on("connection", function connection(ws) {
    // Create a new player
    const newPlayer = new Player(ws);

    // Add the player to the game manager
    gameManger.addUser(newPlayer);

    console.log(
        "New connection",
        gameManger.getNumberOfUsers(),
        "users connected"
    );

    // Removing the player from the game manager
    ws.on("close", function connection(ws) {
        gameManger.removeUser(newPlayer);

        console.log(
            "User disconnected",
            gameManger.getNumberOfUsers(),
            "users connected"
        );
    });
});

export { websocketRoute, wss };
