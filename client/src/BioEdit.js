import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useSearchParams } from 'react-router-dom';
import './css/BioEdit.css';

export default function BioEdit() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const equipmentId = searchParams.get('equipmentId') || 
                     searchParams.get('id') ||
                     searchParams.get('biologyId') ||
                     location.state?.equipmentId || 
                     location.state?.equipId ||
                     location.state?.biologyId ||
                     location.state?.id;

  console.log('BioEdit初期化');
  console.log('URLパラメータ:', Object.fromEntries(searchParams));
  console.log('location.state:', location.state);
  console.log('取得されたequipmentId:', equipmentId);

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

  useEffect(() => {
    if (!equipmentId) {
      setError('生物IDが取得できませんでした');
      console.error('equipmentIdが未定義です');
      return;
    }

    const tryGetBiologyData = async () => {
      const endpoints = [
        `/api/biology/edit/${equipmentId}`,
        `/api/equip/${equipmentId}`,
        `/api/equip/${equipmentId}/details`,
        `/api/biology/${equipmentId}`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`${endpoint} にリクエスト送信`);
          const response = await axios.get(endpoint);
          console.log(`${endpoint} レスポンス:`, response.data);

          const data = response.data;

          if (data.equipId && data.equipName) {
            console.log('基本備品データ取得成功:', endpoint);
            return response;
          }
        } catch (error) {
          console.log(`${endpoint} でエラー:`, error.response?.status || error.message);
          continue;
        }
      }
      throw new Error('すべてのAPIエンドポイントでデータ取得に失敗しました');
    };

    tryGetBiologyData()
      .then((res) => {
        console.log('生物データ取得成功:', res.data);
        const data = res.data;
        setForm({
          kind: data.kind ?? '',
          name: data.name ?? '',
          gender: data.gender ?? '',
          age: data.age ?? '',
          projectProcess: data.projectProcess ?? '',
          note: data.note ?? '',
        });
        setCurrentImageUrl(data.imageUrl ?? '');
        setError('');
      })
      .catch((err) => {
        console.error('生物データ取得エラー:', err);
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

    if (!equipmentId) {
      setError('生物IDが不明なため更新できません');
      return;
    }

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

      await axios.put(`/api/biology/edit/${equipmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('更新完了！');
      window.history.back();
    } catch (err) {
      console.error('更新エラー:', err);
      setError('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!equipmentId) {
      setError('生物IDが不明なため削除できません');
      return;
    }

    if (!window.confirm('本当に削除しますか？')) return;

    try {
      const deleteEndpoints = [
        `/api/biology/edit/${equipmentId}`,
        `/api/equip/edit/${equipmentId}`,
        `/api/biology/${equipmentId}`,
        `/api/equip/${equipmentId}`
      ];

      let deleteSuccess = false;
      for (const endpoint of deleteEndpoints) {
        try {
          await axios.delete(endpoint);
          deleteSuccess = true;
          break;
        } catch (error) {
          console.log(`${endpoint} での削除エラー:`, error.response?.status || error.message);
          continue;
        }
      }

      if (!deleteSuccess) {
        throw new Error('すべての削除APIエンドポイントで失敗しました');
      }

      alert('削除完了！');
      window.history.back();
    } catch (err) {
      console.error('削除エラー:', err);
      setError('削除に失敗しました');
    }
  };

  if (!equipmentId) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, textAlign: 'center' }}>
        <h2>エラー</h2>
        <p>生物IDが取得できませんでした。</p>
        <button onClick={() => window.history.back()}>戻る</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }} className="bioEdit-card">
      <h2>生物の詳細</h2>
      <form onSubmit={handleUpdate} encType="multipart/form-data" style={{ display: 'flex', gap: 20 }}>
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

        <div style={{ flex: 1 }}>
          <div>
            <label>種類</label><br />
            <input type="text" name="kind" value={form.kind} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>名前</label><br />
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>性別</label><br />
            <input type="text" name="gender" value={form.gender} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>年齢</label><br />
            <input type="text" name="age" value={form.age} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>対象の実験工程</label><br />
            <input type="text" name="projectProcess" value={form.projectProcess} onChange={handleChange} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>備考</label><br />
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
