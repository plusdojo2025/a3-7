import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Report() {
  const { projectId, processId } = useParams(); 

  const [form, setForm] = useState({
    createdAt: "",
    processId: processId || "",
    comment: "",
    equipId: "",
    usageAmount: ""
  });

  const [projectName, setProjectName] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");

 
  useEffect(() => {
    if (projectId) {
      axios.get(`/api/project/${projectId}`)
        .then(res => setProjectName(res.data.projectName))
        .catch(err => {
          console.error("プロジェクト名取得エラー:", err);
          setProjectName("（取得失敗）");
        });
    }
  }, [projectId]);

  // Fetch equipment list
  useEffect(() => {
    axios.get("/api/equip")
      .then(res => setEquipmentList(res.data))
      .catch(err => {
        console.error("備品取得エラー:", err);
        setError("備品リストの取得に失敗しました");
      });
  }, []);

   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      projectId: parseInt(projectId, 10),
      processId: parseInt(form.processId, 10),
      equipId: parseInt(form.equipId, 10),
      usageAmount: parseFloat(form.usageAmount) || 0
    };

    axios.post("/api/report", payload)
      .then(() => {
        alert("登録成功！");
        setForm({
          createdAt: "",
          processId: processId || "",
          comment: "",
          equipId: "",
          usageAmount: ""
        });
        setError("");
      })
      .catch((err) => {
        console.error("登録失敗:", err);
        alert("登録失敗");
      });
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>日報登録</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="processId" value={form.processId} />

        <div>
          日付:
          <input
            type="date"
            name="createdAt"
            value={form.createdAt}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          研修タイトル:
          <input
            type="text"
            value={projectName}
            readOnly
          />
        </div>

        <div style={{ marginTop: 10 }}>
          備品名:
          <select name="equipId" value={form.equipId} onChange={handleChange} required>
            <option value="">選択してください</option>
            {equipmentList.map(equip => (
              <option key={equip.equipId} value={equip.equipId}>
                {equip.equipName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          使用量:
          <input
            type="text"
            name="usageAmount"
            value={form.usageAmount}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          コメント:
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="button" onClick={() => window.history.back()}>
            戻る
          </button>
          <button type="submit" style={{ marginLeft: 10 }}>
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
