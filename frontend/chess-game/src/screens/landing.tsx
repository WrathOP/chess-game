import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import BackgroundSvg from '../components/BackgroundSvg';

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className='relative flex h-full justify-center overflow-hidden'>
            <BackgroundSvg />
            <div className='z-[1] grid max-w-screen-xl content-center py-8'>
                <div className='grid h-full grid-cols-1 grid-rows-[max-content] gap-4 px-4 py-8 lg:grid-cols-3 lg:grid-rows-[auto] lg:p-8'>
                    <div className='flex items-center justify-center lg:col-span-2'>
                        <img
                            src={'/chessboard.jpeg'}
                            className='animate-glow aspect-square w-2/3 object-scale-down lg:w-3/4'
                        />
                    </div>
                    <div className='grid content-center p-4 lg:p-0 lg:pt-16'>
                        <div className='flex justify-center'>
                            <h1 className='text-center text-3xl font-bold text-white xl:text-5xl'>
                                Welcome to chess for nerds ; CHESS NERDS !
                            </h1>
                        </div>

                        <div className='m-2 grid gap-4 lg:mt-8 xl:grid-flow-col'>
                            <div className='rounded-[6px] bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5 shadow-[-30_0_1rem_-1rem,0_0_1rem_-1rem] duration-500 hover:shadow-[-1rem_0_2rem_-0.5rem,1rem_0_2rem_-0.5rem] hover:shadow-orange-400'>
                                <Button
                                    className='w-full rounded-[5px] bg-slate-950 px-4 font-medium transition-colors duration-300 hover:bg-black/80'
                                    onClick={() => {
                                        navigate('/game/random');
                                    }}
                                >
                                    Play Online
                                </Button>
                            </div>

                            <Button
                                className='h-auto rounded-[6px] font-medium duration-300 hover:bg-green-600'
                                onClick={() => {
                                    navigate('/login');
                                }}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
