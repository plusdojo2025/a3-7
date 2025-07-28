import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

const Process = () => {
  const [process, setProcess] = useState(null);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [report, setReport] = useState(null);
  const [reflect, setReflect] = useState([]);
  const [reflectTag, setReflectTag] = useState([]);
  

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const processId = params.get("id");
  const [projectId, setProjectId] = useState(params.get("projectId"));
  const [authority, setAuthority] = useState(0);
  // ここをステートに

  useEffect(() => {
    if (projectId) {
      axios.get(`/api/member/authority?projectId=${projectId}`, { withCredentials: true })
        .then(res => setAuthority(res.data)) // 1 or 2 or 3
        .catch(() => setAuthority(0)); // 権限なしや未承認
    }
  }, [projectId]);

  // Fetch process name
  useEffect(() => {
    if (processId) {
      axios.get(`/api/processes/${processId}`)
        .then((res) => {
          setProcess(res.data);
          // ここでprojectIdもセット
          if (res.data.projectId) {
            setProjectId(res.data.projectId);
          }
        })
        .catch(() => setError("工程の取得に失敗しました"));
    } else {
      setError("Process ID が指定されていません");
    }
  }, [processId]);

  // Generate week when currentDate changes
  useEffect(() => {
    generateWeek(currentDate);
  }, [currentDate]);

  // Load report & reflection when selected date changes
  useEffect(() => {
    if (selectedDate && processId) {
      const dateStr = selectedDate.toISOString().slice(0, 10);

      // Report
      axios
        .get(`/api/weekly-reports/createdAt?createdAt=${dateStr}&processId=${processId}`)
        .then((res) => setReport(res.data))
        .catch(() => setReport(null));

      // Reflect
      axios
        .get(`/api/reflect/createdAt?createdAt=${dateStr}&processId=${processId}`)
        .then((res) => {
          setReflect(res.data); // ← 配列を state に保存
          console.log(res.data);
        })
        .catch(() => setReflect([]));


      // ReflectTag
      axios
        .get("/api/reflectTag")
        .then((res) => {
          setReflectTag(res.data);
          console.log(res.data);
        })
        .catch(() => setReflectTag(null));
        
    }
  }, [selectedDate, processId]);

  // 2. タグID→タグ名のマップを作成（高速参照用）
  const tagMap = useMemo(() => {
    const map = {};
    reflectTag.forEach((tag) => {
      map[tag.reflectTagId] = tag.reflectName;
    });
    return map;
  }, [reflectTag]);

  // 3. 反省データにタグ名を付与した新配列を作成
  const reflectWithName = useMemo(() => {
    return reflect.map((r) => ({
      ...r,
      reflectName: tagMap[r.reflectTagId] || "不明なタグ",
    }));
  }, [reflect, tagMap]);


 

  const generateWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const mondayOffset = (day + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    setWeekDates(days);
  };

  const handleArrow = (direction) => {
    const offset = direction === "prev" ? -7 : 7;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const handleEdit = () => {
    if (!report || !report.reportId) return;
    navigate(`/reportEdit/${report.reportId}`);
  };
  const handleReport = () => {
    navigate(`/report/project/${projectId}/process/${processId}`);
  };

  const handleReflect = () => {
    navigate(`/reflect/project/${projectId}/process/${processId}`);
  };

  const handleConfirm = () => {
    if (window.confirm("工程を完了してもよろしいですか？")) {
      axios.get(`/api/endProcess/${processId}/`)
        .then(() => {
          navigate(`/project?id=${projectId}`);
        })
        .catch(err => {
          console.error("登録時にエラーが発生しました:", err);
        });
    }
  };


  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!process) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{process.processName}</h2>

      {/* Calendar Navigation & Buttons */}
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => handleArrow("prev")}>◀</button>
        <span style={{ fontWeight: "bold" }}>{currentDate.getMonth() + 1}月</span>
        <button onClick={() => handleArrow("next")}>▶</button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {authority >= 2 && <button onClick={handleReport}>日報</button>}
          {authority >= 2 && <button onClick={handleReflect}>反省</button>}
          {authority >= 2 && <button onClick={handleConfirm}>工程を完了</button>}
        </div>
      </div>

      {/* Week Calendar */}
      <div
        style={{
          display: "flex",
          width: "60%",
          padding: "10px",
          justifyContent: "space-between",
          marginBottom: "80px",
        }}
      >
        {weekDates.map((date, idx) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(date)}
              style={{
                width: "13%",
                border: "1px solid #ccc",
                textAlign: "center",
                padding: 8,
                cursor: "pointer",
                backgroundColor: isSelected ? "#e0f0ff" : "#fff",
              }}
            >
              <div style={{ color: isSunday ? "red" : isSaturday ? "blue" : "#000" }}>
                {date.getDate()}日
              </div>
              <div>{weekdays[date.getDay()]}</div>
            </div>
          );
        })}
      </div>

      {/* Detail area */}
      <div
        style={{
          border: "2px solid #0c3a4d",
          borderRadius: "15px",
          padding: "10px",
          background: "#f5f5f5",
        }}
      >
         <h4>詳細（日報と反省）</h4>
      {report ? (
        <div>
          <p><strong>日報:</strong></p>
          <label>日付: {report.createdAt}</label><br />
          <label>コメント: {report.comment}</label><br />

          <p><strong>反省:</strong></p>
          {reflectWithName.length > 0 ? (
            reflectWithName.map((r, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <label>日付: {r.createdAt}</label><br />
                <label>タグ: {r.reflectName}</label><br />
                <label>コメント: {r.comment}</label><br />
                <hr />
              </div>
            ))
          ) : (
            <p>反省は登録されていません</p>
          )}
        </div>
      ) : (
        <p>登録された日報がありません</p>
      )}

        {authority >= 2 && report && <button onClick={handleEdit}>編集</button>}
      </div>
    </div>


  );
};



export default Process;
