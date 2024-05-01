import Github from '../assets/github.png';
import { useNavigate } from 'react-router-dom';

let BACKEND_URL: string;

switch (window.location.hostname) {
    case 'localhost':
        BACKEND_URL = 'http://localhost:3000';
        break;
    default:
        BACKEND_URL = 'http://ec2-16-171-98-154.eu-north-1.compute.amazonaws.com';
}

const Login = () => {
    const navigate = useNavigate();

    const github = () => {
        window.open(`${BACKEND_URL}/auth/github`, '_self');
    };

    return (
        <div className='flex h-screen flex-col items-center justify-center bg-gray-900 text-white'>
            <h1 className='mb-8 text-center text-4xl font-bold text-green-500 drop-shadow-lg'>
                Enter the Game World
            </h1>
            <div className='flex flex-col rounded-lg bg-gray-800 p-8 shadow-lg md:flex-row'>
                <div className='mb-8 flex flex-col justify-center md:mb-0 md:mr-8'>
                    <div
                        className='flex cursor-pointer items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600'
                        onClick={github}
                    >
                        <img src={Github} alt='' className='mr-2 h-6 w-6' />
                        Sign in with Github
                    </div>
                </div>
                <div className='flex flex-col items-center md:ml-8'>
                    <div className='mb-4 flex items-center'>
                        <div className='mr-2 h-1 w-12 bg-gray-600'></div>
                        <span className='text-gray-400'>OR</span>
                        <div className='ml-2 h-1 w-12 bg-gray-600'></div>
                    </div>
                    <input
                        type='text'
                        placeholder='Username'
                        className='mb-4 w-full rounded-md bg-gray-700 px-4 py-2 text-white md:w-64'
                    />
                    <button
                        className='rounded-md bg-green-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-600'
                        onClick={() => navigate('/game/random')}
                    >
                        Enter as guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
