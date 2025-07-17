import React from "react";
import axios from "axios";

export default class Home extends React.Component{

    state = {
               projects:[],
               ProjectTags:[],
               addName:"",
               addProjectTagId:0,
               showModal:false,
               error:""
            }

    componentDidMount() {
        axios.get("/api/projects/")
            .then(json => {
                console.log(json);
                this.setState({
                    projects:json.data
                })
            })
            .catch(error => {
                console.error("データ取得エラー:", error);
            });
        axios.get("/api/projectTags/")
            .then(json => {
                console.log(json);
                this.setState({
                    projectTags:json.data
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

    //プロジェクトを新規登録する処理
    saveProject(){
        const {addName, addProjectTagId} = this.state;

        //入力チェック
        if (!addName) {
            this.setState({ error: "プロジェクト名を設定してください" });
            return;
        }

        if(addProjectTagId === 0){
            this.setState({ error: "プロジェクトIDを設定してください" });
            return;
        }
        const data = {projectId:null, projectName:addName, privacy:0, projectTagId:Number(addProjectTagId)};
        console.log(data);
        axios.post("/api/projects/add/", data)
        .then(json =>{
            this.toggleModal();
            this.componentDidMount();
        })
        .catch(error => {
                console.error("登録時にエラーが発生しました:", error);
        });
    }

    onInput = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    }  

    //モーダルウィンドウの表示切り替え
    toggleModal = () => {
        const{showModal} = this.state;
        this.setState({
            showModal: !showModal
        });
    }

    render(){
        const {projects, showModal, error} = this.state;
        return( 
            <div className="Home">
                <h1>プロジェクト選択</h1>
                <p>{error}</p>
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

                <button onClick={this.toggleModal}>プロジェクト新規作成</button>

                {/* モーダルウィンドウ(編集) */}
                {showModal &&
                    <div id="overlay">
                        <div id="content">
                            <h2>プロジェクトの追加</h2>
                            プロジェクトタグ：
                            <select name="addProjectTagId" 
                                value={this.state.addProjectTagId} onChange={this.onInput}>
                                <option value="">------</option>
                                {this.state.projectTags.map((tag, index)=> 
                                    <option key={index} value={tag.projectTagId}>
                                    {tag.projectTagName}
                                    </option>
                                )}
                            </select><br />
                            プロジェクト名：<input type="text" name="addName" value={this.state.addName} onChange={this.onInput} /><br />
                            
                            <button onClick={this.toggleModal}>戻る</button>
                            <button onClick={() => this.saveProject()}>登録</button>
                        </div>
                    </div>
                }
                
            </div>
        )
    };
}