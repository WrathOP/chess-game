import { Chess, Square } from "../chess";

export function isPromoting(chess: Chess, from: Square, to: Square) {
    if (!from) {
        return false;
    }

    const piece = chess.get(from);

    if (piece?.type !== 'p') {
        return false;
    }

    if (piece.color !== chess.turn()) {
        return false;
    }

    if (!['1', '8'].some(it => to.endsWith(it))) {
        return false;
    }

    return chess
        .moves({ square: from, verbose: true })
        .map(it => it.to)
        .includes(to);
}