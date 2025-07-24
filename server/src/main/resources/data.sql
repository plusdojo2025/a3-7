--写真おっきく
ALTER TABLE equip_details MODIFY COLUMN picture LONGBLOB;

--ユーザーリスト
INSERT INTO users (email, password, name) VALUES ('yazawa@hisao.com', 'ninnkikoushi', '矢沢　久雄');
INSERT INTO users (email, password, name) VALUES ('ex@exam.com', 'pass1234', '山田 太郎');

--タグリスト
INSERT INTO project_tags (project_tag_name) VALUES ('昆虫学');
INSERT INTO project_tags (project_tag_name) VALUES ('植物学');
INSERT INTO project_tags (project_tag_name) VALUES ('動物生命科学');
INSERT INTO project_tags (project_tag_name) VALUES ('実験動物学');
INSERT INTO project_tags (project_tag_name) VALUES ('分子生物学');
INSERT INTO project_tags (project_tag_name) VALUES ('構造生物化学');
INSERT INTO project_tags (project_tag_name) VALUES ('機能生物化学');
INSERT INTO project_tags (project_tag_name) VALUES ('生物物理学');
INSERT INTO project_tags (project_tag_name) VALUES ('ゲノム生物学');
INSERT INTO project_tags (project_tag_name) VALUES ('システムゲノム科学');
INSERT INTO project_tags (project_tag_name) VALUES ('細胞生物学');
INSERT INTO project_tags (project_tag_name) VALUES ('発生生物学');
INSERT INTO project_tags (project_tag_name) VALUES ('植物分子学');

