import React from "react";
import axios from "axios";
import './css/Login.css';
import { Link } from "react-router-dom";

export default class Login extends React.Component{

    state = {
            email: "",
            password: "",
            error:""
            }

    componentDidMount() {
        // SpringBoot側の呼びだし（/users/　のgetメソッド）
        axios.get("/users/")
            .then(json => {
                console.log(json);
            })
            .catch(error => {
                console.error("データ取得エラー:", error);
            });
    }

    handleLogin = (e) => {
        e.preventDefault();

        const {email, password} = this.state;
        // 入力バリデーション
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password) {
            this.setState({ error: "メールアドレスとパスワードは必須です。" });
            return;
        }
        if (!emailRegex.test(email)) {
            this.setState({ error: "メールアドレスの形式が正しくありません。" });
            return;
        }
        if (password.length < 8) {
            this.setState({ error: "パスワードは8文字以上で入力してください。" });
            return;
        }
        if (password.length > 20) {
            this.setState({ error: "パスワードは20文字以内で入力してください。" });
            return;
        }

        const data = {email:email, password:password};

        axios.post("/login/", data).then(response => {
        const result = response.data; 

            if (result === true) {
            console.log("ログイン成功");
            window.location.href = "/home";
            } else { 
            console.log("ログイン失敗");
            alert("メールアドレスかパスワードが間違っています");
            }
        })
        .catch(error => {
            console.error("通信エラー:", error.response?.data || error.message);
            alert("通信に失敗しました");
        });
    };

    //画面で何か入力された時に、その値をstateとして保持する。
    //これにより、JavaScript動作時に毎回画面を見に行くのではなく、画面と連動したstateだけを見ればよくなる。
    onInput = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    }

    render(){
        const { email, password, error } = this.state;
        return( 
           
            <div className="LoginPage">
                <Link to="/login">
                    <img src="/img/Labchain.png" className="logo" alt="Labchain" />
                </Link>
                <form onSubmit={this.handleLogin} className="LoginForm">
                    <h2>ログイン</h2>
                    <p>{error}</p>
                    <p>メールアドレス</p>
                    <div className="inputBox">
                        <input type="text" name="email" onChange={this.onInput} value={email}/>
                    </div>
                    <p>パスワード</p>
                    <div className="inputBox">
                        <input type="password" name="password" onChange={this.onInput} value={password} /><br />
                    </div>
                    <button type="submit" className="Button">ログイン</button><br />                    新規登録は<Link to="/signup">こちら</Link>
                </form>
                
            </div>
        )
    };
} 