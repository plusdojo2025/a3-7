import React from "react";
import axios from "axios";

export default class Mail extends React.Component {
  render() {
    return (
        <div className="mailbox">
            <h2>マイページ ＞ メールボックス</h2>
            <div className="mail-list" style={{ border: "1px solid #ccc", padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
                <ul>
                    <li>Ａさんから招待が届きました！</li>
                    <li>Ｂさんから招待が届きました。</li>
                    <li>Ｃさんから通知が届きました。</li>
                    <li>Ｄさんから連絡が届きました。</li>
                    <li>…（スクロール）</li>
                </ul>
            </div>
            <button style={{ marginTop: "10px" }}>戻る</button>
        </div>
    );
  }
}
