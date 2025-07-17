import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ReportEdit() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [form, setForm] = useState({
    createdAt: "",
    processId: "",
    projectId: "",
    comment: "",
    projectName: "",
    equipId: "",
    usageAmount: ""
  });

  useEffect(() => {
    // Fetch equipment list
    axios
      .get("/api/equipment")
      .then((res) => setEquipmentList(res.data))
      .catch((err) => console.error("Failed to fetch equipment", err));

    // Fetch existing report data
    axios
      .get(`/api/report/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Failed to fetch report", err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`/api/report/${id}`, form)
      .then(() => {
        alert("更新成功！");
        navigate("/report/list"); // Or wherever you go after editing
      })
      .catch((err) => {
        console.error("更新失敗", err);
        alert("更新失敗");
      });
  };

  return (
    <div className="report-edit">
      <h2 className="title">日報編集</h2>
      <form onSubmit={handleUpdate}>
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
            value={form.projectName}
            onChange={handleChange}
          />
        </div>

        <div>
          備品名:
          <select name="equipId" value={form.equipId} onChange={handleChange}>
            <option value="">選択してください</option>
            {equipmentList.map((equip) => (
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
          <button type="button" onClick={() => navigate(-1)}>
            戻る
          </button>
          <button type="submit" style={{ marginLeft: 10 }}>
            更新
          </button>
        </div>
      </form>
    </div>
  );
}