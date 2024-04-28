import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from './screens/game';
import { Landing } from './screens/landing';
import Login from './screens/login';
import { useUser } from './hooks/useUser';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Loader } from './components/Loader';
function App() {
    return (
        <div className='h-screen bg-slate-950'>
            <RecoilRoot>
                <Suspense fallback={<Loader />}>
                    <AuthApp />
                </Suspense>
            </RecoilRoot>
        </div>
    );
}

function AuthApp() {
    const user = useUser();
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/login' element={user ? <Game /> : <Login />} />
                <Route
                    path='/game/:gameId'
                    element={user ? <Game /> : <Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
