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
let authInstance: AxiosInstance;

const axiosInstance = () => {
    authInstance = axios.create({
        baseURL: baseUrl + '/auth',
        withCredentials: true,
        // headers: {
        //     Authorization: JSON.stringify({
        //         idToken: getCookieValue('idToken'),
        //         accessToken: getCookieValue('accessToken'),
        //     }),
        // },
    });
};

axiosInstance();

export const logout = async () => {
    return authInstance.get('/logout');
};

export const isLoggedIn = async () => {
    return authInstance.get('/refresh', {
        validateStatus: status => {
            return status <= 500 && status >= 200;
        },
    });
};
