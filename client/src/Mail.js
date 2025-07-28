import React from "react";
import axios from "axios";
import "./css/Mail.css";

export default class Mail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pendingInvites: [], // { memberId, projectId, inviterName, inviterEmail, projectName … }
      userId: null,
    };
  }

  componentDidMount() {
    // セッションからログインユーザーを取得
    axios.get("http://localhost:8080/getCurrentUser", { withCredentials: true })
      .then(res => {
        if (res.data) {
          console.log("ログインユーザー:", res.data);
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
        console.log("招待取得成功:", res.data);
        console.log("招待データの詳細:", JSON.stringify(res.data, null, 2));

        // 各招待について招待者の情報を取得
        const invitesWithInviterInfo = res.data.map(async (invite) => {
          console.log("処理中の招待:", invite);
          
          try {
            // 複数のAPIパターンを試す
            let inviterInfo = { name: "不明", email: "不明" };
            let projectName = `プロジェクトID: ${invite.projectId}`;

            // パターン1: プロジェクト詳細APIを試す
            try {
              console.log(`プロジェクト情報取得試行: /api/projects/${invite.projectId}`);
              const projectRes = await axios.get(
                `http://localhost:8080/api/projects/${invite.projectId}`,
                { withCredentials: true }
              );
              console.log("プロジェクト情報取得成功:", projectRes.data);
              
              if (projectRes.data) {
                projectName = projectRes.data.projectName || projectRes.data.name || projectName;
                
                // オーナー情報が含まれている場合
                if (projectRes.data.ownerEmail) {
                  console.log("メール発見:", projectRes.data.ownerEmail);
                  try {
                    const userRes = await axios.get(
                      `http://localhost:8080/getUserNameByEmail?email=${encodeURIComponent(projectRes.data.ownerEmail)}`
                    );
                    console.log("ユーザー名取得成功:", userRes.data);
                    if (userRes.data) {
                      inviterInfo = {
                        name: userRes.data.name,
                        email: projectRes.data.ownerEmail
                      };
                    }
                  } catch (userError) {
                    console.error("ユーザー名取得エラー:", userError);
                  }
                }
                
                if (projectRes.data.ownerName) {
                  inviterInfo.name = projectRes.data.ownerName;
                }
              }
            } catch (projectError) {
              console.error("プロジェクト情報取得エラー:", projectError);
            }

            if (invite.inviterId && inviterInfo.name === "不明") {
              try {
                console.log(`招待者ID使用: ${invite.inviterId}`);
                const inviterRes = await axios.get(
                  `http://localhost:8080/api/users/${invite.inviterId}`,
                  { withCredentials: true }
                );
                if (inviterRes.data) {
                  inviterInfo = {
                    name: inviterRes.data.name || inviterRes.data.userName,
                    email: inviterRes.data.email
                  };
                }
              } catch (inviterError) {
                console.error("招待者情報取得エラー:", inviterError);
              }
            }

            if (inviterInfo.name === "不明") {
              try {
                console.log("承認済みメンバーから招待者を推測");
                const membersRes = await axios.get(
                  `http://localhost:8080/api/members/approved?projectId=${invite.projectId}`,
                  { withCredentials: true }
                );
                
                if (membersRes.data && membersRes.data.length > 0) {
                  const admin = membersRes.data.find(m => m.authority === 2);
                  if (admin) {
                    inviterInfo = {
                      name: admin.userName || admin.name || "管理者",
                      email: admin.email || "不明"
                    };
                  }
                }
              } catch (membersError) {
                console.error("メンバー情報取得エラー:", membersError);
              }
            }

            const result = {
              ...invite,
              inviterName: inviterInfo.name,
              inviterEmail: inviterInfo.email,
              projectName: projectName
            };
            
            console.log("最終結果:", result);
            return result;
            
          } catch (error) {
            console.error("招待者情報取得エラー:", error);
            return {
              ...invite,
              inviterName: "不明",
              inviterEmail: "不明",
              projectName: `プロジェクトID: ${invite.projectId}`
            };
          }
        });

        // すべての招待者情報を並行取得
        Promise.all(invitesWithInviterInfo)
          .then(updatedInvites => {
            console.log("最終的な招待リスト:", updatedInvites);
            this.setState({ pendingInvites: updatedInvites });
          })
          .catch(error => {
            console.error("招待者情報の取得に失敗:", error);
            this.setState({ pendingInvites: res.data });
          });
      })
      .catch(error => {
        console.error("ユーザーまたは招待情報取得失敗:", error);
      });
  }

  handleApprove = (member) => {
    console.log("承認対象メンバー情報:", member);
    console.log("ログインユーザーID:", this.state.userId);

    axios.post("http://localhost:8080/api/members/approve", {
      userId: this.state.userId,
      projectId: member.projectId
    }, { withCredentials: true })
      .then(res => {
        console.log("承認成功:", res.data);
        this.setState(prev => ({
          pendingInvites: prev.pendingInvites.filter(m => m.memberId !== member.memberId)
        }));
      })
      .catch(err => {
        console.error("承認エラー", err);
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
      <div className="mail-page-container">
        <div className="mail-header">
          <h2 className="mail-page-title">メールボックス</h2>
        </div>
        
        <div className="mail-content">
          <div className="mail-list-container">
            {(!this.state.pendingInvites || this.state.pendingInvites.length === 0) ? (
              <div className="no-invites-message">
                <div className="no-invites-icon">📭</div>
                <p>現在、承認待ちの招待はありません。</p>
              </div>
            ) : (
              <div className="invites-list">
                {this.state.pendingInvites.map(invite => (
                  <div key={invite.memberId} className="invite-card">
                    <div className="invite-card-header">
                      <div className="invite-icon">📧</div>
                      <div className="invite-title">プロジェクト招待</div>
                    </div>
                    
                    <div className="invite-card-body">
                      <div className="invite-detail-row">
                        <span className="detail-label">招待者：</span>
                        <span className="detail-value">{invite.inviterName || "不明"}</span>
                      </div>
                      <div className="invite-detail-row">
                        <span className="detail-label">プロジェクト：</span>
                        <span className="detail-value detail-project">{invite.projectName || `プロジェクトID: ${invite.projectId}`}</span>
                      </div>
                      <div className="invite-message">
                        あなたをプロジェクトメンバーに招待しています
                      </div>
                    </div>
                    
                    <div className="invite-card-actions">
                      <button 
                        className="mail-action-btn mail-reject-btn" 
                        onClick={() => this.handleCancel(invite)}
                      >
                        拒否
                      </button>
                      <button 
                        className="mail-action-btn mail-approve-btn" 
                        onClick={() => this.handleApprove(invite)}
                      >
                        ✓ 承認
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mail-footer">
          <button 
            className="mail-back-btn" 
            onClick={() => window.location.href = "/mypage"}
          >
            戻る
          </button>
        </div>
      </div>
    );
  }
}