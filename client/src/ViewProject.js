// ViewProject.js
import React from "react";

export default class ViewProject extends React.Component {
  render() {
    const { projects } = this.props;

    if (projects.length === 0) {
      return <p>検索結果はありません。</p>;
    }

    return (
      <div className="projectList">
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>プロジェクト名</th>
              <th>タグID</th>
              {/* 必要ならタグ名を追加してもOK */}
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.project_id}>
                <td>{project.project_id}</td>
                <td>{project.project_name}</td>
                <td>{project.project_tag_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
