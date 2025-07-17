import React from "react";
import axios from "axios";
import "./css/MyPageEdit.css";

export default class MyPageEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            newPassword: "",
            confirmNewPassword: "",
            showPassword: false,
        };
    }

    // ユーザー情報をマウント時に取得
    componentDidMount() {
        axios.get("http://localhost:8080/getLoginUser", { withCredentials: true })
        .then((res) => {
        if (res.data) {
            this.setState({
            name: res.data.name,
            email: res.data.email,
            });
        }
        })
        .catch((err) => {
        console.error("ユーザー情報の取得に失敗しました", err);
        });
    }

    // 更新ボタン押下時の処理
    handleUpdate = (e) => {
    // フォームのデフォルト送信防止
    e.preventDefault();
    const { name, password, newPassword, confirmNewPassword } = this.state;

    if (newPassword !== confirmNewPassword) {
      alert("新しいパスワードが一致しません。");
      return;
    }

    axios.post("http://localhost:8080/mypage/update/", {
        name,
        password,
        newPassword,
        }, { withCredentials: true })
        .then((res) => {
        if (res.data === true) {
            alert("更新に成功しました。");
        } else {
            alert("現在のパスワードが正しくありません。");
        }
        })
        .catch((err) => {
        console.error("更新エラー", err);
        alert("更新に失敗しました。");
        });
    };

    render() {
    const {
        name,
        email,
        password,
        newPassword,
        confirmNewPassword,
        showPassword,
    } = this.state;

    return (
        <div className="edit-container">
            <form className="edit-form" onSubmit={this.handleUpdate}>
            <h2 className="form-title">アカウント情報</h2>

                <div className="form-group">
                    <label>氏名</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>メール</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="disabled-input"
                    />
                </div>
                
                <div className="form-group">
                    <label>パスワード</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>新規パスワード</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => this.setState({ newPassword: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>新規パスワード確認</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) =>
                        this.setState({ confirmNewPassword: e.target.value })
                        }
                    />
                </div>

                {/* <div className="form-group">
                    <label>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) =>
                        this.setState({ showPassword: e.target.checked })
                        }
                    />
                    パスワードを表示
                    </label>
                </div> */}
                
                <div className="edit-buttons">
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => window.history.back()}
                    >戻る
                    </button>
            
                    <button type="submit" className="update-button">更新</button> 
                </div>
            </form>
        </div>
    );
  }
}