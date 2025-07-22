import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/equipment.css';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/equip/search?keyword=${keyword}`);
      setItems(response.data);
    } catch (error) {
  if (error.response) {
    console.error('エラー内容:', error.response.data);
    console.error('ステータスコード:', error.response.status);
  } else {
    console.error('No response:', error.message);
  }
}
  };

  useEffect(() => {
    handleSearch(); // 初期読み込み時も表示
  }, []);

  return (
    <div className="container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="備品名を検索" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>検索</button>
      </div>

      <div className="item-list">
        {items.length === 0 ? (
          <p>該当する備品が見つかりませんでした。</p>
        ) : (
          items.map((item, index) => (
            <div
              className="item-card"
              key={`${item.equipId}-${index}`}
              onClick={() => navigate(`/equipmentDetail/${item.equipId}`)}
              style={{ cursor: 'pointer' }}
            >
              {item.image ? (
                <img
                  src={`data:image/png;base64,${item.image}`}
                  alt={`${item.equipName}の画像`}
                  className="item-image"
                />
              ) : (
                <div className="no-image">No image</div>
              )}
              <div className="item-name">{item.equipName}</div>
            </div>
          ))
        )}
      </div>


      <div className="button-area">
        <button onClick={() => navigate(-1)}>戻る</button>
        <button onClick={() => navigate('/equipmentregist')}>備品登録</button>
        <button onClick={() => navigate('/bioregist')}>生体登録</button>
      </div>
    </div>
  );
}