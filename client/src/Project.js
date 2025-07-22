import React from "react";
import axios from "axios";
import './css/Common.css';
import './css/Project.css';

export default class Project extends React.Component{
    constructor(props){
        super(props);

        //表示するプロジェクトのidを取得
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');


        this.state = {
            projectId:projectId,
            processes:[],
            error:"",
            reflects:[],
            showCloseProjectModal:false,
            showAddProcessModal:false,
            addName:"",
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

        axios.get(`/api/getReflects/${projectId}/`)
            .then(json => {
                console.log(json);
                this.setState({
                    reflects:json.data
                });
            })
            .catch(error => {
                console.error("データ取得エラー:", error);
            });
    }

    onInput = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    }  
    
    //プロジェクトの詳細ページに遷移するための関数
    lookProcess(processId) {
        window.alert("ここにプロセスid="+processId+"に対しての画面遷移を実装");
        //window.location.href = `/project?id=${projectId}`;
    }

    //モーダルウィンドウの表示切り替え
    toggleCloseProjectModal = () => {
        const{showCloseProjectModal} = this.state;
        this.setState({
            showCloseProjectModal: !showCloseProjectModal
        });
    }
    toggleAddProcessModal = () => {
        const{showAddProcessModal} = this.state;
        this.setState({
            showAddProcessModal: !showAddProcessModal
        });
    }

    //プロジェクトを終了する
    closePloject(close){
        window.alert("ここに処理を実装"+close);
    }

    //メンバー編集をする
    editMembers(){
        window.alert("ここに処理を実装");
    }

    //備品の管理をする
    manageEquipment(){
        window.alert("ここに処理を実装");
    }

    //工程を追加する
    addProcess(){
        
    }
    
    render(){
        const {processes, showCloseProjectModal, showAddProcessModal, error} = this.state;
        // completeが0のプロセス
        const progressProcesses = processes.filter(p => p.complete === 0);

        // completeが1のプロセス
        const closedProcesses = processes.filter(p => p.complete === 1);
        return( 
            <div className="ProjectDetails">
                <h1>プロジェクト名</h1>
                <p>{error}</p>

                <div className="Progress">
                    <h2>進行中の工程</h2>
                    {progressProcesses.length === 0 ? (
                        <p>進行中の工程がありません</p>
                    ) : (
                        <table>
                            <tbody>
                            {progressProcesses.map((process, index) =>
                                <tr key={index} className="ProgeressProcess">
                                    <td className="process_name" onClick={()=> this.lookProcess(process.processId)}>
                                        {process.processName}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="Closed">
                    <h2>終了した工程</h2>
                    {closedProcesses.length === 0 ? (
                        <p>終了した工程がありません</p>
                    ) : (
                        <table>
                            <tbody>
                            {closedProcesses.map((process, index) =>
                                <tr key={index} className="ClosedProcesses">
                                    <td className="process_name" onClick={()=> this.lookProcess(process.processId)}>
                                        {process.processName}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
                <button onClick={this.toggleCloseProjectModal}>プロジェクトを終了する</button>
                <button onClick={this.editMembers}>メンバー編集</button>
                <button onClick={this.manageEquipment}>備品管理</button>
                <button onClick={this.toggleAddProcessModal}>工程追加</button>

                <div className="showAlert">
                    {/*アラート部分の画面表示*/}
                </div>

                {/*プロジェクト終了用モーダル*/}
                {showCloseProjectModal &&
                    <div id="overlayCloseProject">
                        <div id="content">
                            <h2>報告書登録</h2>
                            日時：
                            報告書:
                            <p>プロジェクトを終了します。このプロジェクトを公開しますか？</p>
                            <button onClick={() => this.closeProject(1)}>はい</button>
                            <button onClick={() => this.closeProject(0)}>いいえ</button>
                            <button onClick={this.toggleModal}>キャンセル</button>
                            
                        </div>
                    </div>
                }

                {/*プロセス追加用モーダル*/}
                {showAddProcessModal &&
                    <div id="overlayAddProcess">
                        <div id="content">
                            <h2>工程の追加</h2>
                            工程名：<input type="text" name="addName" value={this.state.addName} onChange={this.onInput} /><br />
                            <button onClick={this.toggleModal}>戻る</button>
                            <button onClick={() => this.addProcess()}>登録</button>
                            
                        </div>
                    </div>
                }

            </div>
        )
    };
}