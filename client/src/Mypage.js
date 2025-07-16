import React from "react";
import axios from "axios";

export default class Mypage extends React.Component {
  render() {
    // 仮のユーザー情報
    const user = {
      name: "鬼瓦 権左衛門",
      email: "gonzaemon@example.com",
      company_code: 12345,
    };

    return (
      <div>
        <h2>マイページ</h2>
        <p><strong>名前：</strong>{user.name}</p>
        <p><strong>メールアドレス：</strong>{user.email}</p>
        <p><strong>会社コード：</strong>{user.company_code}</p>
      </div>
    );
  }
}