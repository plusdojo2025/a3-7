import React from "react";
import axios from "axios";

export default class Home extends React.Component{

    state = {
               projects:[]
            }

    componentDidMount() {
        axios.get("/projects/")
            .then(json => {
                console.log(json);
                this.setState({
                    projects:json.data
                })
            })
            .catch(error => {
                console.error("データ取得エラー:", error);
            });
    }

    //プロジェクトの詳細ページに遷移するための関数
    lookPloject(projectId) {
        window.alert("ここにプロジェクトid="+projectId+"に対しての画面遷移を実装");
    }

    render(){
        const {projects} = this.state;
        return( 
            <div className="Home">
                <h1>プロジェクト選択</h1>
                <table>
                    <tbody>
                    {projects.map((project, index) =>
                        <tr key={index} className="projects">
                            <td className="project_id" onClick={() =>this.lookPloject(project.projectId)}>
                                {project.projectId}</td>
                            <td className="project_name" onClick={()=> this.lookPloject(project.projectId)}>
                                {project.projectName}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                
            </div>
        )
    };
}