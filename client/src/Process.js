import React from "react";
import axios from "axios";
import './css/Common.css';


export default class Process extends React.Component{
    constructor(props){
        super(props);

        //表示するプロジェクトのidを取得
        const params = new URLSearchParams(window.location.search);
        const processId = params.get('id');

        //変数宣言
        this.state = {
            processId:processId,
            process:[],
        }
    }

    componentDidMount() {
        const { processId } = this.state;
        console.log("processId:"+processId);

        axios.get(`/api/process/${processId}/`)
        .then(json => {
            console.log(json);
            this.setState({
                process:json.data
            });
        })
        .catch(error => {
            console.error("データ取得エラー:", error);
        });
    }

    render(){
         return (
            <div>実験工程</div>

        )
    };
}