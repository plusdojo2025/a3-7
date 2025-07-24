import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WeeklyWorkflow = () => {
  const { projectId, processId } = useParams();
  console.log(projectId);
  const navigate = useNavigate();

  const [processName, setProcessName] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);

  // Fetch process name when processId changes
  useEffect(() => {
    if (processId) {
      axios.get(`/api/processes/${processId}`)
        .then(res => setProcessName(res.data.processName || "（不明な工程）"))
        .catch(() => setProcessName("（不明な工程）"));
    }
  }, [processId]);

  // Generate current week dates on currentDate change
  useEffect(() => {
    generateWeek(currentDate);
  }, [currentDate]);

  // Fetch report details when selectedDate or processId changes
  useEffect(() => {
    if (selectedDate && processId) {
      const dateStr = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
      axios.get(`/api/weekly-reports?date=${dateStr}&processId=${processId}`)
        .then(res => setReportDetail(res.data))
        .catch(() => setReportDetail(null));
    }
  }, [selectedDate, processId]);

  // Generate array of dates for the week starting Monday
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

  // Move week forward or backward
  const handleArrow = (direction) => {
    const offset = direction === "prev" ? -7 : 7;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  // Confirm process completion and navigate accordingly
  const handleConfirm = () => {
    const confirmed = window.confirm("工程を完了してもよろしいですか？");
    if (confirmed) {
      navigate("/project");
    } else if (projectId && processId) {
      navigate(`/project/${projectId}/processes/${processId}`);
    } else {
      alert("Project または Process ID が不明です。");
    }
  };

  // Navigate to report creation page with projectId and processId
  const handleReportCreate = () => {
    if (projectId && processId) {
      navigate(`/report/project/${projectId}/process/${processId}`);
    } else {
      alert("Project ID または Process ID が不明です。");
    }
  };

  // Navigate to edit report page for selected date
  const handleEdit = () => {
    if (!selectedDate) return;
    if (!processId) {
      alert("Process ID が不明です。");
      return;
    }
    const dateStr = selectedDate.toISOString().slice(0, 10);
    navigate(`/reportEdit?date=${dateStr}&processId=${processId}`);
  };

  return (
    <div>
      <h2>{processName}</h2>

      <div>
        <button onClick={handleReportCreate}>日報作成</button>
        <button onClick={() => navigate(`/reflect/project/${projectId}/process/${processId}`)}>反省作成</button>
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
              <button onClick={handleEdit}>編集</button>
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
