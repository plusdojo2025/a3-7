import React from 'react';
import axios from 'axios';
import './css/Common.css';
import './css/ViewProject.css';
import { useParams, Link } from 'react-router-dom';

// useParams をクラスコンポーネントで使うためのラッパー
function ViewProjectWrapper() {
    const params = useParams(); 
    return <ViewProjectComponent params={params} />;
}

class ViewProjectComponent extends React.Component {
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

    // マウント直後
    componentDidMount() {
        this.fetchProjectDetails();
    }

    // 更新後
    componentDidUpdate(prevProps) {
        if (this.props.params.projectId !== prevProps.params.projectId) {
            this.fetchProjectDetails();
        }
    }

    // プロジェクト詳細（工程、報告書）を取得（非同期）
    fetchProjectDetails = async () => {
        const { projectId } = this.props.params; 

        console.log(`ViewProjectComponent: Fetching details for Project ID: ${projectId}`);

        this.setState({
            loading: true,
            error: null,
            project: null, 
            processes: [],
            projectReports: [],
        });

        if (!projectId) {
            console.error("projectId is missing. Cannot fetch project details.");
            this.setState({
                loading: false,
                error: "プロジェクトIDが指定されていません。",
            });
            return;
        }

        try {
            //プロジェクト詳細の取得
            const projectRes = await axios.get(`/api/projects/${projectId}`);
            console.log('API Response - Project:', projectRes.data);
            this.setState({ project: projectRes.data });

            //工程一覧の取得
           const processesRes = await axios.get(`/api/projects/${projectId}/processes`); 
           console.log('API Response - Processes:', processesRes.data);
           this.setState({ processes: processesRes.data });

            //プロジェクト報告書一覧の取得
            const projectReportsRes = await axios.get(`/api/projects/${projectId}/project-report`);
            console.log('API Response - ProjectReports:', projectReportsRes.data);
            this.setState({ projectReports: projectReportsRes.data });

        } catch (err) {
            console.error("プロジェクト詳細の取得に失敗しました:", err);
            this.setState({
                error: "プロジェクト情報の取得中にエラーが発生しました。",
            });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { project, processes, projectReports, loading, error } = this.state;

        if (loading) {
            return <div className="loading">プロジェクト情報を読み込み中...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (!project) {
            return <div className="not-found">プロジェクトが見つかりませんでした。</div>;
        }

        // ココから表示内容
         return (
        <>
            {/* --- プロジェクト名（タイトル） --- */}
            <h2 className="project-title">{project.projectName}</h2>
            <div className="content-sections-wrapper">

                {/* --- 工程一覧 --- */}
                <div className="section-card process-section">
                    <h3>工程</h3>
                 <div className='scrollable-list-content'>
                    {processes.length > 0 ? (
                        <ul className="process-list">
                            {processes.map(process => (
                                <li key={process.processId}>
                                    <Link to={`/project/${project.projectId}/processes/${process.processId}`}>
                                        {process.processName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>このプロジェクトには工程が登録されていません。</p>
                    )}
                 </div>
                </div>

                {/* --- プロジェクト報告書一覧 --- */}
                <div className="section-card report-section">
                    <h3>プロジェクト報告書</h3>
                    {projectReports.length > 0 ? (
                        <ul className="project-report-list">
                            {projectReports.map(report => (
                                <li key={report.projectReportId}>
                                    <Link to={`/view-text/project-report/${report.projectReportId}`}>
                                        {/* 日付形式の調整が必要であればここで */}
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>このプロジェクトには報告書がありません。</p>
                    )}
                </div>

            </div>

            {/* --- 「前のページに戻る」リンク --- */}
            <div className="back-link-container"> 
                <Link to={-1} className="back-link">戻る</Link>
            </div>
        </>
    );
}
}

export default ViewProjectWrapper;