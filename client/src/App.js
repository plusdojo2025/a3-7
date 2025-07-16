import './css/Common.css';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Mypage from './Mypage';
import Search from './Search';
import EquipmentRegist from './EquipmentRegist';
import BioRegist from './BioRegist';
import EquipmentEdit from './EquipmentEdit';
import BioEdit from './BioEdit';
import Project from './Project';
import Process from './Process';
import Member from './Member';



import Report from './Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/process" element={<Process />} />
        <Route path="/member" element={<Member />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/search" element={<Search />} />
       <Route path="/equipmentRegist" element={<EquipmentRegist />} />
        <Route path="/bioRegist" element={<BioRegist />} />
        <Route path="/equipmentEdit" element={<EquipmentEdit />} />
        <Route path="/bioEdit" element={<BioEdit />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;