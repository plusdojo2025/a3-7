import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './css/reflect.css';

function ReflectWrapper() {
  const { projectId, processId } = useParams(); 
  const navigate = useNavigate();
  return <Reflect projectId={projectId} processId={processId} navigate={navigate} />;
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
    this.props.navigate(`/process?id=${this.props.processId}`);
  };

  render() {
    const { reflectList, form, error } = this.state;

    return (
      <div >
        <h2>反省登録</h2>
        <div className="reflection-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="projectId" value={form.projectId} />
          <input type="hidden" name="processId" value={form.processId} />

          <div>
            <label>日付：<input
              type="date"
              name="createdAt"
              value={form.createdAt}
              onChange={this.handleChange}
              required
            /></label><br />
            
          </div>

          <div>
            <label>タグの選択： <select
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
            </select></label><br />
           
          </div>

          <div>
            <label>コメント：<textarea
              name="comment"
              value={form.comment}
              onChange={this.handleChange}
            /></label><br />
            
          </div>

          <div style={{ marginTop: "10px" }} className="reflect-button-area">
            <button type="button" onClick={() => this.props.navigate(`/process?id=${this.props.processId}`)}>
              戻る
            </button>
            <button type="submit">登録</button>
          </div>
        </form>
        </div>
      </div>
    );
  }
}


export default ReflectWrapper;
