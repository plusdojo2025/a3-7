import React from "react";
import axios from "axios";
import './css/Common.css';
import './css/Project.css';

export default class Project extends React.Component {
    constructor(props) {
        super(props);

        //表示するプロジェクトのidを取得
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');

        this.editMembers = this.editMembers.bind(this);

        //今日の日付を取得
        const currentDate = new Date();
        const defaultDate = currentDate.toISOString().slice(0, 10);

        //備品で固定
        const kindId = 1;


        this.state = {
            projectId: projectId,
            project: [],
            processes: [],
            error: "",
            err:"",
            reflects: [],
            reflectTags:[],
            showCloseProjectModal: false,
            showAddProcessModal: false,
            addName: "",
            date: defaultDate,
            report: "",
            equipKindId:kindId,
            alertList:[]
        }
        this.manageEquipment = this.manageEquipment.bind(this);
    }

    componentDidMount() {
        const { projectId, equipKindId} = this.state;
        console.log("projectId:" + projectId);
          Promise.all([
            axios.get(`/api/project/${projectId}/`),
            axios.get(`/api/projectDetails/${projectId}/`),
            axios.get(`/api/reflectSummary/${projectId}/`),
            axios.get(`/api/reflectTags/`),
            axios.get('/api/equip/alert/detail/'),
            axios.get(`/api/equip/${projectId}/${equipKindId}/`)
        ])
        .then(([projectRes, detailsRes, summaryRes, tagsRes, alertRes, equipRes]) => {
            this.setState({
                project: projectRes.data,
                processes: detailsRes.data,
                reflects: summaryRes.data,
                reflectTags: tagsRes.data,
            });
            console.log('すべてのデータを取得しました');
            console.log(alertRes.data);
            const validIds = new Set(alertRes.data.map(item => item.equipDetailId));
            const filteredAlerts = equipRes.data.filter(alert =>
                validIds.has(alert.equipDetailId)
            );
            this.setState({alertList:filteredAlerts});
            console.log(filteredAlerts);
        })
        .catch(error => {
            console.error("データ取得エラー:", error);
        console.error('データ取得中にエラーが発生しました:', error);
        });
    }

