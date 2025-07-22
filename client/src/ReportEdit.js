import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReportEdit() {
  const { reportId } = useParams();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    createdAt: '',
    projectId: '',
    processId: '',
    equipId: '',
    comment: '',
    projectName: '',
    usageAmount: ''
  });

  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState('');

  // 初期データ取得
  useEffect(() => {
    // 備品リスト
    axios.get('/api/equip')
      .then(res => setEquipmentList(res.data))
      .catch(() => setError('備品リストの取得に失敗しました'));
      
    
   //レポートデータ
    if (reportId) {
      axios.get(`/api/report/${reportId}`)
        .then(res => setForm(res.data))
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
      navigate(-1); // 戻る
    } catch (err) {
      console.error('更新エラー', err.response || err);
      setError('更新に失敗しました');
    }
  };

  return (
    <div className="report-edit" style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2>日報編集</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleUpdate}>
        <div>
          <label>日付:</label><br />
          <input name="createdAt" value={form.createdAt} readOnly />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>研修タイトル:</label><br />
          <input name="projectName" value={form.projectName || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>備品名:</label><br />
          <select name="equipId" value={form.equipId || ''} onChange={handleChange}>
            <option value="">選択してください</option>
            {equipmentList.map(e => (
              <option key={e.equipId} value={e.equipId}>{e.equipName}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>使用量:</label><br />
          <input name="usageAmount" value={form.usageAmount || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>コメント:</label><br />
          <textarea name="comment" value={form.comment || ''} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="button" onClick={() => navigate(-1)}>戻る</button>
          <button type="submit" style={{ marginLeft: 10 }}>更新</button>
        </div>
      </form>
    </div>
  );
}
