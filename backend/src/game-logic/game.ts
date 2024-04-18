import { Player } from "./player";
import { Chess } from "./chess";
import { GAME_STARTED } from "./messages";

export class Game {
    id: string;
    // we can later on introduce a many to one relationship between game and player : 2 to 1 
    player1: Player;
    player2: Player;
    turn: Player;
    board: Chess;

    constructor(player1: Player, player2: Player) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.turn = player1;
        this.startGame();
    }

    public move(
        player: Player,
        move: {
            from: string;
            to: string;
            promotion?: string;
        }
    ) {
        // Validate that the move
        if (player !== this.turn) {
            player.webSocketId.send(
                JSON.stringify({
                    type: "error",
                    message: "It is not your turn",
                })
            );
            return;
        }

        try {
            this.board.move(move);
            console.log(this.board.ascii());

            // Send the move to the other player
            if (this.turn === this.player1) {
                console.log("Sending move to player 2");
                this.player2.webSocketId.send(
                    JSON.stringify({ type: "move", move })
                );
            } else {
                console.log("Sending move to player 1");
                this.player1.webSocketId.send(
                    JSON.stringify({ type: "move", move })
                );
            }

            // Switch the turn
            if (this.turn === this.player1) {
                this.turn = this.player2;
            } else {
                this.turn = this.player1;
            }
        } catch (error) {
            console.log("Error", error);
            this.turn.webSocketId.send(
                JSON.stringify({
                    type: "error",
                    message: `Invalid move: ${move}`,
                })
            );
        }
    }

    // In future can be used to handle what happens when the game starts
    private startGame() {
        console.log(
            `Game between ${this.player1.playerName} and ${this.player2.playerName} started`
        );
        this.player1.webSocketId.send(
            JSON.stringify({
                type: GAME_STARTED,
                game: {
                    white: this.player1.playerName,
                    black: this.player2.playerName,
                },
            })
        );
        this.player2.webSocketId.send(
            JSON.stringify({
                type: GAME_STARTED,
                game: {
                    white: this.player1.playerName,
                    black: this.player2.playerName,
                },
            })
        );
    }
}
