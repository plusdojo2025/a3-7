import React from "react";
import './css/Common.css';
import { Link } from "react-router-dom";

export default class Member extends React.Component {
    render() {
        return (
            <>
                <header id="nav">
                    <div>
                        <Link to="/home">
                            <img src="/img/Labchain.png" className="logo-gazou" alt="Labchain" />
                        </Link>
                    </div>

                    <ul className="nav-links" id="nav-links">
                        <li><Link to="/home">ホーム</Link></li>
                        <li><Link to="/mypage">マイページ</Link></li>
                        <li><Link to="/search">プロジェクト検索</Link></li>
                        <li><Link to="/login" className="logout-button">ログアウト</Link></li>
                    </ul>
                </header>
                <h1>プロジェクトメンバー編集</h1>
                <div class="input-wrapper ">
                    <input type="text" id="mail" name="mail" placeholder="招待したい方のメールアドレスを入力してください" />
                    <input class="sub_botun" type="submit" name="submit" value="検索"></input>
                </div>
            </>
        )
    };
} 