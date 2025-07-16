import React from "react";
import axios from "axios";

export default class SignUp extends React.Component{

    state = {
        email: "",
        password: "",
        companyCode:"",
        name:"",
        check:""
    }

    handleSignUp = (e) => {
        e.preventDefault();

        const { email, name, companyCode, password, check } = this.state;
        const data = {email: email, name: name, companyCode: companyCode, password: password};

        // パスワード確認
        if (password !== check) {
            alert("パスワードと確認用パスワードが一致しません");
            return;
        }

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
        const {email, password, companyCode, name, check} = this.state
        return( 
            <div className="SignUpForm">
                <form onSubmit={this.handleSignUp}>
                    <div>ここは新規登録画面です</div>
                    <p>メールアドレス</p>
                    <input type="text" name="email" onChange={this.onInput} value={email}/><br />
                    <p>氏名</p>
                    <input type="text" name="name" onChange={this.onInput} value={name}/><br />
                    <p>会社コード</p>
                    <input type="text" name="companyCode" onChange={this.onInput} value={companyCode}/><br />
                    <p>パスワード</p>
                    <input type="password" name="password" onChange={this.onInput} value={password}/><br />
                    <p>確認用パスワード</p>
                    <input type="password" name="check" onChange={this.onInput} value={check}/><br />
                    <button type="submit">登録</button>
                </form>
            </div>
        )
    };
} 