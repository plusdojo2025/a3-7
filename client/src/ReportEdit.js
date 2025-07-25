import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/report.css';


export default function ReportEdit() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    createdAt: '',
    projectId: '',
    processId: '',
    equipId: '',
    comment: '',
    usageAmount: ''
  });

  const [projectName, setProjectName] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState('');
 
 

  // 初期データ取得
  useEffect(() => {
    // 備品リストの取得
    axios.get('/api/equip')
      .then(res => setEquipmentList(res.data))
      .catch(() => setError('備品リストの取得に失敗しました'));

    // レポート内容の取得
    if (reportId) {
      axios.get(`/api/report/${reportId}`)
        .then(res => {
          setForm(res.data);
          // projectName を取得
          const projectId = res.data.projectId;
          if (projectId) {
            axios.get(`/api/project/${projectId}`)
              .then(resp => setProjectName(resp.data.projectName))
              .catch(() => setProjectName('（取得失敗）'));
          }
        })
        .catch(() => setError('レポートの取得に失敗しました'));
    }
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/report/${reportId}`, form);
      alert('更新成功！');
      navigate(-1); // 前のページに戻る
    } catch (err) {
      console.error('更新エラー', err.response || err);
      setError('更新に失敗しました');
    }
  };

  return (
  <div >
    <h2>日報編集</h2>
  <div className="report-container">
     {error && <p className="error">{error}</p>}

    <form onSubmit={handleUpdate}>
      <div className="form-group">
        <label>日付:<input name="createdAt" value={form.createdAt} readOnly /></label>
        
      </div>

      <div className="form-group">
        <label>研修タイトル:  <input name="projectName" value={projectName} readOnly /></label>
      
      </div>

      <div className="form-group">
        <label>備品名:<select name="equipId" value={form.equipId || ''} onChange={handleChange}>
          <option value="">選択してください</option>
          {equipmentList.map(e => (
            <option key={e.equipId} value={e.equipId}>{e.equipName}</option>
          ))}
        </select></label>
        
      </div>

      <div className="form-group">
        <label>使用量:<input name="usageAmount" value={form.usageAmount} onChange={handleChange} /></label>
        
      </div>

      <div className="form-group">
        <label>コメント: <textarea name="comment" value={form.comment || ''} onChange={handleChange} /></label>
       
      </div>

      <div className="button-group">
        <button type="button" onClick={() => navigate(-1)}>戻る</button>
        <button type="submit">更新</button>
      </div>
    </form>
  </div>
    
  </div>
);

}
