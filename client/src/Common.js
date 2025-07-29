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

    handleLogout = () => {
      axios.post("/logout/").then(() => {
          window.location.href = "/login";
        })
        .catch(error => {
          alert("ログアウト処理に失敗しました");
        });
    };

    render() {
        const { isLoggedIn } = this.state;

        //判定中は画面を空に
        if (isLoggedIn === null) {
            return null;
        }

        // ログイン済みならヘッダー表示
        return (
      <>
        <header>
          <nav id="nav">
            <div className="logo-container">
              <Link to="/home">
                <img src="/img/Labchain.png" className="logo-gazou" alt="Labchain" />
              </Link>
            </div>
            <ul className="nav-links" id="nav-links">
              <li><Link to="/home">ホーム</Link></li>
              <li><Link to="/mypage">マイページ</Link></li>
              <li><Link to="/search">プロジェクト検索</Link></li>
              <li><button onClick={this.handleLogout} className="logoutButton">ログアウト</button></li>
            </ul>
          </nav>
        </header>
        <main>
          {this.props.children}
        </main>
      </>
    );
  }
}