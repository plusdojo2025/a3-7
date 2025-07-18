import React from "react";
import axios from "axios";

export default class Report extends React.Component {
  state = {
     equipmentList: [],
  
     form: {
      createdAt: "",
      processId: "",
      projectId: "",
      comment: "",
      projectName: "",
      equipId: "",
      usageAmount: ""
    },
    error: ""
  };

  componentDidMount() {
    
    axios.get("/api/equip")
      .then(json => {
        this.setState({ equipmentList: json.data });
      })
      .catch(err => {
        console.error("備品取得エラー:", err);
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

    

    axios.post("/api/report", form)
      .then(() => {
        alert("登録成功！");
        this.setState({
          form: {
            createdAt: "",
            processId: "",
            projectId: "",
            comment: "",
            projectName: "",
            equipId: "",
            usageAmount: ""
          },
          error: ""
        });
      })
      .catch(() => {
        alert("登録失敗");
      });
  };

  render() {
    const { equipmentList, projectList, form, error } = this.state;

    return (
      <div className="report-register">
        <h2 className="title">日報登録</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={this.handleSubmit}>
          <div>
            日付:
            <input
              type="date"
              name="createdAt"
              value={form.createdAt}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            研修タイトル:
            <input type="text" name="projectName" value={form.projectName}  onChange={this.handleChange}/>

          </div>

          <div>
            備品名:
            <select
              name="equipId"
              value={form.equipId}
              onChange={this.handleChange}
             
            >
              <option value="">選択してください</option>
              {equipmentList.map(equip => (
                <option key={equip.equipId} value={equip.equipId}>
                  {equip.equipName}
                </option>
              ))}
            </select>
          </div>

          <div>
            使用量:
            <input
              type="text"
              name="usageAmount"
              value={form.usageAmount}
              onChange={this.handleChange}
            />
          </div>

          <div>
            コメント:
            <textarea
              name="comment"
              value={form.comment}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <button type="button" onClick={() => window.history.back()}>
              戻る
            </button>
            <button type="submit" style={{ marginLeft: 10 }}>
              登録
            </button>
          </div>
        </form>
      </div>
    );
  }
}
