import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WeeklyWorkflow = () => {
  const { project, projectId, processId } = useParams();
  const [processName, setProcessName] = useState("");
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
useEffect(() => {
  if (processId) {
    axios.get(`/api/processes/${processId}`)
      .then((res) => {
        setProcessName(res.data.name); // assuming response has a `name` field
      })
      .catch(() => {
        setProcessName("（不明な工程）");
      });
  }
}, [processId]);
  useEffect(() => {
    generateWeek(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD
      axios
        .get(`/api/weekly-reports?date=${dateStr}`)
        .then((res) => {
          setReportDetail(res.data);
        })
        .catch(() => {
          setReportDetail(null);
        });
    }
  }, [selectedDate]);

  const generateWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday start
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

  const handleConfirm = () => {
    const confirmed = window.confirm("工程を完了してもよろしいですか？");
    navigate(confirmed ? "/project" : "/process");
  };

  const handleReportCreate = () => {
    navigate(`/report/${project}/project/${projectId}/process/${processId}`);
  };

  const handleEdit = () => {
    const dateStr = selectedDate.toLocaleDateString("sv-SE");
    navigate(`/edit-report?date=${dateStr}`);
  };

  return (
    <div>
      <h2 name="processName">{processName}</h2>

      <div>
        <button onClick={handleReportCreate}>日報作成</button>
        <button onClick={() => navigate("/reflect")}>反省作成</button>
        <button onClick={handleConfirm}>工程を完了</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => handleArrow("prev")}>←</button>
        {weekDates.map((date) => (
          <button
            key={date.toDateString()}
            onClick={() => setSelectedDate(date)}
            style={{
              margin: "0 5px",
              background:
                selectedDate?.toDateString() === date.toDateString()
                  ? "lightblue"
                  : "white",
            }}
          >
            {date.toLocaleDateString()}
          </button>
        ))}
        <button onClick={() => handleArrow("next")}>→</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {selectedDate && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyWorkflow;
