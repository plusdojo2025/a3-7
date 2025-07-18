import React from "react";
import axios from "axios";
import "./css/Mail.css";

export default class Mail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pendingInvites: [], // { memberId, projectId /*, inviterEmail? inviterName? */ }
      userId: null,
    };
  }

  componentDidMount(){
    axios.get("http://localhost:8080/checkLogin/", { withCredentials: true })
      .then(() => axios.get("http://localhost:8080/users/", { withCredentials: true }))
      .then(res => {
        const currentUser = res.data[res.data.length - 1];
        this.setState({ userId: currentUser.userId });
        return axios.get(
          `http://localhost:8080/api/members/pending?userId=${currentUser.userId}`,
          { withCredentials: true }
        );
      })
      .then(res => {
        this.setState({ pendingInvites: res.data });
      })
      .catch(err => {
        console.error("招待取得エラー", err);
      });
  }

  handleApprove = (member) => {
    axios.post("http://localhost:8080/api/members/approve",
      { userId: this.state.userId, projectId: member.projectId },
      { withCredentials: true }
    )
    .then(res => {
      console.log("承認成功:", res.data);
      // 招待をリストから除外
      this.setState(prev => ({
        pendingInvites: prev.pendingInvites.filter(m => m.memberId !== member.memberId)
      }));
    })
    .catch(err => console.error("承認エラー", err));
  };

  handleCancel = (member) => {
    axios.post("http://localhost:8080/api/members/cancel",
      { userId: this.state.userId, projectId: member.projectId },
      { withCredentials: true }
    )
    .then(res => {
      console.log("キャンセル成功:", res.data);
      this.setState(prev => ({
        pendingInvites: prev.pendingInvites.filter(m => m.memberId !== member.memberId)
      }));
    })
    .catch(err => console.error("キャンセルエラー", err));
  };

  render() {
    return (
      <div className="mailbox">
        <h2>マイページ ＞ メールボックス</h2>
        <div className="mail-list" style={{ border: "1px solid #ccc", padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
          {this.state.pendingInvites.length === 0 ? (
            <p>現在、承認待ちの招待はありません。</p>
          ) : (
            <ul>
              {this.state.pendingInvites.map(invite => (
                <li key={invite.memberId}>
                  <span>プロジェクトID {invite.projectId} から招待があります。</span>
                  <button onClick={() => this.handleApprove(invite)}>承認</button>
                  <button onClick={() => this.handleCancel(invite)}>拒否</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button style={{ marginTop: "10px" }} onClick={() => window.history.back()}>戻る</button>
      </div>
    );
  }
}
