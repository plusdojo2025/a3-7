import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/report.css";

export default function Report() {
  const { projectId, processId } = useParams();
  const navigate = useNavigate();
  const equipKindId = 1;

  // 日付とコメントだけ管理
  const [form, setForm] = useState({
    createdAt: "",
    comment: "",
  });

  // 備品使用入力複数管理
  const [equipForms, setEquipForms] = useState([{ equipId: "", usageAmount: "" }]);

  const [projectName, setProjectName] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`/api/project/${projectId}`),
      axios.get(`/api/equip/${projectId}/${equipKindId}/`)
    ])
      .then(([projectNameRes, equipListRes]) => {
        setProjectName(projectNameRes.data.projectName);
        setEquipmentList(equipListRes.data);
      })
      .catch(error => {
        console.error("データ取得エラー:", error);
        setError("データ取得中にエラーが発生しました");
      });
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...equipForms];
    updated[index][name] = value;
    setEquipForms(updated);
  };

  const addEquipField = () => {
    setEquipForms([...equipForms, { equipId: "", usageAmount: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 備品使用データまとめ
    const equipmentUsage = equipForms.map(item => ({
      equipId: parseInt(item.equipId, 10),
      usageAmount: parseFloat(item.usageAmount) || 0
    }));

    const payload = {
      ...form,
      projectId: parseInt(projectId, 10),
      processId: parseInt(processId, 10),
      equipmentUsage
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
      <h2>日報登録 - {projectName}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>日付：
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
          <label>コメント：
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
            />
          </label>
        </div>

        <h3>使用した備品</h3>
        {equipForms.map((equip, index) => (
          <div key={index} className="equip-row">
            <select
              name="equipId"
              value={equip.equipId}
              onChange={(e) => handleEquipChange(index, e)}
              required
            >
              <option value="">選択してください</option>
              {equipmentList.map(item => (
                <option key={item.equipId} value={item.equipId}>
                  {item.equipName}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="usageAmount"
              value={equip.usageAmount}
              onChange={(e) => handleEquipChange(index, e)}
              placeholder="使用量"
            />
          </div>
        ))}

        <button type="button" onClick={addEquipField}>
          備品を追加
        </button>

        <div>
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
}

