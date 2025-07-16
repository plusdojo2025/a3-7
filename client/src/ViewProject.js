import React from "react";
import axios from "axios";

export default class ViewProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null
        };
    }

    //プロジェクト詳細取得
    componentDidMount() {
        const projectId = window.location.pathname.split("/").pop();

        axios.get(`/api/projects/${projectId}`)
      .then(res => {
        this.setState({ project: res.data });
      })
      .catch(err => {
        console.error("プロジェクト詳細の取得に失敗しました", err);
      });
  }

  // 検索画面に戻る処理
  goBack = () => {
    window.location.href = "/search"; // シンプルに戻す
  };

  render() {
    const { project } = this.state;

    // データ取得前はローディング表示
    if (!project) {
      return <div>読み込み中...</div>;
    }

    return (
      <div>
        <h2>プロジェクト詳細</h2>
        <h3>{project.projectName}</h3>

        <h4>工程一覧</h4>
        <ul>
          {project.steps.map(step => (
            <li key={step.stepId}>
              <a href={`/steps/${step.stepId}`}>{step.stepName}</a>
            </li>
          ))}
        </ul>

        <h4>報告書一覧</h4>
        <ul>
          {project.reports.map(report => (
            <li key={report.reportId}>
              <a href={`/reports/${report.reportId}`}>{report.reportTitle}</a>
            </li>
          ))}
        </ul>

        {/* 戻るボタン */}
        <button onClick={this.goBack}>検索画面に戻る</button>
      </div>
    );
  }
}