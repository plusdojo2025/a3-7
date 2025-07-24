import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WeeklyWorkflow = () => {
  const navigate = useNavigate();
  const { projectId, processId } = useParams();

  const [processName, setProcessName] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);

  useEffect(() => {
    if (processId) {
      axios.get(`/api/processes/${processId}`)
        .then(res => setProcessName(res.data.process_name))
        .catch(() => setProcessName("（不明な工程）"));
    }
  }, [processId]);

  useEffect(() => {
    generateWeek(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate && processId) {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      axios.get(`/api/weekly-reports?date=${dateStr}&processId=${processId}`)
        .then(res => setReportDetail(res.data))
        .catch(() => setReportDetail(null));
    }
  }, [selectedDate, processId]);

  const generateWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    start.setDate(start.getDate() + diffToMonday);
    const newWeek = [...Array(7)].map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
    setWeekDates(newWeek);
  };

  const handleArrow = (direction) => {
    const offset = direction === "prev" ? -7 : 7;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const handleReportCreate = () => {
    if (projectId && processId) {
      navigate(`/report/project/${projectId}/process/${processId}`);
    } else {
      alert("Project ID または Process ID が不明です。");
    }
  };

  const handleConfirm = () => {
    const confirmed = window.confirm("工程を完了してもよろしいですか？");
    if (confirmed) {
      navigate("/project");
    } else {
      navigate(`/project/${projectId}/processes/${processId}`);
    }
  };

  return (
    <div>
      <h2>{processName}</h2>

      <div>
        <button onClick={handleReportCreate}>日報</button>
        <button onClick={() => navigate(`/reflect/project/${projectId}/process/${processId}`)}>反省</button>
        <button onClick={handleConfirm}>工程を完了</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => handleArrow("prev")}>←</button>
        {weekDates.map(date => (
          <button
            key={date.toDateString()}
            onClick={() => setSelectedDate(date)}
            style={{
              margin: "0 5px",
              backgroundColor:
                selectedDate?.toDateString() === date.toDateString() ? "lightblue" : "white"
            }}
          >
            {date.toLocaleDateString()}
          </button>
        ))}
        <button onClick={() => handleArrow("next")}>→</button>
      </div>

      {selectedDate && (
        <div style={{ marginTop: 20 }}>
          <h3>{selectedDate.toLocaleDateString()} の詳細</h3>
          {reportDetail ? (
            <div>
              <p><strong>日報:</strong> {reportDetail.report}</p>
              <p><strong>反省:</strong> {reportDetail.reflection}</p>
              <button onClick={() => navigate(`/reportEdit?date=${selectedDate.toISOString().slice(0,10)}&processId=${processId}`)}>編集</button>
            </div>
          ) : (
            <p>登録された日報がありません</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyWorkflow;
