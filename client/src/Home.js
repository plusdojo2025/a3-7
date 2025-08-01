import React from "react";
import axios from "axios";
import './css/Home.css';

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
        Promise.all([
            axios.get("/api/projects/"),
            axios.get("/api/projectTags/")
        ])
        .then(([projectsRes, tagsRes]) => {
            this.setState({
                projects: projectsRes.data,
                projectTags: tagsRes.data
            });
           console.log('すべてのデータを取得しました');
        })
        .catch(error => {
        console.error('データ取得中にエラーが発生しました:', error);
        });

        this.setState({
            addName:"",
            addProjectTagId:0,
            showModal:false,
            error:""
        });  
    }

    //プロジェクトの詳細ページに遷移するための関数
    lookProject(projectId) {
        //window.alert("ここにプロジェクトid="+projectId+"に対しての画面遷移を実装");
        window.location.href = `/project?id=${projectId}`;
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
                {projects.length === 0 ? (
                    <p>プロジェクトがありません</p>
                ) : (
                    <div className="project-container">
                        {projects.map((project, index) => (
                            <div key={index} className={`project-box ${project.complete === 0 ? "progressBox" : "completedBox"}`} >
                                <div className="project-info" onClick={() => this.lookProject(project.projectId)}>
                                    <h3>{project.projectName}</h3>
                                    <p>{project.complete === 0 ? "進行中" : "完了済"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="home-button-container">
                    <button className="home-pj-regist" onClick={this.toggleModal}>プロジェクト新規作成</button>
                </div>

                {/* モーダルウィンドウ(編集) */}
                {showModal &&
                    <div id="overlay" className="modal-overlay">
                        <div id="content" className="modal-content">
                            <h2>プロジェクトの追加</h2>
                            <div className="tagContainer">
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
                            </div>
                            <div className="inputContainer">
                                プロジェクト名：<input type="text" name="addName" value={this.state.addName} onChange={this.onInput} /><br />
                            </div>
                            <div className="buttonContainer">
                                <button className="home-modal-backbtn" onClick={this.toggleModal}>戻る</button>
                                <button className="home-modal-submitbtn" onClick={() => this.saveProject()}>登録</button>
                            </div>
                        </div>
                    </div>
                }
                
            </div>
        )
    };
}