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

    if (!form.kind || !form.name || !form.gender || !form.age || !form.projectProcess) {
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
      formData.append('projectId', 1); //とりあえず1にしとく

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

      alert('登録完了！');
    } catch (err) {
      console.error(err);
      setError('登録に失敗しました');
    }
  };

  return (
    <div>
      <h2>生物の登録</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>画像<input type="file" accept="image/*" onChange={handleImageChange} /></label>
        <label>種類<input type="text" name="kind" value={form.kind} onChange={handleChange} /></label>
        <label>名前<input type="text" name="name" value={form.name} onChange={handleChange} /></label>
        <label>性別（0オス/1メス）<input type="number" name="gender" value={form.gender} onChange={handleChange} /></label>
        <label>年齢<input type="number" name="age" value={form.age} onChange={handleChange} /></label>
        <label>対象の実験工程<input type="number" name="projectProcess" value={form.projectProcess} onChange={handleChange} /></label>
        <label>備考<input type="text" name="note" value={form.note} onChange={handleChange} /></label>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button type="button" onClick={() => window.history.back()}>戻る</button>
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
}