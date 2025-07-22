import React from "react";
import axios from "axios";


export default class ReportEdit extends React.Component {
  
  constructor(props) {
    
    super(props);
    this.state = {
      equipmentList: [],
     
  form: {
  createdAt: "",
  projectId: "",
  processId: "",
  equipId: "",
  comment: "",
  projectName: "",
  usageAmount: ""
},
      error: ""
    };
  }

  componentDidMount() {
    axios.get("/api/equip")
      .then(json => {
        this.setState({ equipmentList: json.data });
      })
      .catch(() => {
        this.setState({ error: "備品リストの取得に失敗しました" });
      });

    const { reportId } = this.props;
    if (reportId) {
      axios.get(`/api/report/${reportId}`)
        .then(json => {
          this.setState({ form: json.data });
        })
        .catch(() => {
          this.setState({ error: "レポートの取得に失敗しました" });
        });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prev => ({
      form: {
        ...prev.form,
        [name]: value
      }
    }));
  };
handleSubmit = (e) => {
  e.preventDefault();
  const { form } = this.state;
  const { reportId } = this.props;



 axios.post(`/api/report/${reportId}`, form)
    .then(() => alert("更新成功！"))
    .catch((err) => {
      console.error("エラー", err.response);
      alert("更新失敗");
    });
};

  render() {
    const { equipmentList, form, error } = this.state;

    return (
      <div className="report-register">
        <h2 className="title">日報編集</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={this.handleSubmit}>
          <div>
            日付:
         <input
  name="createdAt"
  value={form.createdAt}
  onChange={this.handleChange}
  readOnly 
 
/> {form.createdAt}
          </div>

          <div>
            研修タイトル:
            <input
              type="text"
              name="projectName"
              value={form.projectName || ""}
              onChange={this.handleChange}
            />
          </div>

          <div>
            備品名:
            <select
              name="equipId"
              value={form.equipId || ""}
              onChange={this.handleChange}
              required
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
              value={form.usageAmount || ""}
              onChange={this.handleChange}
            />
          </div>

          <div>
            コメント:
            <textarea
              name="comment"
              value={form.comment || ""}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <button type="button" onClick={() => window.history.back()}>
              戻る
            </button>
            <button type="submit" style={{ marginLeft: 10 }}>
              更新
            </button>
          </div>
        </form>
      </div>
    );
  }
}
