import React from "react";
import axios from "axios";
import './css/SignUp.css';
import { Link } from "react-router-dom";

export default class SignUp extends React.Component{

    state = {
        email: "",
        password: "",
        companyCode:"",
        name:"",
        check:"",
        error:""
    }

    handleSignUp = (e) => {
        e.preventDefault();

        const { email, name, companyCode, password, check } = this.state;
        //入力チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /[\p{L}\p{N}](?:\u0020|\u3000)[\p{L}\p{N}]/u;
        if (!email || !password) {
            this.setState({ error: "メールアドレスとパスワードは必須です。" });
            return;
        }
        if (!emailRegex.test(email)) {
            this.setState({ error: "メールアドレスの形式が正しくありません。" });
            return;
        }
        if(!nameRegex.test(name)){
            this.setState({ error: "姓□名 の形で入力してください。" });
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
        if(password !== check){
            this.setState({ error: "パスワードと確認用パスワードが一致しません。" });
            return;
        }


        const data = {email: email, name: name, companyCode: companyCode, password: password};

        axios.post("/signup/", data).then(response => {
        const result = response.data; 

            if (result === true) {
            console.log("登録成功");
            window.location.href = "/login";
            } else {
            console.log("登録失敗");
            alert("そのメールアドレスはスでに使われています");
            }
        })
        .catch(error => {
            console.error("通信エラー:", error.response?.data || error.message);
            alert("通信に失敗しました");
        });
    };
    
    onInput = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    }

    render(){
        const {email, password, companyCode, name, check, error} = this.state
        return( 
            <div className="SignUpPage">
                <Link to="/login">
                    <img src="/img/Labchain.png" className="logo" alt="Labchain" />
                </Link>
                <form onSubmit={this.handleSignUp} className="SignUpForm">
                    <h2>新規登録</h2>
                    <p>{error}</p>
                    <p>メールアドレス</p>
                    <div className="inputBox">
                        <input type="text" name="email" onChange={this.onInput} value={email}/>
                    </div>
                    <p>氏名</p>
                    <div className="inputBox">
                        <input type="text" name="name" onChange={this.onInput} value={name}/>
                    </div>
                    <p>会社コード</p>
                    <div className="inputBox">
                        <input type="text" name="companyCode" onChange={this.onInput} value={companyCode}/>
                    </div>
                    <p>パスワード</p>
                    <div className="inputBox">
                        <input type="password" name="password" onChange={this.onInput} value={password}/>
                    </div>
                    <p>確認用パスワード</p>
                    <div className="inputBox">
                        <input type="password" name="check" onChange={this.onInput} value={check}/><br />
                    </div>
                    <button type="submit" className="signUpButton">登録</button>
                </form>
            </div>
        )
    };
} 