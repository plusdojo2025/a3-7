import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/reportEdit.css';


export default function ReportEdit() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    createdAt: '',
    projectId: '',
    processId: '',
    usageAmount: ''
  });

  const [projectName, setProjectName] = useState('');
  const [processName, setProcessName] = useState('');
  const [projectId, setProjectId] = useState(0);
  const [processId, setProcessId] = useState(0);
  const [error, setError] = useState('');
 
 

  // 初期データ取得
  useEffect(() => {
    // レポート内容の取得
    if (reportId) {
      axios.get(`/api/report/${reportId}`)
        .then(res => {
          setForm(res.data);
          // projectName を取得
          setProjectId(res.data.projectId);
          setProcessId(res.data.processId);
          if (res.data.projectId) {
            axios.get(`/api/project/${res.data.projectId}`)
              .then(resp => setProjectName(resp.data.projectName))
              .catch(() => setProjectName('（取得失敗）'));
          }
          if(res.data.processId) {
            axios.get(`/api/process/${res.data.processId}/`)
              .then(resp => setProcessName(resp.data.processName))
              .catch(() => setProcessName('（取得失敗）'));
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
      navigate(`/process?id=${processId}`); // 前のページに戻る
    } catch (err) {
      console.error('更新エラー', err.response || err);
      setError('更新に失敗しました');
    }
  };

  return (
  <div >
    <h2>日報編集</h2>
    {projectName} - {processName}
  <div className="report-container">
     {error && <p className="error">{error}</p>}

    <form onSubmit={handleUpdate}>
      <div className="form-group">
        <label>日付:<input name="createdAt" value={form.createdAt} readOnly /></label>
        
      </div>
      <div className="form-group">
        <label>コメント: <textarea name="comment" value={form.comment || ''} onChange={handleChange} /></label>
       
      </div>

      <div className="report-edit-button-area">
        <button type="button" onClick={() => navigate(`/process?id=${processId}`)} className='report-edit-back'>戻る</button>
        <button type="submit">更新</button>
      </div>
    </form>
  </div>
    
  </div>
);

}
