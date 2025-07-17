import React, { useId } from "react";
import './css/Common.css';
import './css/Member.css';
import axios from "axios";

export default class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      isOpen: false,
    };
  }

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSearch = () => {
    const { email } = this.state;

    if (!email) {
      this.setState({ name: 'メールアドレスを入力してください' });
      return;
    }

    axios.get(`http://localhost:8080/getUserNameByEmail?email=${encodeURIComponent(email)}`)
      .then((res) => {
        this.setState({ 
          name: res.data.name,
          userId: res.data.userId
         });
      })
      .catch((err) => {
        console.error("名前の取得に失敗:", err);
        this.setState({ name: "該当するユーザーが見つかりません。" });
      });
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  inviteUser = () =>{
    const { email } = this.state;

    axios.post("http://localhost:8080/members/invite",{
      userId: this.state.userId,
      projectId: 1
    })
    .then(() =>{
      alert("招待を送信しました");
      this.setState({ isOpen: false});
    })
    .catch((err)=>{
      console.error("招待の送信に失敗",err);
      alert("招待に失敗しました。");
    });
  };

  render() {
    return (
      <>
        <h1>プロジェクトメンバー編集</h1>

        <div className="input-wrapper">
          <input
            type="text"
            id="mail"
            name="mail"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="招待したい方のメールアドレスを入力してください"
          />
          <input
            className="sub_botun"
            type="button"
            name="submit"
            value="検索"
            onClick={this.handleSearch}
          />

          <div className="welcome-container">
            <div className="result">
              <p className="user-name-display">一致した名前：{this.state.name}</p>
              <button onClick={this.openModal}>招待メール送信</button>
              {this.state.isOpen && (
                <div className="modal-overlay" >
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>この方をプロジェクトに招待しますか？</h2>
                    <button onClick={this.closeModal}>いいえ</button>
                    <input
                      className="sub_botun"
                      type="button"
                      name="submit"
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
      </>
    );
  }
}
