import React, { useState } from 'react';
import axios from 'axios';
import './css/EquipmentRegist.css';

const unitMap = {
  '個': 1,
  '箱': 2,
  'kg': 3,
  'g': 4,
  'mg': 5,
  'L': 6,
  'ml': 7
};

const judgeOptions = ['50', '40', '30', '20', '10'];

export default function EquipmentRegist() {
  const [form, setForm] = useState({
    equipName: '',
    limited: '',
    remaining: '',
    unit: '',
    storage: '',
    judge: '',
    remarks: '',
    equipKindId: '0',  //備品:0、生物:1
    projectId: '1',     //ここ保留
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { equipName, limited, remaining, unit, storage } = form;

    if (!equipName || !limited || !remaining || !unit || !storage) {
      setError('すべての必須項目を入力してください。');
      return;
    }

    const formData = new FormData();
    formData.append('equipName', form.equipName);
    formData.append('limited', form.limited);
    formData.append('remaining', form.remaining);
    formData.append('unit', unitMap[form.unit]);
    formData.append('storage', form.storage);
    formData.append('judge', form.judge);
    formData.append('remarks', form.remarks || '');
    if (image) {
      formData.append('picture', image);
    }
    

    try {
      const res = await axios.post(
        'http://localhost:8080/api/equipment/regist',
        formData
      );
      alert('登録成功');
      console.log(res.data);

      //フォームと画像をクリア
      setForm({
        equipName: '',
        limited: '',
        remaining: '',
        unit: '',
        storage: '',
        remarks: '',
        judge: '',
      });
      setImage(null);
      setError('');
    } catch (err) {
      console.error('登録失敗:', err);
      alert('登録に失敗しました。');
    }

        window.history.back();
  };



  
  return (
    <form onSubmit={handleSubmit}>
      <h2>備品登録</h2>
      <label>画像: <input type="file" accept="image/*" onChange={handleImageChange} /></label><br /><br />
      <label>備品名: <input name="equipName" value={form.equipName} onChange={handleChange} /></label><br />
      <label>期限: <input type="date" name="limited" value={form.limited} onChange={handleChange} /></label><br />
      <label>残量: <input type="number" name="remaining" value={form.remaining} onChange={handleChange} /></label><br />
      <label>単位:
        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="">選択</option>
          {Object.keys(unitMap).map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </label><br />
      <label>保管場所: <input name="storage" value={form.storage} onChange={handleChange} /></label><br />
      <label>アラートのタイミング:
        <select name="judge" value={form.judge} onChange={handleChange}>
          <option value="">選択</option>
          {judgeOptions.map(opt => (
            <option key={opt} value={opt}>{opt}%</option>
          ))}
        </select>
      </label><br />
      <label>備考: <input name="remarks" value={form.remarks} onChange={handleChange} /></label><br />
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="button-group">
          <button type="button" onClick={() => window.history.back()}>戻る</button>
          <button type="submit">登録</button>
        </div>
    </form>
  );
}