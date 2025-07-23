import React from 'react';
import axios from 'axios';
import './css/Common.css';
import './css/ViewText.css';
import { useParams, Link } from 'react-router-dom';

// useParams をクラスコンポーネントで使うためのラッパー
function ViewTextWrapper() {
    const params = useParams();
    return <ViewTextComponent params={params} />;
}
class ViewTextComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textData: null,
            loading: true,
            error: null,
            titleFieldName: '',
            contentFieldName: '',
        };
    }

    // マウント直後
    componentDidMount() {
        this.fetchTextDetails();
    }

    // 更新後
    componentDidUpdate(prevProps) {
        if (this.props.params.type !== prevProps.params.type ||
            this.props.params.id !== prevProps.params.id) {
            this.fetchTextDetails();
        }
    }

    // テキスト詳細データ取得（非同期）
    fetchTextDetails = async () => {
        // propsからURLパラメータのtypeとidを抽出
        const { type, id } = this.props.params;

        console.log(`ViewTextComponent: Fetching details for Type: ${type}, ID: ${id}`);

        this.setState({
            loading: true,
            error: null,
            textData: null,
            titleFieldName: '',
            contentFieldName: '',
        });

        if (!type || !id) {
            console.error("Type or ID is missing. Cannot fetch text details.");
            this.setState({
                loading: false,
                error: "表示するテキストの種類またはIDが指定されていません。",
            });
            return;
        }

        let apiUrl = '';
        let currentTitleFieldName = '';
        let currentContentFieldName = '';


        // URLパラメータのtypeに基づいて、APIエンドポイントと表示フィールドを決定
        // 仮に登録日をタイトルとしている
        switch (type) {

            // プロジェクト報告書
            case 'project-report':
                apiUrl = `/api/projects/project-reports/${id}`;
                currentTitleFieldName = 'createdAt';
                currentContentFieldName = 'report';
                break;

            // 日報
            case 'report':
                apiUrl = `/api/projects/reports/${id}`;
                currentTitleFieldName = 'createdAt';
                currentContentFieldName = 'comment';
                break;

            // 反省
            case 'reflect':
                apiUrl = `/api/projects/reflects/${id}`;
                currentTitleFieldName = 'createdAt';
                currentContentFieldName = 'comment';
                break;
            default:
                // 未知エラー
                this.setState({
                    error: "不正なテキストタイプです。",
                    loading: false,
                });
                return;
        }

        try {
            // 決定したapiUrlでGETリクエスト
            const res = await axios.get(apiUrl);
            console.log(`API Response - ${type} (ID: ${id}):`, res.data);

            this.setState({
                textData: res.data,
                loading: false,
                titleFieldName: currentTitleFieldName,
                contentFieldName: currentContentFieldName,
            });

        } catch (err) {
            console.error(`テキストの取得に失敗しました (Type: ${type}, ID: ${id}):`, err);
            this.setState({
                error: "テキスト情報の取得中にエラーが発生しました。",
                loading: false,
            });
        }
    };

    render() {
        const { textData, loading, error, titleFieldName, contentFieldName } = this.state;
        const { type, id } = this.props.params;

        if (loading) {
            return <div className="loading">情報を読み込み中...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (!textData) {
            return <div className="not-found">指定された情報が見つかりませんでした。</div>;
        }


        // 取得したtextDataからタイトル（登録日）とコンテンツの取得
        const title = textData[titleFieldName] || textData.title || `タイトルなし`;
        const content = textData[contentFieldName] || textData.content || '内容なし';

        return (
            <div className="view-text-container">
                <h2>{title}</h2>
                <div className="text-content">
                    <p>{content}</p>
                </div>
                <hr />
                <Link to={-1} className='back-link'>戻る</Link>
            </div>
        );
    }
}

export default ViewTextWrapper;