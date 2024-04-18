import { Game } from "./game";
import { GAME_OVER, INIT_GAME, MOVE, WAITING_FOR_OPPONENT } from "./messages";
import { Player } from "./player";

export class GameManager {
    private games: Game[];
    private pendingUser: Player | null;
    private users: Player[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    public getNumberOfUsers() {
        return this.users.length;
    }

    addUser(player: Player) {
        this.users.push(player);
        this.handleGameStart(player);
    }

    removeUser(player: Player) {
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
                    game.player1.webSocketId.send(
                        JSON.stringify({
                            type: GAME_OVER,
                            message: "Opponent disconnected",
                        })
                    );
                    game.player1.webSocketId.close();
                } else {
                    game.player2.webSocketId.send(
                        JSON.stringify({
                            type: GAME_OVER,
                            message: "Opponent disconnected",
                        })
                    );
                    game.player2.webSocketId.close();
                }
                return false;
            }
            return true;
        });
    }

    private handleGameStart(player: Player) {
        player.webSocketId.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type == INIT_GAME) {
                if (this.pendingUser) {
                    const newGame = new Game(this.pendingUser, player);
                    this.games.push(newGame);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = player;
                    // Send the pending message to the player
                    player.webSocketId.send(
                        JSON.stringify({
                            type: WAITING_FOR_OPPONENT,
                            message: "Waiting for opponent",
                        })
                    );
                }
            }
            if (message.type == MOVE) {

                console.log("Move message", message);

                const game = this.games.find(
                    (game) => game.player1 === player || game.player2 === player
                );

                if (!game) {
                    return;
                }

                // Handle move
                game.move(player, message.move);
            }
            if (message == GAME_OVER) {
                // Handle the game over
            }
        });
    }
}
