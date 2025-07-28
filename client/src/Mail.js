import React from "react";
import axios from "axios";
import "./css/Mail.css";

export default class Mail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pendingInvites: [], // { memberId, projectId … }
      userId: null,
    };
  }

  componentDidMount() {
    // セッションからログインユーザーを取得
    axios.get("http://localhost:8080/getCurrentUser", { withCredentials: true })
      .then(res => {
        if (res.data) {
          console.log("✅ ログインユーザー:", res.data);
          this.setState({ userId: res.data.userId });

          // 招待情報取得
          return axios.get(
            `http://localhost:8080/api/members/pending?userId=${res.data.userId}`,
            { withCredentials: true }
          );
        } else {
          throw new Error("ログインユーザーなし");
        }
      })
      .then(res => {
        console.log("📩 招待取得成功:", res.data);
        this.setState({ pendingInvites: res.data });
      })
      .catch(error => {
        console.error("❌ ユーザーまたは招待情報取得失敗:", error);
      });
  }

  handleApprove = (member) => {
    console.log("✅ 承認対象メンバー情報:", member);
    console.log("✅ ログインユーザーID:", this.state.userId);

    axios.post("http://localhost:8080/api/members/approve", {
      userId: this.state.userId,
      projectId: member.projectId
    }, { withCredentials: true })
      .then(res => {
        console.log("✔️ 承認成功:", res.data);
        this.setState(prev => ({
          pendingInvites: prev.pendingInvites.filter(m => m.memberId !== member.memberId)
        }));
      })
      .catch(err => {
        console.error("❌ 承認エラー", err);
      });
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
          {(!this.state.pendingInvites || this.state.pendingInvites.length === 0) ? (
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
        <button style={{ marginTop: "10px" }} onClick={() => window.location.href = "/mypage"}>戻る</button>
      </div>
    );
  }
}
