
import { atom, selector } from "recoil";
import axiosInstance from "../services/axiosInstance";

export interface User {
    token: string;
    id: string;
    name: string;
}

export const userAtom = atom<User>({
    key: "user",
    default: selector({
        key: "user/default",
        get: async () => {
            try {
                const response = await axiosInstance.get("/auth/refresh", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (response.status === 200) {
                    const data = await response.data;
                    return data;
                }
            } catch(e) {
                console.error(e);
            }

            return null;
        }
    
    }),
});