import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import './css/Common.css';
import './css/equipment.css';

/**
 * 備品管理コンポーネント
 * 備品・生物の一覧表示、検索、登録機能を提供
 */
export default function Equipment() {
  const [keyword, setKeyword] = useState('');
  const [equipmentType, setEquipmentType] = useState('1'); // デフォルトを備品に設定
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // URLからprojectIdを取得
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  //alert用
  const [alertList, setAlertList] = useState([]);
  const [allList, setAllList] = useState([]);

  /**
   * 備品・生物検索実行処理
   * キーワード、種類、プロジェクトIDで検索
   */
  const performSearch = useCallback(async (projectIdToSearch, searchKeyword, searchType) => {
    setLoading(true);
    console.log('備品・生物検索開始:', { projectIdToSearch, searchKeyword, searchType });
    
    try {
      let results = [];
      // searchTypeが未指定の場合はデフォルトで備品を検索
      const typeToSearch = searchType || '1';

      if (typeToSearch === '1') {
        // 備品検索
        console.log('備品検索開始');
        
        try {
          const equipResponse = await axios.get(`/api/equip/${projectIdToSearch}/1/`);
          console.log('備品検索レスポンス:', equipResponse.data);
          
          let filteredResults = equipResponse.data;
          
          // キーワード検索がある場合はフィルタリング
          if (searchKeyword && searchKeyword.trim()) {
            const keyword = searchKeyword.trim().toLowerCase();
            filteredResults = equipResponse.data.filter(item => 
              (item.equipName && item.equipName.toLowerCase().includes(keyword)) ||
              (item.equip_name && item.equip_name.toLowerCase().includes(keyword))
            );
          }
          
          results = filteredResults.map(item => ({
            ...item,
            type: "備品",
            displayType: "備品"
          }));
          
          console.log('備品検索結果:', results.length + '件');
          
        } catch (equipError) {
          console.error('備品検索エラー:', equipError);
          results = [];
        }
        
      } else if (typeToSearch === '2') {
        // 生物検索
        console.log('生物検索開始');
        
        try {
          const bioResponse = await axios.get(`/api/equip/${projectIdToSearch}/2/`);
          console.log('生物検索レスポンス:', bioResponse.data);
          
          let filteredResults = bioResponse.data;
          
          // キーワード検索がある場合はフィルタリング
          if (searchKeyword && searchKeyword.trim()) {
            const keyword = searchKeyword.trim().toLowerCase();
            filteredResults = bioResponse.data.filter(item => 
              (item.equipName && item.equipName.toLowerCase().includes(keyword)) ||
              (item.equip_name && item.equip_name.toLowerCase().includes(keyword))
            );
          }
          
          results = filteredResults.map(item => ({
            ...item,
            type: "生物",
            displayType: "生物"
          }));
          
          console.log('生物検索結果:', results.length + '件');
          
        } catch (bioError) {
          console.error('生物検索エラー:', bioError);
          results = [];
        }
      }

      setItems(results);
      
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * アラート情報読み込み処理
   * 備品の在庫アラートを取得
   */
  const loadAlerts = async (projectIdFromUrl, projectId, equipKindId) => {
    try {
      // 2つのAPIを並列で呼び出し、両方完了まで待つ
      const [alertRes, equipRes] = await Promise.all([
        axios.get('/api/equip/alert/detail/'),
        axios.get(`/api/equip/${projectId}/${equipKindId}/`)
      ]);

      // 両方のデータを取得
      const alertData = alertRes.data;
      console.log(alertData);
      const equipData = equipRes.data;
      console.log(equipData);

      // 取得できてからフィルタ処理をする
      const validIds = new Set(equipData.map(item => item.equipDetailId));
      const filteredAlerts = alertData.filter(alert =>
        validIds.has(alert.equipDetailId)
      );

      // 状態をまとめて更新
      setAlertList(alertData);
      setAllList(equipData);
      setAlerts(filteredAlerts);
      console.log(alertList);
      console.log(allList);
      console.log(alerts);

    } catch (error) {
      console.error('データ取得エラー:', error);
      setAlertList([]);
      setAllList([]);
      setAlerts([]);
    }
  };

  // 備品種類一覧の取得
  useEffect(() => {
    const fetchEquipmentTypes = async () => {
      try {
        // マスタの取得
        const equipmentTypes = [
          { id: '1', name: '備品' },
          { id: '2', name: '生物' }
        ];
        setEquipmentTypes(equipmentTypes);
      } catch (error) {
        console.error('備品種類取得エラー:', error);
        // エラー時もデフォルト値をセット
        setEquipmentTypes([
          { id: '1', name: '備品' },
          { id: '2', name: '生物' }
        ]);
      }
    };

    fetchEquipmentTypes();
  }, []);

  // コンポーネント初期化処理
  useEffect(() => {
    const params = new URLSearchParams(location.search); 
    const projectIdFromUrl = params.get('projectId');

    if (projectIdFromUrl) {
      setCurrentProjectId(projectIdFromUrl);
      console.log('プロジェクトID検出:', projectIdFromUrl);

      // 初期検索で備品一覧を表示
      performSearch(projectIdFromUrl, '', '1'); 
      loadAlerts(projectIdFromUrl, projectIdFromUrl, 1); // 1は備品のkindId
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
   * 現在のキーワードと種類で再検索を実行
   */
  const handleSearchButtonClick = () => {
    if (!currentProjectId) {
      alert('プロジェクトIDが不明です。');
      return;
    }
    console.log('検索実行:', { keyword, equipmentType });
    performSearch(currentProjectId, keyword, equipmentType);
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
   * 生体登録ページ遷移処理
   * プロジェクトIDを含めて生体登録画面に移動
   */
  const handleNavigateToBioRegist = () => {
    if (currentProjectId) {
      navigate(`/bioRegist?projectId=${currentProjectId}`);
    } else {
      alert('プロジェクトIDが不明なため、生体登録画面へ遷移できません。');
    }
  };

  /**
   * アイテム詳細ページ遷移処理
   * 備品と生物で異なる編集画面に移動
   */
  const handleItemClick = (item) => {
    console.log('アイテム詳細画面遷移:', item);
    
    if (item.type === "生物") {
      // 生物の場合
      navigate(`/bioEdit`, { 
        state: { 
          equipmentId: item.equipId, 
          projectId: currentProjectId 
        } 
      });
    } else {
      // 備品の場合
      navigate(`/equipmentEdit`, { 
        state: { 
          equipmentId: item.equipId, 
          projectId: currentProjectId 
        } 
      });
    }
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
      <h2>備品・生物管理</h2>

      {/* 備品・生物一覧と検索バー統合エリア */}
      <div className="equipment-list-area">
        {/* 検索バー */}
        <div className="equipment-search-bar">
          <input
            type="text"
            placeholder="備品・生物名を検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchButtonClick();
              }
            }}
            disabled={loading}
          />
          
          {/* 種類選択プルダウン */}
          <select
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
            disabled={loading}
            className="equipment-type-select"
          >
            {equipmentTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleSearchButtonClick} 
            disabled={loading}
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        {/* 備品・生物カードグリッド */}
        {loading ? (
          <div className="equipment-loading">
            <p>読み込み中...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="equipment-empty-state">
            <p>該当する備品・生物が見つかりませんでした。</p>
            <p>検索条件を変更するか、新しく登録してください。</p>
          </div>
        ) : (
          <div className="equipment-grid">
            {items.map((item) => (
              <div
                className="equipment-item-card"
                key={`${item.type}-${item.equipId}`}
                onClick={() => handleItemClick(item)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleItemClick(item);
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
                
                <div className="equipment-item-info">
                  <div className="equipment-item-name">{item.equipName}</div>
                  <div className="equipment-item-type">{item.displayType}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 操作ボタンエリア */}
      <div className="equipment-button-area">
        <button 
          onClick={() => navigate(`/project?id=${currentProjectId}`)}
          className="equipment-back-button"
        >
          戻る
        </button>
        <button onClick={handleNavigateToEquipmentRegist}>
          備品登録
        </button>
        <button onClick={handleNavigateToBioRegist}>
          生体登録
        </button>
      </div>
    </div>
  );
}