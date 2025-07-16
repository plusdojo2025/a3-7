import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import SignUp from "./SignUp";
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
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/search" element={<Search />} />
       <Route path="/equipmentRegist" element={<EquipmentRegist />} />
        <Route path="/bioRegist" element={<BioRegist />} />
        <Route path="/equipmentEdit" element={<EquipmentEdit />} />
        <Route path="/bioEdit" element={<BioEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;