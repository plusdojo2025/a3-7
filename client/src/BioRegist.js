import React, { useState } from 'react';
import axios from 'axios';
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

  const [image, setImage] = useState(null); // ← 画像用state追加
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // 画像1枚だけ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kind || !form.name || !form.gender || !form.age || !form.projectprocess) {
      setError('入力されていない項目があります');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      formData.append('image', image); // ← 画像を追加
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value); // ← 他の項目も追加
      });

      await axios.post('/api/equipment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('登録完了！');
    } catch (err) {
      console.error(err);
      setError('登録に失敗しました');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }} 
    className='bioRegist-card'>
      <h2>生物の登録</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* 画像アップロード欄 */}
        <div>
          <label>画像</label><br/>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>種類</label><br/>
          <input type="text" name="kind" value={form.kind} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>名前</label><br/>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>
       

        <div style={{ marginTop: 10 }}>
        <label>性別</label><br/>
        <input type="text" name="gender" value={form.gender} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>年齢</label><br/>
          <input type="text" name="age" value={form.age} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>対象の実験工程</label><br/>
          <input type="text" name="projectProcess" value={form.projectProcess} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>備考</label><br/>
          <input type="text" name="note" value={form.note} onChange={handleChange} />
        </div>

        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={() => window.history.back()}>戻る</button>
          <button type="submit" style={{ backgroundColor: '#cfc', border: '1px solid #9c9', padding: '5px 10px' }}>
            登録
          </button>
        </div>
      </form>
    </div>
  );
}