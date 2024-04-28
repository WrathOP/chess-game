import React, { useEffect, useState } from 'react';
import { Chess, Move, Square } from '../chess';
import { Chessboard } from 'react-chessboard';
import { useSocket } from '../hooks/useSocket';
import { useParams } from 'react-router-dom';
import MovesTable from '../components/MovesTable';
import {
    JOIN_ROOM,
    OPPONENT_DISCONNECTED,
    INIT_GAME,
    MOVE,
    GAME_OVER,
    GAME_JOINED,
} from '../constants/messages';

const Game: React.FC = () => {
    const socket = useSocket();
    const { gameId } = useParams();
    // const navigate = useNavigate();
    const [game, setGame] = useState(new Chess());
    const [moves, setMoves] = useState<Move[]>(game.history({ verbose: true }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const makeAMove = (move: any) => {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);
        if (result !== null) {
            setGame(gameCopy);
            if (!socket) return;
        }
        setMoves(prevMoves => [...prevMoves, move]);
        return result;
    };

    // const makeRandomMove = () => {
    //     const possibleMoves = game.moves();
    //     if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
    //         return; // exit if the game is over
    //     const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    //     makeAMove(possibleMoves[randomIndex]);
    // };

    const handleMove = (sourceSquare: string, targetSquare: string) => {
        const move = makeAMove({
            from: sourceSquare as Square,
            to: targetSquare as Square,
            promotion: 'q', // always promote to a queen for example simplicity
        });
        // illegal move
        if (move === null) return false;
        return true;
    };

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.onmessage = event => {
            const message = JSON.parse(event.data);
            const opponentMove = message.payload.move;
            switch (message.type) {
                case INIT_GAME:
                    break;
                case MOVE:
                    makeAMove(opponentMove);
                    break;
                case GAME_OVER:
                    break;
                case OPPONENT_DISCONNECTED:
                    break;
                case GAME_JOINED:
                    break;
                default:
                    break;
            }
        };

        if (gameId !== 'random') {
            socket.send(
                JSON.stringify({ type: JOIN_ROOM, payload: { gameId } }),
            );
        }

        return () => {
            socket.close();
        };
    }, [socket, gameId]);

    if (!socket) return <div>Connecting...</div>;

    return (
        <div className='flex justify-center'>
            <div className='w-full max-w-screen-xl pt-2'>
                <div className='flex items-center justify-center'>
                    <div className='h-screen w-2/3 overflow-auto'>
                        <Chessboard
                            position={game.fen()}
                            onPieceDrop={handleMove}
                            areArrowsAllowed={true}
                            clearPremovesOnRightClick={true}
                            arePremovesAllowed={true}
                        />
                    </div>
                    <div>
                        <MovesTable moves={moves} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
