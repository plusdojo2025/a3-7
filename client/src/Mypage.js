import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ユーザー情報初期状態
      user: null,
    };
  }

  componentDidMount() {
    // セッションからログインユーザー情報を取得
    axios
      .get("/getLoginUser", { withCredentials: true })
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("ユーザー情報の取得に失敗しました", error);
      });
  }

  render() {
    const { user } = this.state;
    // データ取得前のローディング表示
    if (!user) {
      return <div className="loading">読み込み中...</div>;
    }

    return (
      <div className="mypage-container">
        <div className="account-info card">
          {/* <h2 className="account-title">アカウント情報</h2> */}
          <h2>アカウント情報</h2>
          <div className="info-row">
            {/* <p><strong>　　　　　氏名：</strong></p> */}
            <span className="label">氏名：</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-row">
            {/* <p><strong>　　会社コード：</strong></p> */}
            <span className="label">会社コード：</span>
            <span className="value">{user?.company_code}</span>
          </div>
          <div className="info-row">
            {/* <p><strong>メールアドレス：</strong></p> */}
            <span className="label">メールアドレス：</span>
            <span className="value">{user.email}</span>
          </div>
        </div>

        <div className="button-group">
          <Link to="/mypage/edit">
            <button className="btn">✏️ 編集</button>
          </Link>
          <Link to="/mypage/mail">
            <button className="btn">📬 メールボックス</button>
          </Link>
        </div>
      </div>
    );
  }
}