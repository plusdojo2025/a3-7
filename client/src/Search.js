import React from "react";
import axios from "axios";
import './css/Common.css'; 
import { useNavigate, Link } from "react-router-dom"; 

// useNavigate をクラスコンポーネントで使うためのラッパー
function SearchWrapper() {
    const navigate = useNavigate(); 
    return <SearchComponent navigate={navigate} />; 
}

class SearchComponent extends React.Component { 
    constructor(props) {
        super(props); 
        this.state = {
            title: "",
            tagId: "",
            tags: [],
            projects: [],
            loading: false,
            error: null,
            searchPerformed: false,
        };
    }

    // コンポーネントがマウントされた後にタグ一覧を取得する
    componentDidMount() {
        console.log("SearchComponent componentDidMount: Fetching project tags...");
        axios.get("/api/project-tags")
        .then(res => {
            console.log("Project tags fetched successfully:", res.data);
            this.setState({tags: res.data});
        })
        .catch(err => {
            console.error("タグ一覧の取得に失敗しました。", err);
            this.setState({ error: "タグ一覧の取得に失敗しました。" });
        });    
    }

    // 入力フォームの値が変更されたときにstateを更新する
    onInput = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: name=${name}, value=${value}`);
        this.setState({ [name]: value });
    }

    // プロジェクト検索ボタンがクリックされた時の処理
    searchProjects = async () => {
        const { title, tagId } = this.state;
        
        console.log(`Searching projects with title: "${title}", tagId: "${tagId}"`);

        // 検索開始時に状態をリセット
        this.setState({ 
            loading: true, 
            error: null, 
            projects: [], 
            searchPerformed: true 
        });

        // APIに送るパラメータを構築
        const apiParams = {};
        if (title) {
            apiParams.title = title;
        }
        if (tagId !== "") {
            apiParams.tagId = tagId;
        }

        try {
            // プロジェクト検索APIを呼び出す
            const res = await axios.get("/api/projects/search", { params: apiParams });
            console.log("Search results received:", res.data);
            this.setState({
                projects: res.data,
                loading: false,
            });
        } catch (err) {
            console.error("プロジェクトの検索に失敗しました。", err);
            this.setState({
                error: "プロジェクトの検索に失敗しました。時間をおいて再度お試しください。",
                loading: false,
                projects: [],
            });
        }
    }

    render() {
        const { title, tagId, tags, projects, loading, error, searchPerformed } = this.state;

        return (
            <div className="searchMain">
                <h2>プロジェクト検索</h2>
                <div className="searchForm">
                    <label>
                        プロジェクト名：
                        <input type="text" name="title" value={title} onChange={this.onInput} />
                    </label><br />
                    <label>
                        タグ：
                        <select name="tagId" value={tagId} onChange={this.onInput}>
                           <option value="">タグを選択</option>
                           {tags.map(tag => (
                                <option key={tag.projectTagId} value={tag.projectTagId}>
                                    {tag.projectTagName}
                                </option>
                           ))} 
                        </select>
                    </label><br />
                    <button onClick={this.searchProjects}>検索</button>
                </div>

                {/* --- 検索結果表示エリア --- */}
                <hr />
                <h3>検索結果</h3>
                
                {loading && <p>検索中...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {searchPerformed && !loading && !error && projects.length === 0 && (
                    <p>検索条件に一致するプロジェクトは見つかりませんでした。</p>
                )}

                {/* 検索結果がある場合のみリストを表示 */}
                {!loading && !error && projects.length > 0 && (
                    <div className="projectListBody">
                        <table>
                            <thead>
                                <tr>
                                    <th>プロジェクト名</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(project => (
                                    <tr key={project.projectId} className="projectrow">
                                        <td className="name">
                                            {/* クリックでプロジェクト詳細ページへ遷移 */}
                                            <Link to={`/project/${project.projectId}`}>
                                                {project.projectName}
                                            </Link>
                                        </td>
                                        
                                    </tr> 
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default SearchWrapper;