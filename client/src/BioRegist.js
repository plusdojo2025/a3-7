import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/BioRegist.css';


export default function BioRegist() {
  const [form, setForm] = useState({
    kind: '',
    name: '',
    gender: '',
    age: '',
    projectProcess: '',
    note: '',
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  //urlからprojectId取得
  const [projectId, setProjectId] = useState(null);

  //process格納用
  const [process, setProcess] = useState([]);



  //工程取得
  const fetchProcess = async (currentProjectId) => {
    try {
      const response = await axios.get(`/api/biology/processes/${currentProjectId}`);
      const activeProcesses = response.data.filter(p => p.complete === 0);
      setProcess(activeProcesses);
      console.log('全工程：', response.data); //一応残す
      console.log('表示される工程（未完了)：', activeProcesses);
    }
    catch (err) {
      console.error('工程の取得に失敗しました。', err);
      setError('工程の取得に失敗しました。');
      setProcess([]);
    }
  };

  //コンポーネントからマウントされたときにurlからprojectId取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('projectId');
    if (idFromUrl) {
      setProjectId(idFromUrl);
      fetchProcess(idFromUrl);
    }
    else {
      // alert('プロジェクトIDが見つかりません。');
      navigate(-1);
    }
  }, [location, navigate]
);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kind ||!form.name || !form.gender || !form.age || !form.projectProcess) {
      setError('入力されていない項目があります');
      return;
    }

    const genderNum = Number(form.gender);
    const ageNum = Number(form.age);
    const projectProcessNum = Number(form.projectProcess);

    if ([genderNum, ageNum, projectProcessNum].some(n => isNaN(n))) {
      setError('性別、年齢、実験工程は数値で入力してください');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('kind', form.kind); 
      formData.append('name', form.name);
      formData.append('gender', genderNum);
      formData.append('age', ageNum);
      formData.append('projectProcess', projectProcessNum);
      formData.append('note', form.note);
      formData.append('projectId', projectId); 

      await axios.post('/api/biology/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // リセット
      setForm({
        kind: '',
        name: '',
        gender: '',
        age: '',
        projectProcess: '',
        note: '',
      });
      setImage(null);

      // alert('登録完了！');
      navigate(`/equipment?projectId=${projectId}`);
    } catch (err) {
      console.error(err);
      setError('登録に失敗しました');
    }
  };

  //工程登録プルダウン
  const renderProcessOptions = () => {

    if (error && process.length === 0) {
      return <option value="" disabled>工程の取得に失敗しました</option>;
    }

    if (process.length > 0) {
      // process.map のループ変数名を p に変更しました (可読性のため)
      return process.map((p) => (
        <option key={p.processId} value={p.processId}>
          {p.processName}
        </option>
      ));
    }
    return <option value="" disabled>利用可能な工程がありません</option>;
  };

  return (
    <div>
      <h2>生物の登録</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>画像<input type="file" accept="image/*" onChange={handleImageChange} /></label>
        <label>種類<input type="text" name="kind" value={form.kind} onChange={handleChange} /></label>
        <label>名前<input type="text" name="name" value={form.name} onChange={handleChange} /></label>
        <label>性別
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">選択してください</option>
            <option value="0">オス</option>
            <option value="1">メス</option>
          </select>
        </label>
        <label>年齢<input type="number" name="age" value={form.age} onChange={handleChange} /></label>
         <label>対象の実験工程
          <select 
            name="projectProcess" 
            value={form.projectProcess} 
            onChange={handleChange}
            // processがまだ取得できていない間は無効化する
            disabled={error && process.length === 0}
          >
            <option value="">選択してください</option>
            {renderProcessOptions()} 
          </select>
        </label>
        <label>備考<input type="text" name="note" value={form.note} onChange={handleChange} /></label>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button type="button" onClick={() => navigate(`/equipment?projectId=${projectId}`)}>戻る</button>
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
}