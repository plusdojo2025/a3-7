import React from "react";
import axios from "axios";
// useNavigate はWrapperで使用するため、Linkのみをクラスコンポーネント内で直接使用
import { useNavigate, Link } from "react-router-dom"; 

// 関数コンポーネントでクラスコンポーネントをラップし、Hooksを注入する
function SearchWrapper() {
    const navigate = useNavigate(); // useNavigate はここで呼び出す
    return <SearchComponent navigate={navigate} />; // クラスコンポーネントにnavigateをpropsとして渡す
}

// クラスコンポーネントはデフォルトエクスポートしない（SearchWrapperがデフォルトエクスポートするため）
class SearchComponent extends React.Component { // コンポーネント名をSearchComponentに変更
    constructor(props) {
        super(props) 
        this.state = {
            title: "",
            tagId: "",
            tags: [], // プロジェクトタグ一覧
            projects: [], // 検索結果を保持するstate
            loading: false, // 検索中の状態を示す
            error: null,    // エラーメッセージを保持する
            searchPerformed: false, // 検索が一度実行されたかどうかを示す
        };
    }

    // 初期マウント時にタグ一覧を取得
    componentDidMount() {
        axios.get("/api/project-tags")
        .then(res => {
            this.setState({tags: res.data});
        })
        .catch(err => {
            console.error("タグ一覧の取得に失敗しました。", err);
        });    
    }

    // 入力が変更されたときにstateを更新
    onInput = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    // 検索ボタン処理 (非同期処理)
    searchProjects = async () => {
        const { title, tagId } = this.state;
        
        // 検索開始時に状態をリセット
        this.setState({ 
            loading: true, 
            error: null, 
            projects: [], // 新しい検索のために以前の結果をクリア
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
            this.setState({
                projects: res.data,
                loading: false,
            });
        } catch (err) {
            console.error("プロジェクトの検索に失敗しました。", err);
            this.setState({
                error: "プロジェクトの検索に失敗しました。時間をおいて再度お試しください。",
                loading: false,
                projects: [], // エラー時はプロジェクトリストをクリア
            });
        }
        // Search.js内で結果を表示するため、ここではnavigateは使用しない
        // もし特定の条件で他のページに遷移したい場合は、this.props.navigate を使用
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
                
                {/* 検索が実行され、ローディング中でなく、エラーもなく、結果が0件の場合 */}
                {searchPerformed && !loading && !error && projects.length === 0 && (
                    <p>検索条件に一致するプロジェクトは見つかりませんでした。</p>
                )}

                {/* 検索結果がある場合のみリストを表示 */}
                {!loading && !error && projects.length > 0 && (
                    <ul className="project-list">
                       {projects.map(project => (
                        <li key={project.projectId}>
                            {/* クリックで工程詳細ページへ遷移 */}
                            <Link to={`/project/${project.projectId}/processes`}>
                                {project.projectName}
                            </Link>
                        </li> 
                       ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default SearchWrapper; // ラッパーコンポーネントのみをデフォルトエクスポート