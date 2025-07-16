import React from "react";
import axios from "axios";

export default class Login extends React.Component{

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

    render(){
        return <div>ここはログイン画面です</div>
    };
} 