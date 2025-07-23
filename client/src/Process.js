import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WeeklyWorkflow = () => {
  const { project, projectId, processId } = useParams(); 

  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);

  useEffect(() => {
    generateWeek(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      axios.get(`/api/weekly-reports?date=${dateStr}`).then((res) => {
        setReportDetail(res.data);
      }).catch(() => {
        setReportDetail(null);
      });
    }
  }, [selectedDate]);

  const generateWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
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
    if (window.confirm("工程を完了してもよろしいですか？")) {
      window.location.href = "/project-management";
    } else {
      window.location.href = "/process";
    }
  };

  return (
    <div>
      <h2>工程進捗管理</h2>

      <div>
        <button
          onClick={() =>
            window.location.href = `/report/${project}/${projectId}/process/${processId}`
          }
        >
          日報作成
        </button>
        <button onClick={() => window.location.href = "/reflect"}>反省作成</button>
        <button onClick={handleConfirm}>工程を完了</button>
      </div>

      <div>
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
                <button
                  onClick={() =>
                    window.location.href = `/edit-report?date=${selectedDate.toISOString().split("T")[0]}`
                  }
                >
                  編集
                </button>
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
