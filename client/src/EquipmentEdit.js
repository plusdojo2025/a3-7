import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/EquipmentEdit.css';

const alertTimingOptions = ['50', '40', '30', '20', '10'];

const unitMap = {
  '個': 1,
  '箱': 2,
  'kg': 3,
  'g': 4,
  'mg': 5,
  'L': 6,
  'ml': 7
};

const reverseUnitMap = Object.fromEntries(Object.entries(unitMap).map(([k, v]) => [v, k]));

export default function EquipmentEdit({ equipmentId }) {
  const [form, setForm] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    location: '',
    alertTiming: '',
    note: ''
  });

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/equipment/details/equip/${equipmentId}`)
      .then((res) => {
        const data = res.data;
        setForm({
          itemName: data.itemName,
          quantity: data.quantity,
          unit: reverseUnitMap[data.unit],
          expiryDate: data.expiryDate,
          location: data.location,
          alertTiming: data.alertTiming,
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

    if (!form.itemName || !form.quantity || !form.unit || !form.expiryDate || !form.location || !form.alertTiming) {
      setError('入力されていない項目があります');
      return;
    }

    setError('');

    try {
      const formData = new FormData();

      if (newImage) {
        formData.append('image', newImage);
      }

      formData.append('itemName', form.itemName);
      formData.append('quantity', form.quantity);
      formData.append('unit', unitMap[form.unit]); // ← ここがポイント！
      formData.append('expiryDate', form.expiryDate);
      formData.append('location', form.location);
      formData.append('alertTiming', form.alertTiming);
      formData.append('note', form.note);

      await axios.put(`/equipment/details/equip/${equipmentId}`, formData, {
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
      await axios.delete(`/equipment/details/equip/${equipmentId}`);
      alert('削除完了！');
      window.history.back();
    } catch (err) {
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }} 
     className='equipmentEdit-card'>
      <h2>備品の詳細</h2>
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
            <label>備品名</label><br/>
            <input type="text" name="itemName" value={form.itemName} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>残量</label><br/>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>単位</label><br/>
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="">選択</option>
              {Object.entries(unitMap).map(([label, value]) => (
                <option key={value} value={label}>{label}</option>
              ))}
            </select>
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
                <option key={a} value={a}>{a}%</option>
              ))}
            </select>
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