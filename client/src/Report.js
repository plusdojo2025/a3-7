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
  const [processName, setProcessName] = useState("");
  const [error, setError] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [units, setUnits] = useState([]);
  const [equipDetails, setEquipDetails] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/project/${projectId}`),
      axios.get(`/api/equip/${projectId}/${equipKindId}/`),
      axios.get(`/api/process/${processId}/`),
      axios.get("/api/equipment/edit/get/units"),
      axios.get("/api/equipment/edit/get/allDetails")
    ])
      .then(([projectNameRes, equipListRes, processNameRes, unitsRes, detailsRes]) => {
        setProjectName(projectNameRes.data.projectName);
        setEquipmentList(equipListRes.data);
        setProcessName(processNameRes.data.processName);
        setUnits(unitsRes.data);
        setEquipDetails(detailsRes.data);
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

  const handleEquipRemove = (index) => {
  const updated = [...equipForms];
  updated.splice(index, 1);
  setEquipForms(updated);
  };

  const getUnitLabel = (equipId) => {
    const equip = equipmentList.find(e => e.equipId === parseInt(equipId));
    if (!equip) return "";

    const detail = equipDetails.find(d => d.equipDetailId === equip.equipDetailId);
    if (!detail) return "";

    const unit = units.find(u => u.unitId === detail.unit);
    return unit ? unit.unit : "";
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // まず日報を送信
      const payload = {
        ...form,
        projectId: parseInt(projectId, 10),
        processId: parseInt(processId, 10),
        // 備品使用は別で処理するためここには含めない
      };

      await axios.post("/api/report", payload);
      alert("日報登録成功！");

      // 続けて備品残量更新を1つずつ送る
      for (const equip of equipForms) {
        const equipId = parseInt(equip.equipId, 10);
        const usageAmount = parseFloat(equip.usageAmount);

        if (!equipId || !usageAmount) continue;

        // equipIdからequipDetailIdを探す
        const equipment = equipmentList.find(e => e.equipId === equipId);
        if (!equipment) continue;

        const equipDetailId = equipment.equipDetailId;
        if (!equipDetailId) continue;

        // 残量更新APIにリクエスト送信
        await axios.post(`/api/equipment/edit/${equipDetailId}/${usageAmount}`);
      }

      navigate(`/process?id=${processId}`);

    } catch (error) {
      alert("登録か更新に失敗しました");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>日報登録 : {projectName} - {processName}</h2>
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
        {equipForms.map((equip, index) => {
          const unitLabel = getUnitLabel(equip.equipId); // 単位を取得

          return ( //map処理に対するreturnとなっている
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

              <div className="input-with-unit">
                <input
                  type="text"
                  name="usageAmount"
                  value={equip.usageAmount}
                  onChange={(e) => handleEquipChange(index, e)}
                  placeholder="使用量"
                />

                {/* 単位ラベルの表示 */}
                <span className="unit-label">{unitLabel}</span>
              </div>
              <div className="deleteButton">
                <button type="button" onClick={() => handleEquipRemove(index)} className="deleteItem">
                  削除
                </button>
              </div>
            </div>
          );
        })}


        

        <div className="equipment-button-area">
        <button 
          onClick={() => navigate(`/process?id=${processId}`)}
          className="equipment-back-button"
        >
          戻る
        </button>
          <button type="button" onClick={addEquipField} className="addItem">
            備品を追加
          </button>
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
}

