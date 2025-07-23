import React from 'react';
import axios from 'axios';
import './css/Common.css';
import './css/ViewProcess.css';
import { useParams, Link } from 'react-router-dom';


// useParamsをクラスコンポーネントで使うためのラッパー
function ViewProcessWrapper() {
    const params = useParams();
    return <ViewProcessComponent params={params} />;
}
class ViewProcessComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            process: null,
            project: null,
            reports: [],
            reflects: [],
            loading: true,
            error: null,
        };
    }

    // マウントされた直後に呼び出されるライフサイクルメソッド
    componentDidMount() {
        this.fetchProcessDetails();
    }

    // コンポーネント更新後に呼び出されるライフサイクルメソッド
    componentDidUpdate(prevProps) {
        if (this.props.params.projectId !== prevProps.params.projectId ||
            this.props.params.processId !== prevProps.params.processId) {
            this.fetchProcessDetails();
        }
    }

    // プロジェクト情報取得（非同期で取得）
    fetchProcessDetails = async () => {
        const { projectId, processId } = this.props.params;

        this.setState({ loading: true, error: null });

        if (!projectId || !processId) {
            console.error("ViewProcessComponent Error: Project ID or Process ID is missing.");
            this.setState({
                loading: false,
                error: "プロジェクトIDまたは工程IDが指定されていません。",
            });
            return;
        }

        try {
            //単一工程の詳細取得
            const processRes = await axios.get(`/api/projects/processes/${processId}`);
            this.setState({ process: processRes.data });

            //親プロジェクト情報の取得
            const projectRes = await axios.get(`/api/projects/${projectId}`);
            this.setState({ project: projectRes.data });

            //日報一覧の取得
            const reportsRes = await axios.get(`/api/projects/processes/${processId}/report`);
            this.setState({ reports: reportsRes.data });

            //反省一覧の取得
            const reflectsRes = await axios.get(`/api/projects/processes/${processId}/reflect`);
            this.setState({ reflects: reflectsRes.data });

            this.setState({ loading: false });

        } catch (err) {
            console.error("工程詳細の取得に失敗しました:", err);
            this.setState({
                error: "工程情報の取得中にエラーが発生しました。",
                loading: false,
            });
        }
    };

    // コンポーネントのUIをレンダーするライフサイクルメソッド
    render() {
        const { process, reports, reflects, loading, error } = this.state;
        const { projectId } = this.props.params;

        if (loading) {
            return <div className="loading">工程情報を読み込み中...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (!process) {
            return <div className="not-found">指定された工程が見つかりませんでした。</div>;
        }

        // ココから表示内容
       return (
        <>
            {/* --- 工程名（タイトル） --- */}
            <h2 className="process-title">{process.processName}</h2> 
            

            <div className="content-lists-wrapper">

                {/* --- 日報一覧セクション --- */}
                <div className="list-card section-card">
                    <h3>日報</h3>
                 <div className="scrollable-list-content">
                    {reports.length > 0 ? (
                        <ul className="report-list">
                            {reports.map(report => (
                                <li key={report.reportId}>
                                    <Link to={`/view-text/report/${report.reportId}`}>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>日報はまだ登録されていません。</p>
                    )}
                 </div>
                </div>

                {/* --- 反省一覧セクション --- */}
                <div className="list-card section-card">
                    <h3>反省</h3>
                 <div className="scrollable-list-content">
                    {reflects.length > 0 ? (
                        <ul className="reflect-list">
                            {reflects.map(reflect => (
                                <li key={reflect.reflectId}>
                                    <Link to={`/view-text/reflect/${reflect.reflectId}`}>
                                        {/* 日付形式の調整が必要であればここで */}
                                        {new Date(reflect.createdAt).toLocaleDateString()}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>反省はまだ登録されていません。</p>
                    )}
                 </div>
                </div>

            </div>

            {/* --- 「前のページに戻る」リンク --- */}
            <div className="back-link-container">
                <Link to={projectId ? `/project/${projectId}` : -1} className="back-link">戻る</Link>
            </div>
        </>
    );
}    
}

export default ViewProcessWrapper;