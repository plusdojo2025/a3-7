import './css/Common.css';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import SignUp from "./SignUp";
import Home from './Home';
import Mypage from './Mypage';
import MyPageEdit from './MyPageEdit';
import Mail from './Mail';
import SearchWrapper from './Search';
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
import ViewProjectWrapper from './ViewProject';
import ViewProcessWrapper from './ViewProcess';
import ViewTextWrapper from './ViewText';
import WeeklyReport from './WeeklyReport';
import { AlertProvider } from './AlertContext';





function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <Routes>
          {/* 認証不要ページ */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* デフォルトパス /homeへリダイレクト */}
          <Route path="/" element={<Navigate to="/home" />} />

          {/* ログインが必要なページ（Commonでラップ） */}
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
                <Route path="search" element={<SearchWrapper />} />
                <Route path="project/:projectId" element={<ViewProjectWrapper />} />
                <Route path="project/:projectId/processes/:processId" element={<ViewProcessWrapper />} />
                <Route path="view-text/:type/:id" element={<ViewTextWrapper />} />
                <Route path="equipmentRegist" element={<EquipmentRegist />} />
                <Route path="equipment" element={<Equipment />} />
                <Route path="bioRegist" element={<BioRegist />} />
                <Route path="equipmentEdit" element={<EquipmentEdit />} />
                <Route path="bioEdit" element={<BioEdit />} />
                <Route path="report/project/:projectId/process/:processId" element={<Report />} />
                <Route path="reflect/project/:projectId/process/:processId" element={<Reflect />} />
                <Route path="reportEdit/:reportId" element={<ReportEdit />} />
                <Route path="project/:projectId/processes/:processId" element={<WeeklyReport />} />
              </Routes>
            </Common>
          } />
        </Routes>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
