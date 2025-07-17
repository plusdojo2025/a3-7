import React from "react";
import './css/Common.css';
import './css/Member.css';
import { Link } from "react-router-dom";
import axios from "axios";

export default class Member extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
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

    axios.get(`http://localhost:8080/api/user?email=${encodeURIComponent(email)}`)
      .then((res) => {
        this.setState({ name: res.data.name });
      })
      .catch((err) => {
        console.error("名前の取得に失敗:", err);
        this.setState({ name: "該当するユーザーが見つかりません。" });
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

          {this.state.name && (
            <>
              <div className="result">
                <p className="user-name-display">名前：{this.state.name}</p>
              </div>
              <div className="underline"></div>
            </>
          )}
        </div>
      </>
    );
  }
}