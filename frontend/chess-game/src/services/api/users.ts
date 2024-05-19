import axios, { AxiosInstance } from 'axios';

let baseUrl: string;

switch (true) {
    case window.location.hostname.includes('localhost'):
        baseUrl = 'http://localhost:3000';
        // baseUrl = 'http://ec2-16-171-98-154.eu-north-1.compute.amazonaws.com';
        break;
    case window.location.hostname.includes('vercel.app'):
        baseUrl = 'http://ec2-16-171-98-154.eu-north-1.compute.amazonaws.com';
        break;
    default:
        baseUrl = 'http://localhost:3000';
}
let userInstance: AxiosInstance;

const axiosInstance = () => {
    userInstance = axios.create({
        baseURL: baseUrl + '/auth',
        withCredentials: true,
        // headers: {
        //     Authorization: JSON.stringify({
        //         idToken: getCookieValue('idToken'),
        //         accessToken: getCookieValue('accessToken'),
        //     }),
        // },
    });

    userInstance.interceptors.response.use(undefined, error => {
        if (error?.response?.status === 403) {
            // logout
            logout();
        }
    });
};

axiosInstance();

export const logout = async () => {
    return userInstance.get('/logout');
};

export const isLoggedIn = async () => {
    return userInstance.get('/refresh', {
        validateStatus: status => {
            return status <= 500 && status >= 200;
        },
    });
};
