import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Process.css";
import "./css/Common.css";


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

  useEffect(() => {
    if (projectId) {
      axios.get(`/api/member/authority?projectId=${projectId}`, { withCredentials: true })
        .then(res => setAuthority(res.data))
        .catch(() => setAuthority(0));
    }
  }, [projectId]);

  // Fetch process name
  useEffect(() => {
    if (processId) {
      axios.get(`/api/processes/${processId}`)
        .then((res) => {
          setProcess(res.data);
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
          setReflect(res.data);
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

  //追加：戻るボタン
  const handleGoBack = () => {
    navigate(`/project?id=${projectId}`);
  };


  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!process) return <p>読み込み中...</p>;

  return (
    <div className="process-container">
      <div className="process-header">
        <h2>{process.processName}</h2>
      </div>

      {/* カレンダーナビゲーションだけを中央に配置するためのコンテナ */}
      <div className="calendar-nav-container">
        <div className="calendar-nav">
          <button onClick={() => handleArrow("prev")}>◀</button>
          <span className="month-display">{currentDate.getMonth() + 1}月</span>
          <button onClick={() => handleArrow("next")}>▶</button>
        </div>
      </div>

      {/* ボタン群を配置するためのコンテナ */}
      <div className="action-buttons-container">
        <div className="action-buttons">
          {authority >= 1 && <button onClick={handleReport}>日報</button>}
          {authority >= 1 && <button onClick={handleReflect}>反省</button>}
          {authority >= 1 && <button onClick={handleConfirm}>工程を完了</button>}
          <button onClick={handleGoBack} className="back-button">戻る</button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="week-calendar">
        {weekDates.map((date, idx) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;

          const dayClasses = `day-cell ${isSelected ? 'selected' : ''} ${isSunday ? 'sunday' : ''} ${isSaturday ? 'saturday' : ''}`;

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={dayClasses}
            >
              <div>{date.getDate()}日</div>
              <div>{weekdays[date.getDay()]}</div>
            </div>
          );
        })}
      </div>

      {/* Detail area */}
      <div className="detail-area">
        {report ? (
          <>
            <h4>日報｜反省</h4>
            <p className="report-title"><strong>日報</strong></p>
            <div className="report-card">
              <div className="report-header">
                <div className="report-info">
                  <p className="report-comment">{report.comment}</p>
                </div>
                {authority >= 1 && <button onClick={handleEdit}>編集</button>}
              </div>
            </div>

            <p className="reflect-title"><strong>反省</strong></p>
            {reflectWithName.length > 0 ? (
              reflectWithName.map((r, i) => (
                <div key={i} className="reflect-card-item">
                  <div className="reflect-card-content">
                    <p className="reflect-tag">{r.reflectName}</p>
                    <p className="reflect-comment">{r.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>反省は登録されていません</p>
            )}
          </>
        ) : (
          <>
            <h4>日報｜反省</h4>
            <p>登録されていません</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Process;