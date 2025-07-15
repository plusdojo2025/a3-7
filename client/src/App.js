import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Mypage from './Mypage';
import Search from './Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;