import React from "react";
import axios from "axios";

export default class Home extends React.Component{

    state = {}

    componentDidMount() {
        axios.get("/users/")
            .then(json => {
                console.log(json);
            })
            .catch(error => {
                console.error("データ取得エラー:", error);
            });
    }

    render(){
        return( 
            <div className="Home">
                <h1>プロジェクト選択</h1>

                
            </div>
        )
    };
}