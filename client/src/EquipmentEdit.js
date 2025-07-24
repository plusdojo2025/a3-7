import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/EquipmentEdit.css';

const alertTimingOptions = ['50', '40', '30', '20', '10'];

/*const unitMap = {
  '個': 1,
  '箱': 2,
  'kg': 3,
  'g': 4,
  'mg': 5,
  'L': 6,
  'ml': 7
};*/


export default function EquipmentEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const equipmentId = location.state?.equipmentId;

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
  const [loading, setLoading] = useState(true);
  const [unitMap,setUnitMap] = useState([]);

  useEffect(() => {
    if (!equipmentId) {
      setError('備品IDが指定されていません');
      setLoading(false);
      return;
    }

    axios.get("/api/equipment/edit/get/units").then(respons => {
      setUnitMap(respons.data);
      console.log(respons.data);

    })

    axios.get(`/api/equipment/edit/${equipmentId}`)
      .then((res) => {
        const data = res.data;
        setForm({
          itemName: data.itemName,
          quantity: data.quantity,
          unit: data.unit || '',
          expiryDate: data.expiryDate,
          location: data.location,
          alertTiming: data.alertTiming,
          note: data.note || ''
        });
        setCurrentImageUrl(data.imageUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error('データ取得エラー:', err);
        setError('データ取得に失敗しました');
        setLoading(false);
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
      formData.append('unit', form.unit);
      formData.append('expiryDate', form.expiryDate);
      formData.append('location', form.location);
      formData.append('alertTiming', form.alertTiming);
      formData.append('note', form.note);

      await axios.put(`/api/equipment/edit/${equipmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

        console.log(formData);

    for(let[key,value] of formData.entries()){
      console.log(key + value);
    }


      alert('更新完了！');
      navigate('/equipment');
    } catch (err) {
      console.error('更新エラー:', err);
      setError('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      await axios.delete(`/api/equipment/edit/${equipmentId}`);
      alert('削除完了！');
      navigate('/equipment');
    } catch (err) {
      console.error('削除エラー:', err);
      setError('削除に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!equipmentId) {
    return (
      <div className='equipmentEdit-card'>
        <h2>エラー</h2>
        <p>備品IDが指定されていません</p>
        <button onClick={() => navigate('/equipment')}>戻る</button>
      </div>
    );
  }

  return (
    <div className='equipmentEdit-card'>
      <h2>備品の詳細</h2>
      <form onSubmit={handleUpdate} encType="multipart/form-data" className="edit-form">
        {/* 左側 画像表示エリア */}
        <div className="image-section">
          <div className="image-label">画像</div>
          {newImage ? (
            <img
              src={URL.createObjectURL(newImage)}
              alt="新しい画像プレビュー"
              className="preview-image"
            />
          ) : currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="登録済み画像"
              className="preview-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <div className="no-image-placeholder">
              画像なし
            </div>
          )}
          <div className="image-error-message">画像の読み込みに失敗しました</div>
          <div className="file-input-container">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {/* 右側 フォーム入力エリア */}
        <div className="form-section">
          <div className="form-group">
            <label>備品名</label>
            <input 
              type="text" 
              name="itemName" 
              value={form.itemName} 
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>残量</label>
            <input 
              type="number" 
              name="quantity" 
              value={form.quantity} 
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>単位</label>
            <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="">選択</option>
          {unitMap.map((unit, index) => <option key={index} value={unit.unitId}>{unit.unit}</option>)}
        </select>      
        </div>

          <div className="form-group">
            <label>期限</label>
            <input 
              type="date" 
              name="expiryDate" 
              value={form.expiryDate} 
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>保管場所</label>
            <input 
              type="text" 
              name="location" 
              value={form.location} 
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>アラートのタイミング</label>
            <select 
              name="alertTiming" 
              value={form.alertTiming} 
              onChange={handleChange}
              className="form-input"
            >
              <option value="">選択</option>
              {alertTimingOptions.map((a) => (
                <option key={a} value={a}>{a}%</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>備考</label>
            <input 
              type="text" 
              name="note" 
              value={form.note} 
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button 
          type="button" 
          onClick={() => navigate('/equipment')}
          className="button-back"
        >
          戻る
        </button>
        <button
          type="button"
          className="button-delete"
          onClick={handleDelete}
        >
          削除
        </button>
        <button
          type="submit"
          className="button-update"
          onClick={handleUpdate}
        >
          更新
        </button>
      </div>
    </div>
  );
}