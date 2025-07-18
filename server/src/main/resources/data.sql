INSERT INTO users (email, password, name) VALUES ('yazawa@hisao.com', 'ninnkikoushi', '矢沢　久雄');
INSERT INTO users (email, password, name) VALUES ('ex@exam.com', 'pass1234', '山田 太郎');

INSERT INTO project_tags (project_tag_name) VALUES ('昆虫学');
INSERT INTO project_tags (project_tag_name) VALUES ('植物学');

INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('熱帯雨林におけるハナアブの生態', 1, 1);
INSERT INTO project (project_name, privacy, project_tag_id) VALUES ('バナナの品種改良と疫病', 1, 2);


INSERT INTO members (project_id, user_id, authority, attend) VALUES(1, 1, 3, 1);
INSERT INTO members (project_id, user_id, authority, attend) VALUES(2, 1, 2, 1);


INSERT INTO units (unit) VALUES('個'),('箱'),('kg'),('g'),('mg'),('L'),('ml');