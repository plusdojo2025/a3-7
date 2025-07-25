import React from "react";
import axios from "axios";
import "./css/MyPageEdit.css";

/**
 * マイページ編集コンポーネント
 * ユーザーのアカウント情報（氏名、パスワード）の編集機能を提供
 */
export default class MyPageEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // フォーム入力値
            lastName: "",
            firstName: "",
            email: "",
            password: "",
            newPassword: "",
            confirmNewPassword: "",
            
            // UI状態
            showPassword: false,
            loading: false,
            updating: false,
            
            // バリデーション
            validation: {
                lastName: null,
                firstName: null,
                password: null,
                newPassword: null,
                confirmNewPassword: null,
            },
            
            // メッセージ
            successMessage: "",
            errorMessage: "",
        };
    }

    /**
     * コンポーネントマウント時の初期化処理
     * セッションからユーザー情報を取得してフォームに設定
     */
    componentDidMount() {
        console.log("マイページ編集画面初期化開始");
        this.loadUserData();
    }

    /**
     * ユーザーデータ読み込み処理
     * セッションから現在のユーザー情報を取得
     */
    loadUserData = async () => {
        this.setState({ loading: true, errorMessage: "" });
        
        try {
            console.log("ユーザー情報取得中...");
            const response = await axios.get("/getLoginUser", { withCredentials: true });
            
            if (response.data) {
                const fullName = response.data.name || "";
                // 氏名を姓と名に分割（複数の空白文字に対応）
                const nameParts = fullName.split(/\s+/);
                const lastName = nameParts[0] || "";
                const firstName = nameParts.slice(1).join(" ") || "";
                
                this.setState({
                    lastName,
                    firstName,
                    email: response.data.email || "",
                    loading: false,
                });
                
                console.log("ユーザー情報取得成功:", response.data.name);
            } else {
                throw new Error("ユーザー情報が見つかりません");
            }
        } catch (error) {
            console.error("ユーザー情報取得エラー:", error);
            this.setState({
                loading: false,
                errorMessage: "ユーザー情報の取得に失敗しました。再度ログインしてください。",
            });
        }
    };

    /**
     * 入力値変更処理
     * フォーム入力値の更新とリアルタイムバリデーション
     */
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            [name]: value,
            validation: {
                ...prevState.validation,
                [name]: this.validateField(name, value, prevState),
            },
            successMessage: "", // 入力変更時にメッセージクリア
            errorMessage: "",
        }));
    };

    /**
     * フィールド別バリデーション処理
     * 各入力フィールドのリアルタイム検証
     */
    validateField = (fieldName, value, currentState = this.state) => {
        switch (fieldName) {
            case 'lastName':
                if (!value.trim()) return { isValid: false, message: "姓は必須です" };
                if (value.trim().length > 20) return { isValid: false, message: "姓は20文字以内で入力してください" };
                return { isValid: true, message: "" };
                
            case 'firstName':
                if (!value.trim()) return { isValid: false, message: "名は必須です" };
                if (value.trim().length > 20) return { isValid: false, message: "名は20文字以内で入力してください" };
                return { isValid: true, message: "" };
                
            case 'password':
                if (currentState.newPassword && !value) {
                    return { isValid: false, message: "現在のパスワードは必須です" };
                }
                return { isValid: true, message: "" };
                
            case 'newPassword':
                if (value && value.length < 8) {
                    return { isValid: false, message: "新しいパスワードは8文字以上で入力してください" };
                }
                if (value && value.length > 50) {
                    return { isValid: false, message: "新しいパスワードは50文字以内で入力してください" };
                }
                return { isValid: true, message: "" };
                
            case 'confirmNewPassword':
                if (currentState.newPassword && value !== currentState.newPassword) {
                    return { isValid: false, message: "新しいパスワードと確認用パスワードが一致しません" };
                }
                return { isValid: true, message: "" };
                
            default:
                return { isValid: true, message: "" };
        }
    };

    /**
     * パスワード表示切り替え処理
     * パスワードフィールドの表示/非表示を切り替え
     */
    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };

    /**
     * フォーム送信前バリデーション処理
     * 全フィールドの検証を実行
     */
    validateForm = () => {
        const { lastName, firstName, password, newPassword, confirmNewPassword } = this.state;
        
        const validationResults = {
            lastName: this.validateField('lastName', lastName),
            firstName: this.validateField('firstName', firstName),
            password: this.validateField('password', password),
            newPassword: this.validateField('newPassword', newPassword),
            confirmNewPassword: this.validateField('confirmNewPassword', confirmNewPassword),
        };

        this.setState({ validation: validationResults });

        // 全フィールドが有効かチェック
        return Object.values(validationResults).every(result => result.isValid);
    };

    /**
     * 更新処理実行
     * サーバーにユーザー情報の更新を送信
     */
    handleUpdate = async (e) => {
        e.preventDefault();
        
        // バリデーション実行
        if (!this.validateForm()) {
            this.setState({ errorMessage: "入力内容を確認してください。" });
            return;
        }

        const { lastName, firstName, password, newPassword } = this.state;

        this.setState({ 
            updating: true, 
            errorMessage: "", 
            successMessage: "" 
        });

        try {
            console.log("ユーザー情報更新開始");
            
            const fullName = `${lastName.trim()} ${firstName.trim()}`;
            const updateData = {
                name: fullName,
                password: password,
                newPassword: newPassword || "", // 空文字の場合はパスワード変更なし
            };

            const response = await axios.post("/mypage/update/", updateData, { 
                withCredentials: true 
            });

            if (response.data === true) {
                console.log("ユーザー情報更新成功");
                
                // フォームリセット
                this.setState({
                    password: "",
                    newPassword: "",
                    confirmNewPassword: "",
                    updating: false,
                    successMessage: "アカウント情報を正常に更新しました。",
                    validation: {
                        lastName: { isValid: true, message: "" },
                        firstName: { isValid: true, message: "" },
                        password: { isValid: true, message: "" },
                        newPassword: { isValid: true, message: "" },
                        confirmNewPassword: { isValid: true, message: "" },
                    },
                });
                
                // 3秒後にメッセージを消去
                setTimeout(() => {
                    this.setState({ successMessage: "" });
                }, 3000);
                
            } else {
                console.log("ユーザー情報更新失敗：パスワードが正しくない");
                this.setState({
                    updating: false,
                    errorMessage: "現在のパスワードが正しくありません。",
                });
            }
        } catch (error) {
            console.error("ユーザー情報更新エラー:", error);
            this.setState({
                updating: false,
                errorMessage: "更新に失敗しました。ネットワーク接続を確認してください。",
            });
        }
    };

    /**
     * バックボタン処理
     * 前のページに戻る
     */
    handleBack = () => {
        console.log("マイページ編集画面から戻る");
        window.history.back();
    };

    /**
     * バリデーションメッセージ表示コンポーネント
     */
    renderValidationMessage = (fieldName) => {
        const validation = this.state.validation[fieldName];
        if (!validation || validation.isValid) return null;

        return (
            <div className="mypage-edit-validation-message">
                {validation.message}
            </div>
        );
    };

    render() {
        const {
            lastName,
            firstName,
            email,
            password,
            newPassword,
            confirmNewPassword,
            showPassword,
            loading,
            updating,
            successMessage,
            errorMessage,
        } = this.state;

        // ローディング表示
        if (loading) {
            return (
                <div className="mypage-edit-container">
                    <div className="mypage-edit-form">
                        <div className="mypage-edit-loading">
                            <p>ユーザー情報を読み込み中...</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="mypage-edit-container">
                <form className="mypage-edit-form" onSubmit={this.handleUpdate}>
                    <h2 className="mypage-edit-title">アカウント情報編集</h2>

                    {/* 成功メッセージ */}
                    {successMessage && (
                        <div className="mypage-edit-success-message">
                            {successMessage}
                        </div>
                    )}

                    {/* エラーメッセージ */}
                    {errorMessage && (
                        <div className="mypage-edit-validation-message">
                            {errorMessage}
                        </div>
                    )}

                    {/* 基本情報セクション */}
                    <div className="mypage-edit-section">
                        <div className="mypage-edit-section-title">👤 基本情報</div>
                        
                        <div className="mypage-edit-form-group">
                            <label className="mypage-edit-label">姓</label>
                            <input
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={this.handleInputChange}
                                className="mypage-edit-input"
                                required
                                maxLength={20}
                            />
                            {this.renderValidationMessage('lastName')}
                        </div>

                        <div className="mypage-edit-form-group">
                            <label className="mypage-edit-label">名</label>
                            <input
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={this.handleInputChange}
                                className="mypage-edit-input"
                                required
                                maxLength={20}
                            />
                            {this.renderValidationMessage('firstName')}
                        </div>

                        <div className="mypage-edit-form-group">
                            <label className="mypage-edit-label">メールアドレス</label>
                            <input
                                type="email"
                                value={email}
                                className="mypage-edit-input mypage-edit-disabled-input"
                                disabled
                                title="メールアドレスは変更できません"
                            />
                        </div>
                    </div>

                    {/* パスワード変更セクション */}
                    <div className="mypage-edit-section">
                        <div className="mypage-edit-section-title">🔒 パスワード変更</div>
                        
                        <div className="mypage-edit-form-group">
                            <label className="mypage-edit-label">現在のパスワード</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                className="mypage-edit-input"
                                placeholder="現在のパスワードを入力"
                            />
                            {this.renderValidationMessage('password')}
                        </div>

                        <div className="mypage-edit-form-group">
                            <label className="mypage-edit-label">新規パスワード</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={newPassword}
                                onChange={this.handleInputChange}
                                className="mypage-edit-input"
                                placeholder="8文字以上で入力"
                                minLength={8}
                                maxLength={50}
                            />
                            {this.renderValidationMessage('newPassword')}
                        </div>

                        <div className="mypage-edit-form-group">
                            <label className="mypage-edit-label">新しいパスワード確認</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={this.handleInputChange}
                                className="mypage-edit-input"
                                placeholder="新規パスワードを再入力"
                                minLength={8}
                                maxLength={50}
                            />
                            {this.renderValidationMessage('confirmNewPassword')}
                        </div>

                        {/* パスワード表示切り替え */}
                        {/* <div className="mypage-edit-password-toggle">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={this.togglePasswordVisibility}
                            />
                            <label htmlFor="showPassword">パスワードを表示</label>
                        </div> */}
                    </div>

                    {/* 操作ボタン */}
                    <div className="mypage-edit-buttons">
                        <button
                            type="button"
                            className="mypage-edit-button mypage-edit-back-button"
                            onClick={this.handleBack}
                            disabled={updating}
                        >
                            戻る
                        </button>
                        
                        <button
                            type="submit"
                            className="mypage-edit-button mypage-edit-update-button"
                            disabled={updating}
                        >
                            {updating ? (
                                <span className="mypage-edit-loading">更新中...</span>
                            ) : (
                                <>更新</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}