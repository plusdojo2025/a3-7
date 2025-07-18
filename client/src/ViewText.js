import React from "react";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom"; 


function ViewTextWrapper() {
    const params = useParams();
    const location = useLocation();
    return <ViewTextComponent params={params} location={location} />; 
}

class ViewTextComponent extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: "",
            loading: true,
            error: null,
            backLink: "/",
            backLinkText: "戻る",
        };
    }

    componentDidMount() {
        const { resourceId } = this.props.params;
        const queryParams = new URLSearchParams(this.props.location.search);
        const type = queryParams.get("type");
        const projectId = queryParams.get("projectId"); 

        if (!resourceId || !type) {
            this.setState({ error: "表示する情報が指定されていません。", loading: false });
            return;
        }

        this.fetchResourceContent(resourceId, type, projectId); 
    }

    fetchResourceContent = async (id, type, projectId) => { 
        this.setState({ loading: true, error: null });
        let backUrl = "/";
        let backText = "戻る";

        try {
            switch (type) {
                case "process": 
                    const dailyReportsRes = await axios.get(`/api/process/${id}/report`); 
                    const reflectionsRes = await axios.get(`/api/process/${id}/reflect`); 

                    const dailyReportsContent = dailyReportsRes.data.length > 0
                        ? dailyReportsRes.data.map(r => `[日報] ${new Date(r.reportDate).toLocaleDateString()} - ${r.title}\n${r.content || r.reportContent}`).join('\n\n')
                        : "日報がありません。";
                    const reflectionsContent = reflectionsRes.data.length > 0
                        ? reflectionsRes.data.map(r => `[反省] ${new Date(r.reflectionDate).toLocaleDateString()} - ${r.content || r.reflectionContent}`).join('\n\n')
                        : "反省がありません。";
                    
                    let processName = "工程";
                    try {
                       
                        const processRes = await axios.get(`/api/processes/${id}`); 
                        processName = processRes.data.processName || processName;
                    } catch (e) {
                        console.warn("工程名の取得に失敗しました。", e);
                    }

                    this.setState({ 
                        title: `${processName} の日報と反省`, 
                        content: `--- 日報 ---\n${dailyReportsContent}\n\n--- 反省 ---\n${reflectionsContent}`,
                    });
                    backUrl = `/project/${projectId}/processes`;
                    backText = "プロジェクト工程一覧に戻る";
                    break;
                case "projectReport": 
                    const projectReportRes = await axios.get(`/api/project-reports/${id}`); 
                    this.setState({ 
                        title: projectReportRes.data.reportTitle || "プロジェクト報告書", 
                        content: projectReportRes.data.reportContent || projectReportRes.data.content || "内容がありません。",
                    });
                    backUrl = `/project/${projectId}/processes`;
                    backText = "プロジェクト工程一覧に戻る";
                    break;
                default:
                    this.setState({ error: "不正なタイプが指定されました。", loading: false });
                    return;
            }
            this.setState({ loading: false, backLink: backUrl, backLinkText: backText });
        } catch (err) {
            console.error(`データの取得に失敗しました (${type} ID: ${id})`, err);
            this.setState({ 
                error: "データの取得に失敗しました。指定されたIDまたはタイプが間違っている可能性があります。", 
                loading: false, 
                title: "", 
                content: "" 
            });
        }
    }

    render() {
        const { title, content, loading, error, backLink, backLinkText } = this.state;

        if (loading) {
            return <p>読み込み中...</p>;
        }

        if (error) {
            return <p className="error-message">{error}</p>;
        }

        return (
            <div className="viewTextMain">
                <h2>{title}</h2>
                <div className="text-content">
                    {content}
                </div>
                <hr/>
                <Link to={backLink} className="back-link">
                    {backLinkText}
                </Link>
            </div>
        );
    }
}

export default ViewTextWrapper; 