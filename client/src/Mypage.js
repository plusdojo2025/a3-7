import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

export default class Mypage extends React.Component {
  render() {
    // 仮のユーザー情報
    const user = {
      name: "鬼瓦 権左衛門",
      email: "gonzaemon@example.com",
      company_code: 1234,
    };

    return (
      <div className="mypage-container">
        <div className="account-info">
          <h2 className="account-title">アカウント情報</h2>

            <p><strong>氏名：</strong><span>鬼瓦 権左衛門</span></p>
            <p><strong>会社コード：</strong><span>1234</span></p>
            <p><strong>メールアドレス：</strong><span>gonzaemon@example.com</span></p>
        </div>

        <div className="mypage-buttons">
          <Link to="/mypage/edit">
            <button>編集</button>
          </Link>
          <Link to="/mypage/mail">
            <button>メールボックス</button>
          </Link>
        </div>
      </div>
    );
  }
}