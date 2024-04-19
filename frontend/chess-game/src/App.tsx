import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Game } from './screens/game';
import { Landing } from './screens/landing';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/game' element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
