import React from "react";
import axios from "axios";
import './css/Common.css';
import './css/Project.css';

export default class Project extends React.Component{
    state ={
        projectId:0,
        process:[],
        error:""
    }
    constructor(props){
        super(props);

        //表示するプロジェクトのidを取得
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');


        this.state = {
            projectId:projectId,
        }
    }

    componentDidMount() {
        const { projectId } = this.state;
        console.log("projectId:"+projectId);

        axios.get(`/api/projectDetails/${projectId}/`)
            .then(json => {
                console.log(json);
                this.setState({
                    processes:json.data
                });
            })
            .catch(error => {
                console.error("データ取得エラー:", error);
            });
    }
    
    render(){
        const {error} = this.state;
        return( 
            <div className="ProjectDetails">
                <h1>プロジェクト名</h1>
                <p>{error}</p>

            </div>
        )
    };
}