    onInput = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        });
    }

    //プロセスの詳細ページに遷移するための関数
    lookProcess(processId) {
        window.location.href = `/process?id=${processId}`;
    }

    //モーダルウィンドウの表示切り替え
    toggleCloseProjectModal = () => {
        const { showCloseProjectModal } = this.state;
        this.setState({
            showCloseProjectModal: !showCloseProjectModal
        });
    }
    toggleAddProcessModal = () => {
        const { showAddProcessModal } = this.state;
        this.setState({
            showAddProcessModal: !showAddProcessModal
        });
    }

    //プロジェクトを終了する
    closeProject(close) {
        const { date, report, projectId } = this.state;

        //入力チェック
        if (!date) {
            this.setState({ err: "作成日を設定してください" });
            return;
        }
        if (!report) {
            this.setState({ err: "報告書が記載されていません" });
            return;
        }

        const data = { projectReportId: null, createdAt: date, report: report, projectId: projectId };
        console.log(data);

        if (close === 1) {
            axios.post(`/api/closePublicProject/${projectId}/`, data)
                .then(json => {
                    this.toggleCloseProjectModal();
                    this.componentDidMount();
                })
                .catch(err => {
                    console.error("登録時にエラーが発生しました:", err);
                    this.setState({ err: "登録時にエラーが発生しました" });
                });
        }
        else {
            axios.post(`/api/closeUnpublishProject/${projectId}/`, data)
                .then(json => {
                    this.toggleCloseProjectModal();
                    this.componentDidMount();
                })
                .catch(err => {
                    console.error("登録時にエラーが発生しました:", err);
                });
        }





    }

    //メンバー編集をする
    editMembers() {
        const { projectId } = this.state;
        window.location.href = `/member?projectId=${projectId}`;
    }

    //備品の管理をする
    manageEquipment() {
        const {projectId} = this.state;
        window.location.href = `/equipment?projectId=${projectId}`;
    }

    //工程を追加する
    addProcess() {
        const { addName, projectId } = this.state;

        //入力チェック
        if (!addName) {
            this.setState({ err: "プロジェクト名を設定してください" });
            return;
        }

        const data = { processtId: null, processName: addName, projectId: projectId, complete: 0 };
        console.log(data);
        axios.post(`/api/addProcess/${projectId}/`, data)
            .then(json => {
                this.toggleAddProcessModal();
                this.componentDidMount();

            })
            .catch(err => {
                console.error("登録時にエラーが発生しました:", err);
            });
    }

    // 反省タグを取得する
    getReflectTagName(tagId) {
        const { reflectTags } = this.state;
        const tag = reflectTags.find(tag => tag.reflectTagId === tagId);
        return tag ? tag.reflectName : "不明なタグ";
    }

    render() {
        const { project, processes, reflects, alertList, showCloseProjectModal, showAddProcessModal, error } = this.state;
        // completeが0のプロセス
        const progressProcesses = processes.filter(p => p.complete === 0);

        // completeが1のプロセス
        const closedProcesses = processes.filter(p => p.complete === 1);

         const reflect = reflects[0];
        return (
            <div className="ProjectDetails">
                <h1 className="ProjectTitle">{project.projectName}</h1>
                <p>{error}</p>
                <div className="container">
                    <div className="Progress">
                        <h2>進行中の工程</h2>
                        {progressProcesses.length === 0 ? (
                            <p>進行中の工程がありません</p>
                        ) : (
                            <table>
                                <tbody>
                                    {progressProcesses.map((process, index) =>
                                        <tr key={index} className="ProgeressProcess">
                                            <td className="process_name" onClick={() => this.lookProcess(process.processId)}>
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
                                            <td className="process_name" onClick={() => this.lookProcess(process.processId)}>
                                                {process.processName}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="buttons">
                        <button className="closeButton" onClick={this.toggleCloseProjectModal} disabled={project.complete === 1}>プロジェクトを終了する</button>
                        <button className="button" onClick={this.editMembers}>メンバー編集</button>
                        <button className="button" onClick={this.manageEquipment}>備品管理</button>
                        <button className="button" onClick={this.toggleAddProcessModal} disabled={project.complete === 1}>工程追加</button>
                    </div>
                </div>
                <div className="alertBox">
                    <div className="showAlert">
                        {/*アラート部分の画面表示*/}
                         {reflects.length === 0 ? (
                            <p>反省が登録されていません</p>
                        ) : (
                            <div className="reflectAnnounce">
                                <div className="summary">
                                    <span>「{this.getReflectTagName(reflect.reflectTagId)}」</span>タグの反省が最も多く登録されています
                                </div>
                                最近作成された内容
                                <div className="someReflects">
                                    
                                    <div className="reflect">
                                        {reflects[reflects.length - 1].createdAt}
                                        <br />--------------------<br />
                                        {reflects[reflects.length - 1].comment}
                                    </div>
                                    {reflects.length >= 2 && (
                                        <div className="reflect">
                                            {reflects[reflects.length - 2]?.createdAt}
                                            <br />--------------------<br />
                                            {reflects[reflects.length - 2]?.comment}
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    
                        -----------------------------------------------
                        <div className="equipAlertContainer">
                            <div className="equipAlert">
                                {alertList.length === 0 ? (
                                    <p>備品の問題はありません</p>
                                ) : (
                                    <div className="equipAnnounce">
                                        <p>以下の備品を確認してください</p>
                                        <div className="someEquips">

                                            {alertList.map((equip, index) =>
                                                <div key={index} className="equip">
                                                    {equip.equipName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                {/* プロジェクト終了用モーダル */}
                {showCloseProjectModal && (
                    <div id="overlayCloseProject" className="modal-overlay">
                        <div id="contentCloseProject" className="modal-content">
                            <h2>終了報告書登録</h2>
                            <p>{this.state.err}</p>
                            <div className="inputContainer">
                                <label>日時</label>
                                <input type="date" name="date" value={this.state.date} onChange={this.onInput} />
                            </div>
                            <div className="inputContainer">
                                <label>報告</label>
                                <input type="text" name="report" onChange={this.onInput} />
                            </div>
                            <p>プロジェクトを終了します。このプロジェクトを公開しますか？</p>
                            <div className="buttonContainer">
                                <button onClick={() => this.closeProject(1)}>はい</button>
                                <button onClick={() => this.closeProject(0)}>いいえ</button>
                                <button onClick={this.toggleCloseProjectModal}>キャンセル</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* プロセス追加用モーダル */}
                {showAddProcessModal && (
                    <div id="overlayAddProcess" className="modal-overlay">
                        <div id="contentAddProcess" className="modal-content">
                            <h2>工程の追加</h2>
                            <p>{this.state.err}</p>
                            <div className="inputContainer">
                                <label>工程名</label>
                                <input type="text" name="addName" value={this.state.addName} onChange={this.onInput} />
                            </div>
                            <div className="buttonContainer">
                                <button onClick={this.toggleAddProcessModal}>戻る</button>
                                <button onClick={() => this.addProcess()}>登録</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        )
    };
}