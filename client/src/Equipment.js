import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/equipment.css';

export default function EquipmentPage() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/equip/search?keyword=${encodeURIComponent(keyword)}`);
      setItems(response.data);
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      // アラート機能は後で実装
      setAlerts([]); // 一時的に空配列をセット
    } catch (error) {
      console.error('アラート取得エラー:', error);
      setAlerts([]); // エラー時も空配列をセット
    }
  };

  const handleItemClick = (equipId) => {
    navigate(`/equipmentEdit`, { state: { equipmentId: equipId } });
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  };

  useEffect(() => {
    handleSearch(); // 初期読み込み時に全件表示
    loadAlerts();   // アラート情報を取得
  }, []);

  return (
    <div className="container">
      <h2>備品管理</h2>

      {/* アラート表示エリア */}
      {alerts.length > 0 && (
        <div className="alert-area">
          <h3 className="alert-title">⚠️ アラート ({alerts.length}件)</h3>
          {alerts.slice(0, 3).map((alert, index) => (
            <div key={index} className="alert-item">
              {alert.message}
            </div>
          ))}
          {alerts.length > 3 && (
            <div className="alert-more">
              ...他 {alerts.length - 3} 件のアラート
            </div>
          )}
        </div>
      )}

      {/* 検索バー */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="備品名を検索" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '検索中...' : '検索'}
        </button>
      </div>

      {/* アイテム一覧 */}
      <div className="list-area">
        {loading ? (
          <p>読み込み中...</p>
        ) : items.length === 0 ? (
          <p>該当する備品が見つかりませんでした。</p>
        ) : (
          items.map((item) => (
            <div
              className="item-card"
              key={item.equipId}
              onClick={() => handleItemClick(item.equipId)}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`${item.equipName}の画像`}
                  className="item-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="no-image">No image</div>
              )}
              <div 
                className="no-image-fallback" 
                style={{ display: 'none' }}
              >
                No image
              </div>
              <div className="item-name">{item.equipName}</div>
            </div>
          ))
        )}
      </div>

      {/* ボタンエリア */}
      <div className="button-area">
        <button onClick={() => navigate(-1)}>戻る</button>
        <button onClick={() => navigate('/equipmentRegist')}>備品登録</button>
        <button onClick={() => navigate('/bioRegist')}>生体登録</button>
      </div>
    </div>
  );
}