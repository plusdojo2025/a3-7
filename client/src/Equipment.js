import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import './css/Common.css';
import './css/equipment.css';

/**
 * 備品管理コンポーネント
 * 備品の一覧表示、検索、登録機能を提供
 */
export default function Equipment() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // URLからprojectIdを取得
  const [currentProjectId, setCurrentProjectId] = useState(null);

  /**
   * 備品検索実行処理
   * キーワードとプロジェクトIDで備品を検索
   */
  const performSearch = useCallback(async (projectIdToSearch, searchKeyword) => {
    setLoading(true);
    console.log('備品検索開始:', { projectIdToSearch, searchKeyword });
    
    try {
      const url = new URL('/api/equip/search', window.location.origin);
      if (searchKeyword && searchKeyword.trim()) {
        url.searchParams.append('keyword', searchKeyword.trim());
      }
      if (projectIdToSearch) {
        url.searchParams.append('projectId', projectIdToSearch);
      }

      const response = await axios.get(url.toString());
      console.log('備品検索成功:', response.data.length + '件');
      setItems(response.data);
      
    } catch (error) {
      console.error('備品検索エラー:', error);
      alert('検索に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * アラート情報読み込み処理
   * 備品の在庫アラートを取得（将来実装予定）
   */
  const loadAlerts = async (projectIdToLoadAlerts) => { 
    try {
      // アラート機能は将来実装予定
      setAlerts([]); 
    } catch (error) {
      console.error('アラート取得エラー:', error);
      setAlerts([]);
    }
  };

  // コンポーネント初期化処理
  useEffect(() => {
    const params = new URLSearchParams(location.search); 
    const projectIdFromUrl = params.get('projectId');

    if (projectIdFromUrl) {
      setCurrentProjectId(projectIdFromUrl);
      console.log('プロジェクトID検出:', projectIdFromUrl);

      // 初期検索とアラート読み込み実行
      performSearch(projectIdFromUrl, ''); 
      loadAlerts(projectIdFromUrl);
    } else {
      console.log('プロジェクトIDが見つかりません');
      setCurrentProjectId(null);
      setItems([]); 
      setKeyword(''); 
      setAlerts([]); 
    }
  }, [location.search, performSearch]); 

  /**
   * 検索ボタンクリック処理
   * 現在のキーワードで再検索を実行
   */
  const handleSearchButtonClick = () => {
    if (!currentProjectId) {
      alert('プロジェクトIDが不明です。');
      return;
    }
    console.log('検索実行:', keyword);
    performSearch(currentProjectId, keyword);
  };

  /**
   * 備品登録ページ遷移処理
   * プロジェクトIDを含めて備品登録画面に移動
   */
  const handleNavigateToEquipmentRegist = () => {
    if (currentProjectId) {
      navigate(`/equipmentRegist?projectId=${currentProjectId}`);
    } else {
      alert('プロジェクトIDが不明なため、備品登録画面へ遷移できません。');
    }
  };

  /**
   * 備品詳細ページ遷移処理
   * 選択された備品の編集画面に移動
   */
  const handleItemClick = (equipId) => {
    console.log('備品詳細画面遷移:', equipId);
    navigate(`/equipmentEdit`, { 
      state: { 
        equipmentId: equipId, 
        projectId: currentProjectId 
      } 
    });
  };

  /**
   * 画像エラー処理
   * 画像読み込み失敗時のフォールバック表示
   */
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    if (e.target.nextElementSibling) {
      e.target.nextElementSibling.style.display = 'block';
    }
  };

  return (
    <div className="equipment-container">
      <h2>備品管理</h2>

      {/* アラート表示エリア（将来実装予定） */}
      {alerts.length > 0 && (
        <div className="equipment-alert-area">
          <h3 className="alert-title"> アラート ({alerts.length}件)</h3>
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

      {/* 備品一覧と検索バー統合エリア */}
      <div className="equipment-list-area">
        {/* 検索バー */}
        <div className="equipment-search-bar">
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
            disabled={loading}
          />
          <button 
            onClick={handleSearchButtonClick} 
            disabled={loading}
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        {/* 備品カードグリッド */}
        {loading ? (
          <div className="equipment-loading">
            <p>読み込み中...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="equipment-empty-state">
            <p>該当する備品が見つかりませんでした。</p>
            <p>検索キーワードを変更するか、新しい備品を登録してください。</p>
          </div>
        ) : (
          <div className="equipment-grid">
            {items.map((item) => (
              <div
                className="equipment-item-card"
                key={item.equipId}
                onClick={() => handleItemClick(item.equipId)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleItemClick(item.equipId);
                  }
                }}
              >
                {/* 画像表示処理 */}
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={`${item.equipName}の画像`}
                      className="equipment-item-image"
                      onLoad={() => console.log('画像読み込み成功:', item.equipName)} 
                      onError={handleImageError} 
                    />
                    <div 
                      className="equipment-no-image-fallback"
                      style={{ display: 'none' }}
                    >
                      No image
                    </div>
                  </>
                ) : (
                  <div className="equipment-no-image">
                    No image
                  </div>
                )}
                <div className="equipment-item-name">{item.equipName}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 操作ボタンエリア */}
      <div className="equipment-button-area">
        <button onClick={() => navigate(-1)}>
          戻る
        </button>
        <button onClick={handleNavigateToEquipmentRegist}>
          備品登録
        </button>
        <button onClick={() => navigate('/bioRegist')}>
          生体登録
        </button>
      </div>
    </div>
  );
}