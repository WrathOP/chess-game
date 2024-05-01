import { useEffect, useState } from "react"
import { useUser } from "./useUser";

let WS_URL;

switch (true) {
    case window.location.hostname.includes('localhost'):
        WS_URL = 'http://localhost:8080';
        break;
    case window.location.hostname.includes('vercel.app'):
        WS_URL = 'http://ec2-16-171-98-154.eu-north-1.compute.amazonaws.com/ws';
        break;
    default:
        WS_URL = 'http://localhost:8080';
}

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const user = useUser();
    console.log(user);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${user.token}`);

        ws.onopen = () => {
            setSocket(ws);
        }

        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, [user])

    return socket;  
}