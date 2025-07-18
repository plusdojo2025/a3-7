import React from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom"; 


function ViewProcessWrapper() {
    const params = useParams();
    return <ViewProcessComponent params={params} />; 
}

class ViewProcessComponent extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            processes: [],
            projectReports: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {

        const { projectId } = this.props.params; 
        if (!projectId) {
            this.setState({ error: "プロジェクトIDが見つかりません。", loading: false });
            return;
        }
        this.fetchProjectAndProcessData(projectId);
    }

    componentDidUpdate(prevProps) {

        const { projectId } = this.props.params;
        if (projectId !== prevProps.params.projectId) {
            this.setState({ loading: true, error: null });
            this.fetchProjectAndProcessData(projectId);
        }
    }

    fetchProjectAndProcessData = async (projectId) => {
        try {
            // プロジェクト詳細を取得
            const projectRes = await axios.get(`/api/projects/${projectId}`);
            this.setState({ project: projectRes.data });

            // 工程一覧を取得
            const processesRes = await axios.get(`/api/projects/${projectId}/process`); 
            this.setState({ processes: processesRes.data });

            // プロジェクト報告書一覧を取得
            const projectReportsRes = await axios.get(`/api/projects/${projectId}/project-report`);
            this.setState({ projectReports: projectReportsRes.data });

        } catch (err) {
            console.error("データの取得に失敗しました:", err);
            this.setState({ error: "データの取得に失敗しました。", project: null, processes: [], projectReports: [] });
        } finally {
            this.setState({ loading: false });
        }
    }

    render() {
        const { project, processes, projectReports, loading, error } = this.state;

        const { projectId } = this.props.params;

        if (loading) {
            return <p>読み込み中...</p>;
        }

        if (error) {
            return <p className="error-message">{error}</p>;
        }

        if (!project) {
            return <p>プロジェクトが見つかりませんでした。</p>;
        }

        return (
            <div className="viewProcessMain">
                <h2>プロジェクト: {project.projectName}</h2>
                <h3>工程一覧</h3>

                {processes.length === 0 ? (
                    <p>工程が登録されていません。</p>
                ) : (
                    <ul className="process-list">
                        {processes.map(process => (
                            <li key={process.processId} className="process-item">
                                <span className="process-name">
                                    工程名: {process.processName}
                                </span>
                                <Link 
                                    to={`/view-text/${process.processId}?type=process&projectId=${projectId}`} 
                                    className="process-link"
                                >
                                    日報・反省を見る
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <h3>プロジェクト報告書一覧</h3>
                {projectReports.length === 0 ? (
                    <p>プロジェクト報告書がありません。</p>
                ) : (
                    <ul className="report-list">
                        {projectReports.map(report => (
                            <li key={report.id} className="report-item">
                                <Link to={`/view-text/${report.id}?type=projectReport&projectId=${projectId}`} className="report-link">
                                    {report.reportTitle} ({new Date(report.reportDate).toLocaleDateString()})
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
                
                <hr/>
                <Link to="/" className="back-link">
                    検索ページに戻る
                </Link>
            </div>
        );
    }
}

export default ViewProcessWrapper; 