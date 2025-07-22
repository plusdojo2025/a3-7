import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


function ReflectWrapper() {
  const { projectId, processId } = useParams(); 
  return <Reflect projectId={projectId} processId={processId} />;
}

class Reflect extends React.Component {
  state = {
    reflectList: [],
    form: {
      createdAt: "",
      reflectTagId: "",
      projectId: this.props.projectId || "",
      processId: this.props.processId || "",
      comment: ""
    },
    error: ""
  };

  componentDidMount() {
    axios.get("/api/reflectTag")
      .then(json => {
        this.setState({ reflectList: json.data });
      })
      .catch(err => {
        console.error("タグ取得エラー:", err);
        this.setState({ error: "タグの取得に失敗しました" });
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: value
      }
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.state;

    if (!form.createdAt || !form.reflectTagId) {
      this.setState({ error: "日付とタグを必ず選択してください。" });
      return;
    }

    axios.post("/api/reflect", form)
      .then(() => {
        alert("登録しました！");
        this.setState({
          form: {
            createdAt: "",
            reflectTagId: "",
            comment: "",
            processId: this.props.processId || "",
            projectId: this.props.projectId || ""
          },
          error: ""
        });
      })
      .catch(() => {
        alert("登録に失敗しました");
      });
  };

  render() {
    const { reflectList, form, error } = this.state;

    return (
      <div className="reflection-form">
        <h2>反省登録</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="projectId" value={form.projectId} />
          <input type="hidden" name="processId" value={form.processId} />

          <div>
            <label>日付：</label><br />
            <input
              type="date"
              name="createdAt"
              value={form.createdAt}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <label>タグの選択：</label><br />
            <select
              name="reflectTagId"
              value={form.reflectTagId}
              onChange={this.handleChange}
              required
            >
              <option value="">選択してください</option>
              {reflectList.map(tag => (
                <option key={tag.reflectTagId} value={tag.reflectTagId}>
                  {tag.reflectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>コメント：</label><br />
            <textarea
              name="comment"
              value={form.comment}
              onChange={this.handleChange}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <button type="button" onClick={() => window.history.back()}>
              戻る
            </button>
            <button type="submit">登録</button>
          </div>
        </form>
      </div>
    );
  }
}


export default ReflectWrapper;
