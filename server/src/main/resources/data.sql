--ユーザーリスト
INSERT INTO users (email, password, name) VALUES ('yazawa@hisao.com', 'ninnkikoushi', '矢沢　久雄');
INSERT INTO users (email, password, name) VALUES ('ex@exam.com', 'pass1234', '山田 太郎');

--タグリスト
INSERT INTO project_tags (project_tag_name) VALUES ('昆虫学');
INSERT INTO project_tags (project_tag_name) VALUES ('植物学');

--プロジェクトリスト
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('熱帯雨林におけるハナアブの生態', 1, 1);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('バナナの品種改良と疫病', 1, 2);

--プロセスリスト
INSERT INTO processes (process_name, project_id, complete) VALUES ('ウイルスAを用いた実験', 2, 1);
INSERT INTO processes (process_name, project_id, complete) VALUES ('ウイルスBを用いた実験', 2, 0);

--メンバーリスト
INSERT INTO members (project_id, user_id, authority, attend) VALUES(1, 1, 3, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(2, 2, 2, 1);

--備品種類
INSERT INTO equip_kinds (equip_kind_name) VALUES ('道具');

--備品
INSERT INTO equipments (equip_name, equip_kind_id, equip_detail_id, project_id) VALUE ('虫あみ', 1, 1, 1);

--備品詳細
INSERT INTO equip_details (remaining, limited, judge, storage, remarks, unit, picture) VALUE (100.0, '2025-04-28', 10.0, '倉庫', '所々穴が開いている。', 1, null);

--単位
INSERT INTO units (unit) VALUES ('本'),('個'),('箱'),('kg'),('g'),('mg'),('L'),('ml');

--工程
INSERT INTO processes (project_id, process_name, complete) VALUES (1, '調査地選定と許可申請', 1); 
INSERT INTO processes (project_id, process_name, complete) VALUES (1, 'ハナアブ捕獲と識別', 0);

--報告書
INSERT INTO project_reports (project_id, created_at, report) VALUES (1, '2024-03-25', '初期調査進捗報告：調査地選定が順調に進み、主要な候補地を絞り込みました。');
--プロジェクトに対する報告書は常に一つ(プロジェクト終了時のみ)
--INSERT INTO project_reports (project_id, created_at, report) VALUES (1, '2024-05-15', '中間報告：これまでに約50種のハナアブを捕獲。未識別の種も複数確認。');

--日報
INSERT INTO reports (process_id, project_id, created_at, comment) VALUE (1, 1, '2024-03-25', '明日からがんばる！');

--反省
INSERT INTO reflects (process_id, project_id, created_at, reflect_tag_id, comment) VALUE (1, 1, '2024-03-25', 1, '寝坊した。');

--反省タグ
INSERT INTO reflect_tags (reflect_name) VALUE ('災害');

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