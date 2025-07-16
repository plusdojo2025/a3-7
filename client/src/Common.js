import React from "react";
import './css/Common.css';
import axios from "axios";
import { Link } from "react-router-dom";

export default class Common extends React.Component {

    state = {
        isLoggedIn: null,  // null: 判定中, true: ログイン済み, false: 未ログイン
    };

    componentDidMount() {
        axios.get("/checkLogin/").then(response => {
            const loggedIn = response.data;
            //未ログインならログインページに
            if (!loggedIn) {
                window.location.href = "/login";
            } else {
                this.setState({ isLoggedIn: true });
            }
        })
        // エラーでもログインページに
        .catch(error => {
            window.location.href = "/login";
        });
    }

    render() {
        const { isLoggedIn } = this.state;

        //判定中は画面を空に
        if (isLoggedIn === null) {

            return null;
        }

        // ログイン済みならヘッダー表示
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
            <li><Link to="/login">ログアウト</Link></li>
          </ul>
        </header>
        <main>
          {this.props.children}
        </main>
      </>
    );
  }
}

