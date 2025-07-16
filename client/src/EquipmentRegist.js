import React, { useState } from 'react';
import axios from 'axios';
import './css/EquipmentRegist.css';


const unitOptions = ['個', '箱', 'kg', 'g', 'mg', 'L', 'ml'];
const alertTimingOptions = ['50%', '40%', '30%', '20%', '10%'];

export default function EquipmentRegist() {
  const [form, setForm] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    location: '',
    alertTiming: '',
    note: ''
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

    if (!form.itemName || !form.quantity || !form.unit || !form.expiryDate || !form.location || !form.alertTiming) {
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
    className='equipmentRegist-card'>
      <h2>備品の登録</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* 画像アップロード欄 */}
        <div>
          <label>画像</label><br/>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>備品名</label><br/>
          <input type="text" name="itemName" value={form.itemName} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>残量</label><br/>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              style={{ width: '50%' }}
            />
            <select name="unit" value={form.unit} onChange={handleChange} style={{ width: '50%' }}>
              <option value="">選択</option>
              {unitOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>期限</label><br/>
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>保管場所</label><br/>
          <input type="text" name="location" value={form.location} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>アラートのタイミング</label><br/>
          <select name="alertTiming" value={form.alertTiming} onChange={handleChange}>
            <option value="">選択</option>
            {alertTimingOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
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