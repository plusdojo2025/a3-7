import React from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; 


function ViewProjectWrapper() {
    const location = useLocation();
    return <ViewProjectComponent location={location} />; 
}

class ViewProjectComponent extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            loading: true,
            error: null,
            searchPerformed: false,
        };
    }

    componentDidMount() {

        this.fetchProjectsBasedOnQueryParams(this.props.location.search);
    }

    componentDidUpdate(prevProps) {

        if (this.props.location.search !== prevProps.location.search) {
            this.fetchProjectsBasedOnQueryParams(this.props.location.search);
        }
    }

    fetchProjectsBasedOnQueryParams = async (searchQuery) => {
        this.setState({ loading: true, error: null, searchPerformed: true });
        const params = new URLSearchParams(searchQuery);
        const title = params.get("title") || "";
        const tagId = params.get("tagId") || "";

        const apiParams = { title: title };
        if (tagId) {
            apiParams.tagId = tagId;
        }

        try {
            const res = await axios.get("/api/projects/search", { params: apiParams });
            this.setState({ projects: res.data, loading: false });
        } catch (err) {
            console.error("プロジェクトの検索に失敗しました", err);
            this.setState({ error: "プロジェクトの検索に失敗しました。", loading: false, projects: [] });
        }
    }

    render() {
        const { projects, loading, error, searchPerformed } = this.state;

        if (loading && searchPerformed) {
            return <p>プロジェクトを検索中...</p>;
        }

        if (error) {
            return <p className="error-message">{error}</p>;
        }
        
        if (!searchPerformed) {
            return <p>検索条件を入力してプロジェクトを検索してください。</p>;
        }

        return (
            <div className="viewProjectMain">
                <h2>プロジェクト一覧</h2>
                
                {projects.length === 0 ? (
                    <p>検索結果がありません。</p>
                ) : (
                    <ul className="project-list">
                        {projects.map(project => (
                            <li key={project.projectId} className="project-item">
                                <span className="project-name">
                                    {project.projectName}
                                </span>
                                <Link to={`/project/${project.projectId}/processes`} className="project-link">
                                    工程を見る
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

export default ViewProjectWrapper; 