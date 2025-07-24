import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

/**
 * マイページコンポーネント
 * ユーザーのアカウント情報表示と各種機能へのナビゲーションを提供
 */
export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,         // ユーザー情報
      loading: true,      // ローディング状態
      error: null,        // エラーメッセージ
    };
  }

  /**
   * コンポーネントマウント時の初期化処理
   * セッションからユーザー情報を取得
   */
  componentDidMount() {
    console.log("マイページ初期化開始");
    this.loadUserInfo();
  }

  /**
   * ユーザー情報取得処理
   * セッションから現在ログイン中のユーザー情報を取得
   */
  loadUserInfo = async () => {
    try {
      console.log("ユーザー情報取得中...");
      const response = await axios.get("/getLoginUser", { withCredentials: true });
      
      if (response.data) {
        console.log("ユーザー情報取得成功:", response.data.name);
        this.setState({ 
          user: response.data, 
          loading: false,
          error: null 
        });
      } else {
        console.log("ユーザー情報が見つかりません");
        this.setState({
          error: "ユーザー情報が見つかりません。再度ログインしてください。",
          loading: false
        });
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
      this.setState({
        error: "ユーザー情報の取得に失敗しました。ネットワーク接続を確認してください。",
        loading: false
      });
    }
  };

  /**
   * 会社コード表示用フォーマット処理
   * 会社コードが存在しない場合は「未設定」を表示
   */
  formatCompanyCode = (companyCode) => {
    if (companyCode === null || companyCode === undefined || companyCode === '') {
      return '未設定';
    }
    return companyCode.toString();
  };

  /**
   * エラー再試行処理
   * エラー発生時の再読み込み機能
   */
  handleRetry = () => {
    console.log("ユーザー情報再取得実行");
    this.setState({ loading: true, error: null });
    this.loadUserInfo();
  };

  render() {
    const { user, loading, error } = this.state;

    // ローディング表示
    if (loading) {
      return (
        <div className="mypage-container">
          <div className="mypage-loading">
            <p>ユーザー情報を読み込み中...</p>
          </div>
        </div>
      );
    }

    // エラー表示
    if (error) {
      return (
        <div className="mypage-container">
          <div className="mypage-card">
            <div className="mypage-error">
              <h3>エラー</h3>
              <p>{error}</p>
              <button 
                className="mypage-btn" 
                onClick={this.handleRetry}
                style={{ marginTop: '15px' }}
              >
                再試行
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ユーザー情報が存在しない場合
    if (!user) {
      return (
        <div className="mypage-container">
          <div className="mypage-card">
            <div className="mypage-error">
              <h3>ユーザー情報なし</h3>
              <p>ユーザー情報が見つかりません。</p>
              <Link to="/login" className="mypage-btn">
                ログインページへ
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // メイン表示
    return (
      <div className="mypage-container">
        {/* アカウント情報カード */}
        <div className="mypage-card">
          <h2 className="mypage-title">アカウント情報</h2>
          
          <div className="mypage-info-row">
            <span className="mypage-label">氏名：</span>
            <span className="mypage-value">{user.name || '未設定'}</span>
          </div>
          
          <div className="mypage-info-row">
            <span className="mypage-label">会社コード：</span>
            <span className="mypage-value">{this.formatCompanyCode(user.companyCode)}</span>
          </div>
          
          <div className="mypage-info-row">
            <span className="mypage-label">メールアドレス：</span>
            <span className="mypage-value">{user.email || '未設定'}</span>
          </div>
        </div>

        {/* 操作ボタングループ */}
        <div className="mypage-button-group">
          <Link to="/mypage/edit" className="mypage-btn">
            <span>✏️</span>
            <span>編集</span>
          </Link>
          <Link to="/mypage/mail" className="mypage-btn">
            <span>📬</span>
            <span>メールボックス</span>
          </Link>
        </div>

        {/* 追加情報表示（将来拡張用） */}
        <div className="mypage-card" style={{ marginTop: '20px', fontSize: '0.9em', color: '#6c757d' }}>
          <p style={{ margin: 0, textAlign: 'center' }}>
            最終ログイン: {new Date().toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>
    );
  }
}