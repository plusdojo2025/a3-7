import React from "react";
import './css/Common.css';
import './css/Member.css';
import axios from "axios";
import { AlertContext } from "./AlertContext";

export default class Member extends React.Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.projectId = params.get("projectId"); // ← URLから取得

    this.state = {
      email: '',
      name: '',
      isInviteModalOpen: false,
      isDeleteModalOpen: false,
      userId: null,
      approvedMembers: [],
      pendingMembers: [],
      selectedMemberId: null,
      currentUserId: null,
      currentUserAuthority: null,
      updatedAuthorities: {},
    };
  }

  componentDidMount() {
    axios.get("http://localhost:8080/getCurrentUser", { withCredentials: true })
      .then((res) => {
        const userId = res.data.userId;
        this.setState({ currentUserId: userId });

        //承認済みメンバー取得
        return axios.get(`http://localhost:8080/api/members/approved?projectId=${this.projectId}`, {
          withCredentials: true
        });
      })
      .then((res) => {
        const approvedMembers = res.data;
        const currentMember = approvedMembers.find(m => m.userId === this.state.currentUserId);

        this.setState({
          approvedMembers,
          currentUserAuthority: currentMember?.authority
        });

        //招待中のメンバーの取得
        return axios.get(`http://localhost:8080/api/members/pending?userId=${this.state.currentUserId}`);
      })
      .then((res) => {
        this.setState({ pendingMembers: res.data });
      })
      .catch((err) => {
        console.error("初期データの取得に失敗:", err);
      });
  }

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSearch = () => {
    const email = this.state.email.trim();
    if (!email) {
      this.setState({ name: 'メールアドレスを入力してください' });
      return;
    }

    axios.get(`http://localhost:8080/getUserNameByEmail?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (res.data) {
          const { userId, name } = res.data;

          const isAlreadyApproved = this.state.approvedMembers.some(m => m.userId === userId);
          const isAlreadyInvited = this.state.pendingMembers.some(m => m.userId === userId);

          if (isAlreadyApproved) {
            this.context.showAlert("警告", "このユーザーはすでに参加しています。");
            this.setState({ name: "このユーザーはすでにプロジェクトに参加しています", userId: null });
          } else if (isAlreadyInvited) {
            this.context.showAlert("警告", "このユーザーにはすでに招待メールが送られています。");
            this.setState({ name: "すでに招待メールを送信済みのユーザーです", userId: null });
          } else {
            this.setState({ name, userId });
          }

        } else {
          this.setState({ name: "該当するユーザーが見つかりません。" });
        }
      })
      .catch((err) => {
        console.error("名前の取得に失敗:", err);
        this.setState({ name: "該当するユーザーが見つかりません。" });
      });
  };

  openInviteModal = () => this.setState({ isInviteModalOpen: true });
  closeInviteModal = () => this.setState({ isInviteModalOpen: false });

  openDeleteModal = (memberId) => {
    this.setState({ isDeleteModalOpen: true, selectedMemberId: memberId });
  };

  closeDeleteModal = () => {
    this.setState({ isDeleteModalOpen: false, selectedMemberId: null });
  };

  inviteUser = () => {
    axios.post("http://localhost:8080/api/members/invite", {
      userId: this.state.userId,
      projectId: this.projectId
    })
      .then(() => {
        this.context.showAlert("成功", "招待を送信しました");
        this.setState({ isInviteModalOpen: false });
      })
      .catch((err) => {
        console.error("招待の送信に失敗", err);
        this.context.showAlert("エラー", "招待に失敗しました。");
      });
  };

  handleDeleteMember = () => {
    const { selectedMemberId } = this.state;
    if (!selectedMemberId) return;

    axios.post("http://localhost:8080/api/members/cancel", {
      userId: selectedMemberId,
      projectId: this.projectId
    })
      .then(() => {
        this.context.showAlert("成功", "メンバーの削除に成功しました")
        this.setState((prevState) => ({
          approvedMembers: prevState.approvedMembers.filter(
            (m) => m.userId !== selectedMemberId
          ),
          isDeleteModalOpen: false,
          selectedMemberId: null
        }));
      })
      .catch((err) => {
        console.error("削除に失敗しました:", err);
        this.context.showAlert("失敗", "削除に失敗しました。");
      });
  };

  handleAuthorityChange = (userId, authority) => {
    this.setState((prevState) => ({
      updatedAuthorities: {
        ...prevState.updatedAuthorities,
        [userId]: authority,
      },
    }));
  };

  handleUpdateAuthorities = () => {
    const updates = Object.entries(this.state.updatedAuthorities);
    if (updates.length === 0) {
      this.context.showAlert("変更なし", "変更された権限はありません。");
      return;
    }

    Promise.all(
      updates.map(([userId, authority]) =>
        axios.post("http://localhost:8080/api/members/updateAuthority", {
          userId: Number(userId),
          projectId: this.projectId,
          authority: Number(authority),
        }, { withCredentials: true })
      )
    )
      .then(() => {
        return axios.get(`http://localhost:8080/api/members/approved?projectId=${this.projectId}`, {
          withCredentials: true,
        });
      })
      .then((res) => {
        this.setState({
          approvedMembers: res.data,
          updatedAuthorities: {},
        });
        this.context.showAlert("成功", "権限を更新しました");
      })
      .catch((err) => {
        console.error("権限更新エラー", err);
        this.context.showAlert("失敗", "更新に失敗しました。");
      });
  };

  render() {
    return (
      <>
        <h1>プロジェクトメンバー編集</h1>

        {this.state.currentUserAuthority === 2 && (
          <div>
            <div className="input-wrapper">
              <div className="search_container">
                <input
                  type="text"
                  name="mail"
                  value={this.state.email}
                  onChange={this.handleChange}
                  placeholder="招待したい方のメールアドレスを入力してください"
                />
                <input
                  type="submit"   // ← "button" ではなく "submit" か "input[type='submit']" に合わせる
                  value="検索"       // ← FontAwesomeの検索アイコンコード（任意）
                  onClick={this.handleSearch}
                />
              </div>
            </div>

            <div className="member-container">
              <div className="result">
                <div className="name-and-button">
                  <p className="user-name-display">一致した名前：{this.state.name}</p>
                  {this.state.userId && this.state.name && !this.state.name.includes("すでに") && (
                    <button onClick={this.openInviteModal} className="invite-mail-button">招待メール送信</button>
                  )}

                </div>
                {this.state.isInviteModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <h2>この方をプロジェクトに招待しますか？</h2>
                      <div className="invite-check">
                        <button className="rejectButton" onClick={this.closeInviteModal}>いいえ</button>
                        <button className="sub_botun" onClick={this.inviteUser}>はい</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="underline"></div>
            </div>
          </div>
        )}

        <div className="member-container">
          <table className="design10">
            <thead>
              <tr>
                <th>メンバー名</th>
                <th>閲覧</th>
                <th>編集</th>
                <th>管理</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {this.state.approvedMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.userName || `ユーザーID: ${member.userId}`}</td>
                  {[0, 1, 2].map((auth) => (
                    <td key={auth}>
                      <label className="custom-radio">
                        <input
                          type="radio"
                          name={`authority-${index}`}
                          checked={(this.state.updatedAuthorities[member.userId] ?? member.authority) === auth}
                          onChange={() => this.handleAuthorityChange(member.userId, auth)}
                          disabled={this.state.currentUserAuthority !== 2 || member.authority === 2}
                        />
                        <span className="check"></span>
                      </label>
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => this.openDeleteModal(member.userId)}
                      disabled={this.state.currentUserAuthority !== 2 || member.authority === 2}
                      className="member-delete-button"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {this.state.isDeleteModalOpen && (
            <div className="modal-overlay" onClick={this.closeDeleteModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>このメンバーをプロジェクトから削除してもよろしいですか？</h2>
                <div className="delete-check">
                  <button className="rejectButton" onClick={this.closeDeleteModal}>いいえ</button>
                  <button className="sub_botun" onClick={this.handleDeleteMember}>はい</button>
                </div>
              </div>
            </div>
          )}

          {this.state.currentUserAuthority === 2 && (
            <div style={{ textAlign: "right" }}>
              <button className="update-authority-button" onClick={this.handleUpdateAuthorities}>
                更新
              </button>
            </div>
          )}
        </div>
        <div style={{ marginTop: "20px" }}>
          <button
            className="back-button"
            onClick={() => window.location.href = `/project?id=${this.projectId}`}
          >
            戻る
          </button>
        </div>



      </>
    );
  }
}
