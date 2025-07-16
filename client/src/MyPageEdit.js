import React from "react";
import axios from "axios";
import "./css/MyPageEdit.css";

export default class MyPageEdit extends React.Component {
  render() {
    return (
        <div className="edit-container">
            <h2>アカウント情報</h2>
            <form className="edit-form">
                <div>
                    <label>氏名：</label>
                    <input type="text" defaultValue="鬼瓦 権左衛門" />
                </div>
                <div>
                    <label>メール：</label>
                    <input type="email" Value="gonzaemon@example.com" disabled className="disabled-input"/>
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
                    <label>確認パスワード入力：</label>
                    <input type="password" />
                </div>
                
                <div className="edit-buttons">
                    <button type="button" className="back-button">戻る</button>
                    <button type="submit" className="update-button">更新</button>
                </div>
            </form>
        </div>
    );
  }
}