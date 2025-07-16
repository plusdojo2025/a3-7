import React from "react";
import axios from "axios";
import ViewProject from "./ViewProject";

export default class Search extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            title: "",
            tagId: "",
            tags: [],
            projects: []
        };
    }

    //初期マウント時にタグ一覧取得
    componentDidMount() {
        axios.get("/api/project-tags")
        .then(res => {
            this.setState({tags: res.data});
        })
        .catch(err => {
            console.error("タグ一覧の取得に失敗しました。", err);
        });    
    }

    //入力が変更されたときstateを更新
    onInput = (e) => {
        const name = e.target.name;
        this.setState({ [name]: e.target.value});
    }

    //検索ボタン処理
    searchProjects = () => {
        const { title, tagId } = this.state;

        const params = {
            title: title,
            tagId: tagId
        };

    axios.get("/api/projects/search", { params })
      .then(res => {
        this.setState({ projects: res.data });
      })
      .catch(err => {
        console.error("検索に失敗しました", err);
      });
    }

    render() {
        const { title, tagId, tags, projects } = this.state;

        return (
            <div className="searchMain">
                <h2>プロジェクト検索</h2>
                <div classname="searchForm">
                    プロジェクト名：
                    <input type="text" name="title" value={title} onChange={this.onInput} /><br />
                    タグ：
                    <select name="tagId" value={tagId} onChange={this.onInput}>
                     <option value="">タグを選択</option>
                     {tags.map(tag => (
                        <option key={tag.projectTagId} value={tag.projectTagId}>
                            {tag.projectTagName}
                        </option>
                     ))} 
                    </select><br />
                    <button onClick={this.searchProjects}>検索</button>
                </div>

                {/*検索結果表示*/}
                <ViewProject projects={projects} />
            </div>
        );
    }
}