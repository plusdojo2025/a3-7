import React from "react";
import './css/Common.css';
import './css/Member.css';
import axios from "axios";

export default class Member extends React.Component {
  constructor(props) {
    super(props);
    //ここを意図するプロジェクトに飛ぶように変える
    const params = new URLSearchParams(window.location.search);
  this.projectId = params.get("projectId"); // ← URLから取得

  this.state = {
    email: '',
    name: '',
    isInviteModalOpen: false,
    isDeleteModalOpen: false,
    userId: null,
    approvedMembers: [],
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

        return axios.get(`http://localhost:8080/api/members/approved?projectId=${this.projectId}`, {
          withCredentials: true
        });
      })
      .then((res) => {
        const approvedMembers = res.data;
        const currentMember = approvedMembers.find(m => m.userId === this.state.currentUserId);

        this.setState({
          approvedMembers,
          currentUserAuthority: currentMember ? currentMember.authority : null,
        });
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
          this.setState({
            name: res.data.name,
            userId: res.data.userId,
          });
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
        alert("招待を送信しました");
        this.setState({ isInviteModalOpen: false });
      })
      .catch((err) => {
        console.error("招待の送信に失敗", err);
        alert("招待に失敗しました。");
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
        alert("メンバーを削除しました");
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
        alert("削除に失敗しました。");
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
      alert("変更された権限はありません。");
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
        alert("権限を更新しました");
      })
      .catch((err) => {
        console.error("権限更新エラー", err);
        alert("更新に失敗しました。");
      });
  };

  render() {
    return (
      <>
        <h1>プロジェクトメンバー編集</h1>

        {this.state.currentUserAuthority === 3 && (
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
                <p className="user-name-display">一致した名前：{this.state.name}</p>
                {this.state.userId && this.state.name && this.state.name !== "該当するユーザーが見つかりません。" && (
                  <button onClick={this.openInviteModal}>招待メール送信</button>
                )}
                {this.state.isInviteModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <h2>この方をプロジェクトに招待しますか？</h2>
                      <button onClick={this.closeInviteModal}>いいえ</button>
                      <input
                        className="sub_botun"
                        type="button"
                        value="はい"
                        onClick={this.inviteUser}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="underline"></div>
            </div>
          </div>
        )}

        <div className="member-container">
          <table>
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
                  {[1, 2, 3].map((auth) => (
                    <td key={auth}>
                      <label>
                        <input
                          type="radio"
                          name={`authority-${index}`}
                          checked={(this.state.updatedAuthorities[member.userId] ?? member.authority) === auth}
                          onChange={() => this.handleAuthorityChange(member.userId, auth)}
                          disabled={this.state.currentUserAuthority !== 3}
                        />
                      </label>
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => this.openDeleteModal(member.userId)}
                      disabled={this.state.currentUserAuthority !== 3}
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
                <button onClick={this.closeDeleteModal}>いいえ</button>
                <input
                  className="sub_botun"
                  type="button"
                  value="はい"
                  onClick={this.handleDeleteMember}
                />
              </div>
            </div>
          )}

          {this.state.currentUserAuthority === 3 && (
            <button className="sub_botun" onClick={this.handleUpdateAuthorities}>
              更新
            </button>
          )}
        </div>
        <div style={{ marginTop: "20px" }}>
          <button
            className="sub_botun"
            onClick={() => window.location.href = `/project?id=${this.projectId}`}
          >
            戻る
          </button>
        </div>
      </>
    );
  }
}
