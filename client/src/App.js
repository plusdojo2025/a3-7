import './css/Common.css';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import SignUp from "./SignUp";
import Home from './Home';
import Mypage from './Mypage';
import MyPageEdit from './MyPageEdit';
import Mail from './Mail';
import Search from './Search';
import EquipmentRegist from './EquipmentRegist';
import Equipment from './Equipment';
import BioRegist from './BioRegist';
import EquipmentEdit from './EquipmentEdit';
import BioEdit from './BioEdit';
import Project from './Project';
import Process from './Process';
import Member from './Member';
import Common from "./Common";
import Report from './Report';
import ReportEdit from './ReportEdit';
import Reflect from './Reflect';
import ViewProject from './ViewProject';
import ViewProcess from './ViewProcess';
import ViewText from './ViewText';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* デフォルトパス /homeへリダイレクト */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* 認証不要ページ */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ログインが必要なページ */}
        <Route path="/*" element={
          <Common>
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="project" element={<Project />} />
              <Route path="process" element={<Process />} />
              <Route path="member" element={<Member />} />
              <Route path="mypage" element={<Mypage />} />
              <Route path="mypage/edit" element={<MyPageEdit />} />
              <Route path="mypage/mail" element={<Mail />} />
              <Route path="search" element={<Search />} />
              <Route path="project/:projectId" element={<ViewProject />} />
              <Route path="project/:projectId/processes" element={<ViewProcess />} />
               <Route path="view-text/:resourceId" element={<ViewText />} />
              <Route path="equipmentRegist" element={<EquipmentRegist />} />
              <Route path="equipment" element={<Equipment />} />
              <Route path="bioRegist" element={<BioRegist />} />
              <Route path="equipmentEdit" element={<EquipmentEdit />} />
              <Route path="bioEdit" element={<BioEdit />} />
              <Route path="report" element={<Report />} />
              <Route path="reflect" element={<Reflect />} />
              <Route path="reportEdit/:reportId" element={<ReportEdit />} />
            </Routes>
          </Common>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
