import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component{

    state = {
            email: "",
            password: ""
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
        const { email, password } = this.state;
        return( 
            <div className="LoginForm">
                <form onSubmit={this.handleLogin}>
                    <div>ここはログイン画面です</div>
                    <p>メールアドレス</p>
                    <input type="text" name="email" onChange={this.onInput} value={email}/><br />
                    <p>パスワード</p>
                    <input type="password" name="password" onChange={this.onInput} value={password} /><br />
                    <button type="submit">ログイン</button>
                </form>
                新規登録は<Link to="/signup">こちら</Link>
            </div>
        )
    };
} 