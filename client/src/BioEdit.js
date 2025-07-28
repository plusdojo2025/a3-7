import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useSearchParams } from 'react-router-dom';
import './css/BioEdit.css';

export default function BioEdit() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // 複数の方法でequipmentIdを取得
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
  const [loading, setLoading] = useState(true);

  // 画面初期表示で既存データを取得
  useEffect(() => {
    if (!equipmentId) {
      setError('生物IDが取得できませんでした');
      console.error('equipmentIdが未定義です');
      setLoading(false);
      return;
    }

    // const tryGetBiologyData = async () => {
    //   const endpoints = [
    //     `/api/biology/edit/${equipmentId}`,
    //     `/api/equip/${equipmentId}`,
    //     `/api/equip/${equipmentId}/details`,
    //     `/api/biology/${equipmentId}`,
    //   ]};

    // 修正されたAPIエンドポイントを使用
    const fetchBiologyData = async () => {
      try {
        console.log(`/api/biology/edit/equip/${equipmentId} にリクエスト送信`);
        const response = await axios.get(`/api/biology/edit/equip/${equipmentId}`);
        console.log('生物データ取得成功:', response.data);
        
        const data = response.data;
        
        // 性別の表示変換（0:オス, 1:メス）
        const genderDisplay = data.gender === 0 ? 'オス' : data.gender === 1 ? 'メス' : data.gender;
        
        setForm({
          kind: data.kind || '',
          name: data.name || '',
          gender: genderDisplay,
          age: data.age || '',
          projectProcess: data.projectProcess || '',
          note: data.note || ''
        });
        
        setCurrentImageUrl(data.imageUrl || '');
        setError('');
        setLoading(false);
        
      } catch (err) {
        console.error('生物データ取得エラー:', err);
        setError('データ取得に失敗しました: ' + (err.response?.data || err.message));
        setLoading(false);
      }
    };

    fetchBiologyData();
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

    // 必須項目チェック
    if (!form.kind || !form.name || !form.gender || !form.age || !form.projectProcess) {
      setError('入力されていない項目があります');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      if (newImage) {
        formData.append('image', newImage);
      }
      
      // フォームデータをAPIが期待する形式で追加
      formData.append('kind', form.kind);
      formData.append('name', form.name);
      // 性別の変換（表示値から数値へ）
      const genderValue = form.gender === 'オス' ? '0' : form.gender === 'メス' ? '1' : form.gender;
      formData.append('gender', genderValue);
      formData.append('age', form.age);
      formData.append('projectProcess', form.projectProcess);
      formData.append('note', form.note || '');

      // 修正されたAPIエンドポイントを使用
      await axios.put(`/api/biology/edit/equip/${equipmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('更新完了！');
      window.history.back();
    } catch (err) {
      console.error('更新エラー:', err);
      setError('更新に失敗しました: ' + (err.response?.data || err.message));
    }
  };

  const handleDelete = async () => {
    if (!equipmentId) {
      setError('生物IDが不明なため削除できません');
      return;
    }

    if (!window.confirm('本当に削除しますか？')) return;
    
    try {
      // 修正されたAPIエンドポイントを使用
      await axios.delete(`/api/biology/edit/equip/${equipmentId}`);
      alert('削除完了！');
      window.history.back();
    } catch (err) {
      console.error('削除エラー:', err);
      setError('削除に失敗しました: ' + (err.response?.data || err.message));
    }
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, textAlign: 'center' }}>
        <h2>読み込み中...</h2>
      </div>
    );
  }

  // equipmentIdが取得できない場合の表示
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
          ) : currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="登録済み画像"
              style={{ maxWidth: '100%', maxHeight: 300 }}
              onError={(e) => {
                e.target.style.display = 'none';
                const placeholder = e.target.nextSibling;
                if (placeholder) placeholder.style.display = 'block';
              }}
            />
          ) : (
            <div style={{ padding: 50, backgroundColor: '#f0f0f0' }}>
              画像なし
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {/* 右側 フォーム入力エリア */}
        <div style={{ flex: 1 }}>
          <div>
            <label>種類</label><br/>
            <input 
              type="text" 
              name="kind" 
              value={form.kind} 
              onChange={handleChange} 
              style={{ width: '100%', padding: 5 }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>名前</label><br/>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              style={{ width: '100%', padding: 5 }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>性別</label><br/>
            <select 
              name="gender" 
              value={form.gender} 
              onChange={handleChange}
              style={{ width: '100%', padding: 5 }}
            >
              <option value="">選択してください</option>
              <option value="オス">オス</option>
              <option value="メス">メス</option>
            </select>
          </div>

          <div style={{ marginTop: 10 }}>
            <label>年齢</label><br/>
            <input 
              type="number" 
              name="age" 
              value={form.age} 
              onChange={handleChange} 
              style={{ width: '100%', padding: 5 }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>対象の実験工程</label><br/>
            <input 
              type="text" 
              name="projectProcess" 
              value={form.projectProcess} 
              onChange={handleChange} 
              style={{ width: '100%', padding: 5 }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>備考</label><br/>
            <textarea 
              name="note" 
              value={form.note} 
              onChange={handleChange} 
              rows="3"
              style={{ width: '100%', padding: 5 }}
            />
          </div>
        </div>
      </form>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => window.history.back()}>戻る</button>
        <button
          type="button"
          style={{ backgroundColor: '#f88', border: '1px solid #c00', padding: '5px 10px', cursor: 'pointer' }}
          onClick={handleDelete}
        >
          削除
        </button>
        <button
          type="button"
          style={{ backgroundColor: '#cfc', border: '1px solid #9c9', padding: '5px 10px', cursor: 'pointer' }}
          onClick={handleUpdate}
        >
          更新
        </button>
      </div>
    </div>
  );
}