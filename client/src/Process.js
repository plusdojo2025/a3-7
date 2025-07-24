import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

const Process = () => {
  const [process, setProcess] = useState(null);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const processId = params.get("id");
  const projectId = params.get("projectId") || processId;

  // Fetch process name
  useEffect(() => {
    if (processId) {
      axios
        .get(`/api/processes/${processId}`)
        .then((res) => setProcess(res.data))
        .catch(() => setError("工程の取得に失敗しました"));
    } else {
      setError("Process ID が指定されていません");
    }
  }, [processId]);

  // Generate week when date changes
  useEffect(() => {
    generateWeek(currentDate);
  }, [currentDate]);

  // Load report & reflection when selected date changes
  useEffect(() => {
    if (selectedDate && processId) {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      axios
        .get(`/api/weekly-reports?date=${dateStr}&processId=${processId}`)
        .then((res) => setReportDetail(res.data))
        .catch(() => setReportDetail(null));
    }
  }, [selectedDate, processId]);

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
    if (!selectedDate || !processId) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    navigate(`/reportEdit?date=${dateStr}&processId=${processId}`);
  };

  const handleReport = () => {
    navigate(`/report/project/${projectId}/process/${processId}`);
  };

  const handleReflect = () => {
    navigate(`/reflect/project/${projectId}/process/${processId}`);
  };

  const handleConfirm = () => {
    if (window.confirm("工程を完了してもよろしいですか？")) {
      navigate("/project");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!process) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{process.processName}</h2>

    <div>
        {/* Calendar */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => handleArrow("prev")}>◀</button>
        <span style={{ fontWeight: "bold" }}>
          {currentDate.getMonth() + 1}月
        </span>
        <button onClick={() => handleArrow("next")}>▶</button>
        {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <button onClick={handleReport} style={buttonStyle}>
          日報
        </button>
        <button onClick={handleReflect} style={buttonStyle}>
          反省
        </button>
        <button onClick={handleConfirm} style={buttonStyle}>
          工程を完了
        </button>
      </div>
      </div>
        {/* Week Row */}
      <div
        style={{
          display: "flex",
          width:"60%",
         
          padding: "10px",
          justifyContent: "space-between",
          marginBottom: "80px",
        }}
      >
        {weekDates.map((date, idx) => {
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();
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
        {reportDetail ? (
          <div>
            <p><strong>日報:</strong> {reportDetail.report}</p>
            <p><strong>反省:</strong> {reportDetail.reflection}</p>
          </div>
        ) : (
          <p>登録された日報がありません</p>
        )}
        <button onClick={handleEdit} style={{ ...buttonStyle, marginTop: 10 }}>
          編集
        </button>
      </div>
      
      
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  border: "2px solid #0c3a4d",
  borderRadius: "10px",
  backgroundColor: "#ddd",
  cursor: "pointer",
};

export default Process;
