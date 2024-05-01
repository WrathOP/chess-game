import axios from 'axios';

let baseUrl;

switch (true) {
    case window.location.hostname.includes('localhost'):
        baseUrl = 'http://localhost:3000';
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
});

export default axiosInstance;
