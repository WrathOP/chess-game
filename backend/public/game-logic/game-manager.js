"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    getNumberOfUsers() {
        return this.users.length;
    }
    addUser(player) {
        this.users.push(player);
        this.handleGameStart(player);
    }
    removeUser(player) {
        // Remove the player from the users
        this.users = this.users.filter((user) => {
            return user !== player;
        });
        // Remove the player from the pending user
        if (this.pendingUser === player) {
            this.pendingUser = null;
            return;
        }
        this.games = this.games.filter((game) => {
            if (game.player1 === player || game.player2 === player) {
                if (game.player1 !== player) {
                    game.player1.webSocketId.send(JSON.stringify({
                        type: messages_1.GAME_OVER,
                        message: "Opponent disconnected",
                    }));
                    game.player1.webSocketId.close();
                }
                else {
                    game.player2.webSocketId.send(JSON.stringify({
                        type: messages_1.GAME_OVER,
                        message: "Opponent disconnected",
                    }));
                    game.player2.webSocketId.close();
                }
                return false;
            }
            return true;
        });
    }
    handleGameStart(player) {
        player.webSocketId.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type == messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    const newGame = new game_1.Game(this.pendingUser, player);
                    this.games.push(newGame);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = player;
                    // Send the pending message to the player
                    player.webSocketId.send(JSON.stringify({
                        type: messages_1.WAITING_FOR_OPPONENT,
                        message: "Waiting for opponent",
                    }));
                }
            }
            if (message.type == messages_1.MOVE) {
                console.log("Move message", message);
                const game = this.games.find((game) => game.player1 === player || game.player2 === player);
                if (!game) {
                    return;
                }
                // Handle move
                game.move(player, message.move);
            }
            if (message == messages_1.GAME_OVER) {
                // Handle the game over
            }
        });
    }
}
exports.GameManager = GameManager;
