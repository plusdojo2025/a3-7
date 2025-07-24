import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import './css/Common.css';
import './css/equipment.css';

export default function Equipment() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  

  //URLからprojectIdを取得
  const [currentProjectId, setCurrentProjectId] = useState(null);

  //備品を検索する非同期関数
  const performSearch = useCallback(async (projectIdToSearch, searchKeyword) => {
    setLoading(true);
    try {
      const url = new URL('/api/equip/search', window.location.origin);
      if (searchKeyword) {
        url.searchParams.append('keyword', searchKeyword);
      }
      if (projectIdToSearch) {
        url.searchParams.append('projectId', projectIdToSearch);
      }

      const response = await axios.get(url.toString());
      console.log('検索結果:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // アラートをロードする非同期関数
  const loadAlerts = async (projectIdToLoadAlerts) => { 
    try {
      // アラート機能は後で実装。
      setAlerts([]); // 一時的に空配列をセット
    } catch (error) {
      console.error('アラート取得エラー:', error);
      setAlerts([]); // エラー時も空配列をセット
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search); 
    const projectIdFromUrl = params.get('projectId');

    if (projectIdFromUrl) {
      //setCurrentProjectId(projectIdFromUrl); // stateにprojectIdを保存
      console.log('useEffectでprojectIdを検出:', projectIdFromUrl);

      // プロジェクトIDを渡して初期検索とアラートロードを行う
      performSearch(projectIdFromUrl, ''); 
      loadAlerts(projectIdFromUrl);
    } else {
      // projectIdがない場合
      console.log('projectIdが見つかりませんでした。');
      setCurrentProjectId(null);
      setItems([]); 
      setKeyword(''); 
      setAlerts([]); 
    }
  }, [location.search, performSearch]); 

  const handleSearchButtonClick = () => {

    if (!currentProjectId) {
      alert('プロジェクトIDが不明です。')
      return;
    }
    performSearch(currentProjectId, keyword);
  };

  // 備品登録ページへの遷移ハンドラに projectId を渡すロジックを追加
  const handleNavigateToEquipmentRegist = () => {
    if (currentProjectId) {
      navigate(`/equipmentRegist?projectId=${currentProjectId}`);
    } else {
      alert('プロジェクトIDが不明なため、備品登録画面へ遷移できません。');
    }
  };

  const handleItemClick = (equipId) => {
    // 備品編集ページへ equipId と projectId を state として渡す
    navigate(`/equipmentEdit`, { state: { equipmentId: equipId, projectId: currentProjectId } });
  };

  // 画像エラー時のフォールバック処理 (冗長なインラインコードを避けるため再利用)
  const handleImageError = (e) => {
    e.target.style.display = 'none'; // エラーになった画像を非表示に
    if (e.target.nextElementSibling) {
      e.target.nextElementSibling.style.display = 'block'; // 直後のフォールバック要素を表示
    }
  };

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
        ) : items.length === 0 && !loading ? (
          <p>該当する備品が見つかりませんでした。</p>
        ) : (
          items.map((item) => (
            <div
              className="item-card"
              key={item.equipId}
              onClick={() => handleItemClick(item.equipId)}
              style={{ cursor: 'pointer' }}
            >
              {/* 画像の表示 */}
               {item.picture ? ( // item.picture（Base64データ）が存在するかだけをチェック
                <>
                  <img
                    src={`data:image/jpeg;base64,${item.picture}`} 
                    alt={`${item.equipName}の画像`}
                    className="item-image"
                    onLoad={() => console.log('画像読み込み成功: Base64 image')} 
                    onError={handleImageError} 
                  />
                  <div className="no-image-fallback">
                    No image
                  </div>
                </>
              ) : (
                // pictureデータがない場合に表示される「No image」
                <div className="no-image">No image</div>
              )}
              <div className="item-name">{item.equipName}</div>
            </div>
          ))
        )}
      </div>

      {/* ボタンエリア */}
      <div className="button-area">
        <button onClick={() => navigate(-1)}>戻る</button>
        <button onClick={handleNavigateToEquipmentRegist}>備品登録</button>
        <button onClick={() => navigate('/bioRegist')}>生体登録</button>
      </div>
    </div>
  );
}