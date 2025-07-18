import React from "react";
import axios from "axios";

export default class Reflect extends React.Component {
  state = {
    reflectList: [],
    form: {
      createdAt: "",
      reflectTagId: "",
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
        console.error("プロジェクト取得エラー:", err);
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
          form: { createdAt: "", reflectTagId: "", comment: "" },
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
          <div>
            <label>日付：</label>
            <input
              type="date"
              name="createdAt"
              value={form.createdAt}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <label>タグの選択：</label>
               <select
              name="reflectTagId"
              value={form.reflectTagId}
              onChange={this.handleChange}
             
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
            <label>コメント：</label>
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
