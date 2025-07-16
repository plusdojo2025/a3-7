import React from "react";
import axios from "axios";

export default class MyPageEdit extends React.Component {
  render() {
    return (
        <div className="mypage-edit">
            <h2>アカウント情報</h2>
            <form>
                <div>
                    <label>氏名：</label>
                    <input type="text" defaultValue="鬼瓦 権左衛門" />
                </div>
                <div>
                    <label>メール：</label>
                    <input type="email" defaultValue="gonzaemon@example.com" readOnly />
                </div>
                <div>
                    <label>パスワード：</label>
                    <input type="password" />
                </div>
                <div>
                    <label>新規パスワード：</label>
                    <input type="password" />
                </div>
                <div>
                    <label>新規パスワード再入力：</label>
                    <input type="password" />
                </div>
                    <div style={{ marginTop: "10px" }}>
                    <button type="button">戻る</button>
                    <button type="submit" style={{ marginLeft: "10px" }}>更新</button>
                </div>
            </form>
        </div>
    );
  }
}