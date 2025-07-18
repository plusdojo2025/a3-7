import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ReportEdit({ reportId }) {
  const [form, setForm] = useState({
    createdAt: "",
    projectId: "",
    equipId: "",
    comment: ""
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // 備品リスト取得
    axios.get("/api/report/equip")
      .then(res => setEquipmentList(res.data))
      .catch(() => setError("備品リストの取得に失敗しました"));

    // レポートデータ取得
    if (reportId) {
      axios.get(`/api/report/${reportId}`)
        .then(res => setForm(res.data))
        .catch(() => setError("レポートの取得に失敗しました"));
    }
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/report/${reportId}`, form)
      .then(() => alert("更新成功！"))
      .catch(() => alert("更新失敗"));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>日付（変更不可）</label><br />
        <input
          type="date"
          name="createdAt"
          value={form.createdAt}
          readOnly
        />
      </div>

      <div>
        <label>プロジェクトID</label><br />
        <input
          type="text"
          name="projectId"
          value={form.projectId || ""}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>備品</label><br />
        <select
          name="equipId"
          value={form.equipId || ""}
          onChange={handleChange}
          required
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
        <label>コメント</label><br />
        <textarea
          name="comment"
          value={form.comment || ""}
          onChange={handleChange}
        />
      </div>

      <button type="submit">更新</button>
    </form>
  );
}