--プロジェクトリスト
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('熱帯雨林におけるハナアブの生態', 1, 1);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('バナナの品種改良と疫病', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('個体老化における細胞応答メカニズムの解析', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('ゲノム編集による植物耐乾燥性の向上', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('疾患モデルマウスを用いた中枢神経の構造解析', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('タンパク質フォールディング異常と疾患発症の相関研究', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('幹細胞分化におけるエピゲノム制御因子の機能解析', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('光合成効率を高める葉緑体遺伝子の機能解析', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('遺伝子発現プロファイルによるがん予後予測モデルの構築', 0, 2);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('神経伝達物質の動態に関するマルチスケール解析', 0, 2);

--メンバーリスト
INSERT INTO members (project_id, user_id, authority, attend) VALUES(1, 1, 3, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(2, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(3, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(4, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(5, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(6, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(7, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(8, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(9, 2, 2, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(10, 2, 2, 1);
--備品種類
INSERT INTO equip_kinds (equip_kind_name) VALUES ('道具');
INSERT INTO equip_kinds (equip_kind_name) VALUES ('昆虫');
INSERT INTO equip_kinds (equip_kind_name) VALUES ('果物');


--備品
INSERT INTO equipments (equip_name, equip_kind_id, equip_detail_id, project_id) VALUE ('虫あみ', 1, 1, 1);
INSERT INTO equipments (equip_name, equip_kind_id, equip_detail_id, project_id) VALUE ('バナナ', 3, 2, 2);

--生体

--生体詳細
INSERT INTO biology_details (kind, gender, age, process_id, remarks, picture) VALUE (2, 1, 23, 2, '片翼', null);

--備品詳細
INSERT INTO equip_details (remaining, limited, judge, storage, remarks, unit, picture) VALUE (100.0, '2025-04-28', 10.0, '倉庫', '所々穴が開いている。', 1, null);
INSERT INTO equip_details (remaining, limited, judge, storage, remarks, unit, picture) VALUE (100.0, '2025-07-25', 10.0, 'キッチン', '特売', 2, null);

--単位
INSERT INTO units (unit) VALUES ('本'),('個'),('箱'),('kg'),('g'),('mg'),('L'),('ml');

--工程
INSERT INTO processes (process_name, project_id, complete) VALUES ('調査地選定と許可申請', 1, 1); 
INSERT INTO processes (process_name, project_id, complete) VALUES ('ハナアブ捕獲と識別', 1, 0);
INSERT INTO processes (process_name, project_id, complete) VALUES ('ウイルスAを用いた実験', 2, 1);
INSERT INTO processes (process_name, project_id, complete) VALUES ('ウイルスBを用いた実験', 2, 0);

--日報
INSERT INTO reports (process_id, project_id, created_at, comment) VALUE (1, 1, '2024-03-25', 'つかれた。');

--反省
INSERT INTO reflects (process_id, project_id, created_at, reflect_tag_id, comment) VALUE (1, 1, '2024-03-25', 1, '寝坊した。');
INSERT INTO reflects (process_id, project_id, created_at, reflect_tag_id, comment) VALUE (1, 2, '2024-03-25', 1, '寝坊した。');
INSERT INTO reflects (process_id, project_id, created_at, reflect_tag_id, comment) VALUE (1, 2, '2024-03-26', 2, 'よくわからなかった。');
INSERT INTO reflects (process_id, project_id, created_at, reflect_tag_id, comment) VALUE (1, 2, '2024-03-27', 1, '寝坊した。');
--反省タグ
INSERT INTO reflect_tags (reflect_name) VALUE ('災害');
INSERT INTO reflect_tags (reflect_name) VALUE ('報連相');
INSERT INTO reflect_tags (reflect_name) VALUE ('ケアレスミス');
INSERT INTO reflect_tags (reflect_name) VALUE ('確認漏れ');
INSERT INTO reflect_tags (reflect_name) VALUE ('ヒヤリハット');
INSERT INTO reflect_tags (reflect_name) VALUE ('準備不足');
INSERT INTO reflect_tags (reflect_name) VALUE ('思い込み');

/*
INSERT INTO equipments (
  equip_name,
  equip_kind_id,
  equip_detail_id,
  project_id
) VALUES (
  101,
  'ノートパソコン',
  1,
  10,
  5
);
INSERT INTO reports (equip_id, project_id, process_id, created_at, comment)
VALUES (1, 2, 3, '2025-07-18', 'Sample comment here');
*/

--報告書
--プロジェクトに対する報告書は常に一つ(プロジェクト終了時作成)
--INSERT INTO project_reports (project_id, created_at, report) VALUES (1, '2024-05-15', '中間報告：これまでに約50種のハナアブを捕獲。未識別の種も複数確認。');

--ばかでか報告書
INSERT INTO project_reports (project_id, created_at, report) VALUES (1, '2024-03-25', '調査地選定の進捗と候補地の絞り込み
本日は、熱帯雨林におけるハナアブの生態調査プロジェクトにおいて、最も重要な初期段階である調査地の選定作業に集中的に取り組みました。これまでの文献調査や過去の気象データ、植生情報、現地の地理情報システム（GIS）データを総合的に分析し、主要な候補地をいくつか絞り込むことができました。

まず、ハナアブの多様性が高く、かつ熱帯雨林特有の環境が良好に保たれている地域を優先しました。具体的には、〇〇国アマゾン熱帯雨林地域内の国立公園や保護区が中心となります。これらの地域は、人間の活動による攪乱が比較的少なく、原始的な生態系が維持されている可能性が高いと判断しました。ハナアブは多種多様な植物と相互作用し、特に花の蜜や花粉を主要な食料源とする種が多いため、豊かな植物相が維持されている場所が必須条件となります。また、腐生植物や枯死木に依存するハナアブ種もいるため、そうした環境要因も考慮しました。

次に、現地へのアクセス性も重要な選定基準としました。広大な熱帯雨林において、調査拠点の設置や機材の運搬、そして定期的な巡回調査を効率的に行うためには、幹線道路からのアクセスが比較的容易であるか、あるいは河川を利用したアクセスが可能であるかを検討しました。過度な開発が進んでいない場所である一方で、最低限のインフラ（簡易な宿泊施設や電力供給の可能性など）が確保できる地点が理想的です。安全性も考慮し、現地の政府機関やNGOとの連携がスムーズに行える地域を優先的にリストアップしました。過去に生物多様性調査が行われた実績のある地域は、既存のデータが活用できるため、特に有望な候補として位置付けました。

これらの条件を総合的に考慮した結果、現時点での主要な候補地として以下の3つのエリアを特定しました。

Aエリア：〇〇国立公園深部

特徴: 広範囲にわたり手つかずの原生林が広がり、極めて高い生物多様性が期待されます。特に、多様な着生植物やツル植物、そして高木層が発達しており、様々なニッチ（生態的地位）を持つハナアブ種の生息が予想されます。過去の調査で、未記載種を含む昆虫が多数報告されている実績もあります。

課題: アクセスが極めて困難であり、調査拠点設営には多大な労力と費用がかかります。また、現地の天候変動が激しいため、悪天候時の活動制約が懸念されます。マラリアなどの感染症リスクも他の地域より高いため、医療体制の確保も検討課題です。

Bエリア：〇〇川流域保護区周辺

特徴: 〇〇川という大きな河川に隣接しており、河川を利用したアクセスが比較的容易です。河畔林と内陸部の熱帯林の両方の環境を持つため、より多様なハナアブ群集が見られる可能性があります。地元の先住民コミュニティとの連携が比較的取りやすく、現地の知識や協力を得やすい利点もあります。比較的最近、周辺地域でハナアブ科の新種が発見されたという未確認情報もあり、期待が持てます。

課題: 季節によっては河川の水位変動が大きく、調査計画に影響を与える可能性があります。また、周辺での小規模な違法伐採の報告もあり、環境変化のモニタリングが不可欠です。

Cエリア：〇〇生物多様性研究拠点隣接林

特徴: 既存の生物多様性研究拠点に隣接しているため、研究施設や基本的なインフラを利用できる点が最大のメリットです。これにより、試料の保管や顕微鏡観察、データ入力といった作業を現地で効率的に進めることが可能になります。過去の広範な植生データや気象データが蓄積されており、比較分析に有利です。

課題: 長年にわたる研究活動により、周辺のハナアブ相が既に詳細に調査されている可能性があり、新たな発見の機会が限られるかもしれません。また、研究拠点の周辺では人為的な影響が完全に排除されているとは言えず、純粋な原生林の生態系を反映しない可能性もあります。

これらの候補地について、来週はそれぞれの詳細な地図情報、衛星画像、既存の生物分布データ（もしあれば）をさらに突き合わせ、具体的な調査区画の設定のシミュレーションを行います。特に、ハナアブの活動パターン（日周活動、季節変動）を考慮したトラップ設置計画や採集ルートの策定に役立つ情報を収集する予定です。

また、各候補地の現地協力者との初期コンタクトも重要な課題です。現地のガイドや研究者、コミュニティリーダーとの良好な関係構築は、調査の成功に不可欠です。文化的な配慮を怠らず、相互理解を深める努力を継続していきます。

最終的な調査地の決定には、これらの詳細な情報に加え、予備的な現地視察の可能性も視野に入れる必要があります。特に、各エリアのハナアブの生息密度や多様性を事前に把握するため、限定的なプレ調査（パイロットスタディ）の実施も検討すべきです。これにより、限られたリソースを最も効果的に活用できる調査地を確定し、本調査の成功確率を高めることができます。

今後のステップとしては、各候補地についての詳細なリスク評価（治安、感染症、自然災害など）と、それに伴う対策の策定も並行して進めます。特に熱帯雨林での長期滞在を伴う調査では、健康管理や緊急時の対応計画が非常に重要となります。プロジェクトメンバー間の役割分担も明確にし、効率的かつ安全な調査体制を確立していきます。

今回の調査地選定作業を通じて、プロジェクトの方向性が明確になり、具体的な計画の立案に大きく寄与しました。来週以降も、この進捗を維持し、次なる段階へと移行できるよう努めます。');