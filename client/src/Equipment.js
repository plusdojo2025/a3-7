import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Common.css'; 
import './css/equipment.css';

export default function EquipmentPage() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //URLからprojectIdを取得
  const [currentProjectId, setCurrentProjectId] = useState(null);

  //備品を検索する非同期関数
  //projectIdToSearchとsearchKeywordを品数で受け取れるように
  const performSearch = async (projectIdToSearch, searchKeyword) => {
    setLoading(true);
    try{
      //projectIdToSearchがなければURLに追加、なけらば追加しない
      const url = new URL('/api/equip/search', window.location.origin);
      if (searchKeyword) {
        url.searchParams.append('keyword', searchKeyword);
      }
      if (projectIdToSearch) { // projectIdがあればパラメータに追加
        url.searchParams.append('projectId', projectIdToSearch);
      }

      const response = await axios.get(url.toString()); // URLオブジェクトを文字列に変換して使用
      console.log('検索結果:', response.data);
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
      // const response = await axios.get('/api/alerts/project?projectId=1');
      // setAlerts(response.data);
      setAlerts([]); // 一時的に空配列をセット
    } catch (error) {
      console.error('アラート取得エラー:', error);
      setAlerts([]); // エラー時も空配列をセット
    }
  };

   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectIdFromUrl = params.get('projectId');
    
    if (projectIdFromUrl) {
      setCurrentProjectId(projectIdFromUrl); // stateにprojectIdを保存
      console.log('useEffectでprojectIdを検出:', projectIdFromUrl);
      
      // プロジェクトIDを渡して初期検索とアラートロードを行う
      performSearch(projectIdFromUrl, ''); // 初期表示はキーワードなし
      loadAlerts(projectIdFromUrl);
    } else {
      // projectIdがない場合
      console.log('projectIdが見つかりませんでした。全備品を表示します。');
      performSearch(null, ''); // projectIdなしで全件検索（API側が対応している場合）
      loadAlerts(null); // projectIdなしでアラートロード
    }

  }, []);

  const handleSearchButtonClick = () => {
    performSearch(currentProjectId, keyword); 
  };

  //検索ボタンクリック時のハンドラ
  const handleItemClick = (equipId) => {
    navigate(`/equipmentEdit`, { state: { equipmentId: equipId } });
  };

  return (
    <div className="container">
     
      
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
              handleSearchButtonClick();
            }
          }}
        />
        <button onClick={handleSearchButtonClick} disabled={loading}>
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
              style={{ cursor: 'pointer' }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`${item.equipName}の画像`}
                  className="item-image"
                  onLoad={() => console.log('画像読み込み成功:', item.imageUrl)}
                  onError={(e) => {
                    console.log('画像読み込み失敗:', item.imageUrl);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
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