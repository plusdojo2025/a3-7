import React from "react";
import axios from "axios";
import './css/Search.css';
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
            tags: [],
            tagId: "",           
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

    //Enterキー押下で検索処理を呼び出す
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.searchProjects();
        }
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
        <> 
            <div className="search-form-section"> 
                <div className="search-controls-area"> 
                    {/* プロジェクト名入力のグループ */}
                    <div className="search-input-group"> 
                        <label htmlFor="project-name-input"></label>
                        <input
                            type="text"
                            id="project-name-input"
                            name="title"
                            value={title}
                            onChange={this.onInput}
                            onKeyDown={this.handleKeyDown}
                            placeholder="プロジェクト名を入力"
                        />
                    </div>

                    {/* タグ選択のグループ */}
                    <div className="search-input-group">
                        <label htmlFor="tag-select"></label>
                        <select id="tag-select" name="tagId" value={tagId} onChange={this.onInput}>
                            <option value="">タグを選択</option>
                            {tags.map(tag => (
                                <option key={tag.projectTagId} value={tag.projectTagId}>
                                    {tag.projectTagName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 検索ボタン */}
                    <button onClick={this.searchProjects} className="search-button">検索</button>
                </div>
                <hr className="section-separator" />
            </div>

            {/* --- 検索結果セクション --- */}
            <div className="search-results-area">
                <h3>検索結果</h3>

                {loading && <p>検索中...</p>}
                {error && <p className="error-message">{error}</p>}

                {searchPerformed && !loading && !error && projects.length === 0 && (
                    <p>検索条件に一致するプロジェクトは見つかりませんでした。</p>
                )}

                {!loading && !error && projects.length > 0 && (
                   <div className="scrollable-results-content"> 
                    <div className="projectListBody">
                        <table>
                            <tbody>
                                {projects.map(project => (
                                    <tr key={project.projectId} className="projectrow">
                                        <td className="name">
                                            <Link to={`/project/${project.projectId}`}>
                                                {project.projectName}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                   </div> 
                )}
            </div>
        </>
    );
        }
    }

export default SearchWrapper;