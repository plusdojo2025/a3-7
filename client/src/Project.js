import React from "react";
import './css/Common.css';
import './css/Project.css';
import { Link, Navigate } from "react-router-dom";

export default class Project extends React.Component{
    constructor(props) {
    super(props);
    // stateの初期化
    this.state = {
        // メールボックスに遷移するかどうかのフラグ
        redirect: false,
    };
  }

    // 「はい」「いいえ」どちらでもメールボックスに遷移
    handleResponse = () => {
        this.setState({ redirect: true });
    };

    
    render(){
    // redirectがtrueなら、メールボックス画面へ自動遷移
    if (this.state.redirect) {
        return <Navigate to="/mypage/mail" />;
    }
        return (
            <div className="project-invite-container">
                <div className="project-invite-box">
                    {/* 招待メッセージ表示 */}
                    <p>〇〇さんから招待が届きました！</p>
                    <p>〇〇プロジェクト</p>
                    <p className="project-question">
                    このプロジェクトに参加しますか？
                    </p>

                    {/* ボタンを表示 */}
                    <div className="invite-buttons">
                        <button className="reject-button" onClick={this.handleResponse}>
                            いいえ
                        </button>
                        <button className="accept-button" onClick={this.handleResponse}>
                                はい
                        </button>
                    </div>
                </div>
            </div>
        )
    };
} 