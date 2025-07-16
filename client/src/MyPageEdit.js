import React from "react";
import axios from "axios";
import "./css/MyPageEdit.css";

export default class MyPageEdit extends React.Component {
  render() {
    return (
        <div className="edit-container">
            <form className="edit-form">
            <h2 className="form-title">アカウント情報</h2>

                <div className="form-group">
                    <label>氏名</label>
                    <input type="text" defaultValue="鬼瓦 権左衛門" />
                </div>
                <div className="form-group">
                    <label>メール</label>
                    <input type="email" Value="gonzaemon@example.com" disabled className="disabled-input"/>
                </div>
                <div className="form-group">
                    <label>パスワード</label>
                    <input type="password" />
                </div>
                <div className="form-group">
                    <label>新規パスワード</label>
                    <input type="password" />
                </div>
                <div className="form-group">
                    <label>新規パスワード確認</label>
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