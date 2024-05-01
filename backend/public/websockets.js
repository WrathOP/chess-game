"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = exports.websocketRoute = void 0;
const ws_1 = require("ws");
const game_manager_1 = require("./game-logic/game-manager");
const player_1 = require("./game-logic/player");
const express_1 = require("express");
const websocketRoute = (0, express_1.Router)();
exports.websocketRoute = websocketRoute;
const wss = new ws_1.WebSocketServer({ port: 8080 });
exports.wss = wss;
console.log("Websocket available at port 8080");
const gameManger = new game_manager_1.GameManager();
wss.on("connection", function connection(ws) {
    // Create a new player
    const newPlayer = new player_1.Player(ws);
    // Add the player to the game manager
    gameManger.addUser(newPlayer);
    console.log("New connection", gameManger.getNumberOfUsers(), "users connected");
    // Removing the player from the game manager
    ws.on("close", function connection(ws) {
        gameManger.removeUser(newPlayer);
        console.log("User disconnected", gameManger.getNumberOfUsers(), "users connected");
    });
});
