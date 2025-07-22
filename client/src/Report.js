import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Report() {
  const [form, setForm] = useState({
    createdAt: "",
    processId: "",
    projectId: "",
    comment: "",
    equipId: "",
    usageAmount: ""
  });

  const [projectName, setProjectName] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");

  // Fetch equipment list once on mount
  useEffect(() => {
    axios.get("/api/equip")
      .then(res => setEquipmentList(res.data))
      .catch(err => {
        console.error("備品取得エラー:", err);
        setError("備品リストの取得に失敗しました");
      });
  }, []);

  
  useEffect(() => {
    if (!form.projectId) {
      setProjectName("");
      return;
    }

    axios.get(`/api/project/${form.projectId}`)
      .then(res => setProjectName(res.data.projectName))
      .catch(() => setProjectName("（取得失敗）"));
  }, [form.projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
   const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("/api/report", form)
      .then(() => {
        alert("登録成功！");
        setForm({
          createdAt: "",
          processId: "",
          projectId: "",
          comment: "",
          equipId: "",
          usageAmount: ""
        });
        setProjectName("");
        setError("");
      })
      .catch(() => {
        alert("登録失敗");
      });
  };

  return (
    <div className="report-register">
      <h2 className="title">日報登録</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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

        <div>
          研修タイトル:
        <input
    type="text"
    name="projectName"
    value={projectName || ''}
    
  />
          
            
        
        </div>

        <div>
          備品名:
          <select
            name="equipId"
            value={form.equipId}
            onChange={handleChange}
          >
            <option value="">選択してください</option>
            {equipmentList.map(equip => (
              <option key={equip.equipId} value={equip.equipId}>
                {equip.equipName}
              </option>
            ))}
          </select>
        </div>

        <div>
          使用量:
          <input
            type="text"
            name="usageAmount"
            value={form.usageAmount}
            onChange={handleChange}
          />
        </div>

        <div>
          コメント:
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        <div>
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
