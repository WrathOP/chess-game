import axios from 'axios';
import { getCookieValue } from './globalConsts';

let baseUrl;

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

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        Authorization: JSON.stringify({
            idToken: getCookieValue('idToken'),
            accessToken: getCookieValue('accessToken'),
        }),
    },
});

export default axiosInstance;
