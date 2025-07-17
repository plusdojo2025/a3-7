import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null, // ユーザー情報初期状態
    };
  }

  componentDidMount() {
    // セッションからログインユーザー情報を取得
    axios
      .get("http://localhost:8080/getLoginUser", { withCredentials: true })
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("ユーザー情報の取得に失敗しました", error);
      });
  }

  render() {
    // 仮のユーザー情報
    // const user = {
    //   name: "鬼瓦 権左衛門",
    //   email: "gonzaemon@example.com",
    //   company_code: 1234,
    // };

    const { user } = this.state;
    // データ取得前のローディング表示
    if (!user) {
      return <div>読み込み中...</div>;
    }

    return (
      <div className="mypage-container">
        <div className="account-info">
          <h2 className="account-title">アカウント情報</h2>

            {/* <p><strong>氏名：</strong><span>鬼瓦 権左衛門</span></p>
            <p><strong>会社コード：</strong><span>1234</span></p>
            <p><strong>メールアドレス：</strong><span>gonzaemon@example.com</span></p> */}

            <p><strong>氏名：</strong><span>{user.name}</span></p>
            <p><strong>会社コード：</strong><span>{user.company_code}</span></p>
            <p><strong>メールアドレス：</strong><span>{user.email}</span></p>
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