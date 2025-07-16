import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Mypage from './Mypage';
import Search from './Search';
import EquipmentRegist from './EquipmentRegist';
import BioRegist from './BioRegist';
import EquipmentEdit from './EquipmentEdit';
import BioEdit from './BioEdit';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/EquipmentRegist" element={<EquipmentRegist />} />
        <Route path="/EquipmentRegist" element={<BioRegist />} />
        <Route path="/EquipmentRegist" element={<EquipmentEdit />} />
        <Route path="/EquipmentRegist" element={<BioEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;