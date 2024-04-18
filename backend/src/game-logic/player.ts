import { WebSocket } from 'ws';

export class Player {
    playerName: string;
    webSocketId: WebSocket; // TODO : Create a class for webSocketId
    region: string; // TODO : Create enums or classes for region
    rating: number; // TODO : Create classes for rating

    constructor(
        webSocketId: WebSocket,
        playerName?: string,
        region?: string,
        rating?: number
    ) {
        this.playerName = playerName = "Guest Player";
        this.region = region = "India";
        this.rating = rating = 1000;
        this.webSocketId = webSocketId;
    }

    sendMove(move: string) {
        this.webSocketId.send(move);
    }   

}
