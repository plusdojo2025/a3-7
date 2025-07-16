import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/BioEdit.css';

const alertTimingOptions = ['50%', '40%', '30%', '20%', '10%'];

export default function EquipmentEdit({ equipmentId }) {
  const [form, setForm] = useState({
    kind: '',
    name: '',
    gender: '',
    age: '',
    projectProcess: '',
    note: '',
  });

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');

  // 画面初期表示で既存データを取得
  useEffect(() => {
    axios.get(`/api/equipment/${equipmentId}`)
      .then((res) => {
        const data = res.data;
        setForm({
          kind: data.kind,
          name: data.name,
          gender: data.gender,
          age: data.age,
          projectProcess: data.projectProcess,
          note: data.note
        });
        setCurrentImageUrl(data.imageUrl);
      })
      .catch((err) => {
        console.error(err);
        setError('データ取得に失敗しました');
      });
  }, [equipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.kind || !form.name || !form.gender || !form.age || !form.projectProcess || !form.note) {
      setError('入力されていない項目があります');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      if (newImage) {
        formData.append('image', newImage);
      }
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(`/api/equipment/${equipmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('更新完了！');
      window.history.back();
    } catch (err) {
      console.error(err);
      setError('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      await axios.delete(`/api/equipment/${equipmentId}`);
      alert('削除完了！');
      window.history.back();
    } catch (err) {
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }} 
    className="bioEdit-card">
      <h2>生物の詳細</h2>
      <form onSubmit={handleUpdate} encType="multipart/form-data" style={{ display: 'flex', gap: 20 }}>
        {/* 左側 画像表示エリア */}
        <div style={{ flex: 1, textAlign: 'center', border: '1px solid #ccc', padding: 10 }}>
          <div>画像</div>
          {newImage ? (
            <img
              src={URL.createObjectURL(newImage)}
              alt="新しい画像プレビュー"
              style={{ maxWidth: '100%', maxHeight: 300 }}
            />
          ) : (
            currentImageUrl && (
              <img
                src={currentImageUrl}
                alt="登録済み画像"
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            )
          )}
          <div style={{ marginTop: 10 }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {/* 右側 フォーム入力エリア */}
        <div style={{ flex: 1 }}>
          <div>
            <label>種類</label><br/>
            <input type="text" name="kind" value={form.itemName} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>名前</label><br/>
            <input type="number" name="name" value={form.quantity} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>性別</label><br/>
            <input type="text" name="gender" value={form.unit} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>年齢</label><br/>
            <input type="text" name="age" value={form.expiryDate} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>対象の実験工程</label><br/>
            <input type="text" name="projectProcess" value={form.location} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>備考</label><br/>
            <input type="text" name="note" value={form.note} onChange={handleChange} />
          </div>
        </div>
      </form>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => window.history.back()}>戻る</button>
        <button
          type="button"
          style={{ backgroundColor: '#f88', border: '1px solid #c00', padding: '5px 10px' }}
          onClick={handleDelete}
        >
          削除
        </button>
        <button
          type="submit"
          form="editForm"
          style={{ backgroundColor: '#cfc', border: '1px solid #9c9', padding: '5px 10px' }}
          onClick={handleUpdate}
        >
          更新
        </button>
      </div>
    </div>
  );
}