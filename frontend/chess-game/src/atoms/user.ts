import { atom, selector } from 'recoil';
import { isLoggedIn, logout } from '../services/api/auth';

export interface User {
    email: string;
    id: string;
    name: string;
}

export const userAtom = atom<User>({
    key: 'user',
    default: selector({
        key: 'user/default',
        get: async () => {
            try {
                const response = await isLoggedIn();

                if (response.status !== 200) {
                    await logout();
                }

                return response.data.user;
            } catch (e) {
                console.error(e);
            }

            return null;
        },
    }),
});
