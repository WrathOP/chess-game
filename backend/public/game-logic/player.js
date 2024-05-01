"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(webSocketId, playerName, region, rating) {
        this.playerName = playerName = "Guest Player";
        this.region = region = "India";
        this.rating = rating = 1000;
        this.webSocketId = webSocketId;
    }
    sendMove(move) {
        this.webSocketId.send(move);
    }
}
exports.Player = Player;
