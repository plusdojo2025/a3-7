import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/report.css";

export default function Report() {
  const { projectId, processId } = useParams();
  const navigate = useNavigate();

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
        .catch(() => setProjectName("（取得失敗）"));
    }
  }, [projectId]);

  useEffect(() => {
    axios.get("/api/equip")
      .then(res => setEquipmentList(res.data))
      .catch(() => setError("備品リストの取得に失敗しました"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        navigate(`/project/${projectId}/process/${processId}`); 
      })
      .catch(() => alert("登録失敗"));
  };

  return (
    <div>
      <h2>日報登録</h2>

   

      <div className="report-container">
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
      

          <div className="form-group">
            <label>日付:
              <input
                type="date"
                name="createdAt"
                value={form.createdAt}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>研修タイトル:
              <input type="text" value={projectName} readOnly />
            </label>
          </div>

          <div className="form-group">
            <label>備品名:
              <select name="equipId" value={form.equipId} onChange={handleChange} required>
                <option value="">選択してください</option>
                {equipmentList.map(equip => (
                  <option key={equip.equipId} value={equip.equipId}>
                    {equip.equipName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>使用量:
              <input
                type="text"
                name="usageAmount"
                value={form.usageAmount}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>コメント:
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="button-group">
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              戻る
            </button>
            <button type="submit" className="submit-button">
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
