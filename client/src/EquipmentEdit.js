import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/EquipmentEdit.css';

const alertTimingOptions = ['50', '40', '30', '20', '10'];

export default function EquipmentEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const equipmentId = location.state?.equipmentId;
  const projectIdFromState = location.state?.projectId;

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
  const [unitMap, setUnitMap] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState(null);

  // 初期データ読み込み
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectIdFromUrl = params.get('projectId');

    const resolvedProjectId = projectIdFromState || projectIdFromUrl;
    if (resolvedProjectId) {
      setProjectId(resolvedProjectId);
    } else {
      console.error('projectId が見つかりません');
    }

    if (!equipmentId) {
      setError('備品IDが指定されていません');
      setLoading(false);
      return;
    }

    // 単位の取得
    axios.get("/api/equipment/edit/get/units").then(respons => {
      setUnitMap(respons.data);
      console.log(respons.data);

    })
    // 備品データの取得
    axios.get(`/api/equipment/edit/${equipmentId}`)
      .then(res => {
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
      .catch(err => {
        console.error('備品データ取得エラー:', err);
        setError('備品データの取得に失敗しました');
        setLoading(false);
      });
  }, [equipmentId, location.search, projectIdFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
  e?.preventDefault();

  if (!projectId) {
    setError('projectIdが取得できていません');
    return;
  }

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
    formData.append('projectId', projectId);

    await axios.put(`/api/equipment/edit/${equipmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    alert('更新完了！');
    navigate(`/equipment?projectId=${projectId}`);
  } catch (err) {
    console.error('更新エラー:', err);
    setError('更新に失敗しました');
  }
};

  const handleDelete = async () => {
    if (!projectId) {
      alert('projectIdが不明なため削除できません');
      return;
    }

    if (!window.confirm('本当に削除しますか？')) return;

    try {
      await axios.delete(`/api/equipment/edit/${equipmentId}`);
      alert('削除完了！');
      navigate(`/equipment?projectId=${projectId}`);
    } catch (err) {
      console.error('削除エラー:', err);
      setError('削除に失敗しました');
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className='equipmentEdit-card'>
      <h2>備品の詳細</h2>

      <form onSubmit={handleUpdate} encType="multipart/form-data" className="edit-form">
        <div className="image-section">
          <div className="image-label">画像</div>
          {newImage ? (
            <img src={URL.createObjectURL(newImage)} alt="新しい画像" className="preview-image" />
          ) : currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="既存画像"
              className="preview-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <div className="no-image-placeholder">画像なし</div>
          )}
          <div className="file-input-container">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>備品名</label>
            <input type="text" name="itemName" value={form.itemName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>残量</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />
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
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>保管場所</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>アラートのタイミング</label>
            <select name="alertTiming" value={form.alertTiming} onChange={handleChange}>
              <option value="">選択</option>
              {alertTimingOptions.map(a => (
                <option key={a} value={a}>{a}%</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>備考</label>
            <input type="text" name="note" value={form.note} onChange={handleChange} />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>


  <div className="button-group">
    <button type="button" onClick={() => navigate(`/equipment?projectId=${projectId}`)} className="button-back">
      戻る
    </button>
    <button type="button" onClick={handleDelete} className="button-delete">
      削除
    </button>
    <button type="submit" onClick={handleUpdate} form="equipment-edit-form" className="button-update">
      更新
    </button>
  </div>
</div>
        
      );
}