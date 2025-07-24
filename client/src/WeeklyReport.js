import React, { useState } from "react";

export default function WeeklyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 月移動用ハンドラ（例）
  const prevMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() - 1);
    setSelectedDate(d);
  };
  const nextMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
  };

  // カレンダーの日付はここで計算（今回は省略）
  // 例として固定表示にしてます
  const days = [
    { day: 6, weekday: "日", color: "red" },
    { day: 7, weekday: "月", color: "black" },
    { day: 8, weekday: "火", color: "black" },
    { day: 9, weekday: "水", color: "black" },
    { day: 10, weekday: "木", color: "black" },
    { day: 11, weekday: "金", color: "black" },
    { day: 12, weekday: "土", color: "blue" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h3>工程A</h3>

      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={prevMonth}>◀</button>
        <div style={{
          border: "1px solid #000",
          borderRadius: 20,
          padding: 10,
          width: 400,
          margin: "0 10px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}>
          <div style={{ marginRight: 10 }}>{selectedDate.getMonth() + 1}月</div>
          {days.map(({ day, weekday, color }) => (
            <div key={day} style={{ borderLeft: "1px solid #ddd", flex: 1, padding: 5 }}>
              <div style={{ color }}>{day}日</div>
              <div>{weekday}</div>
            </div>
          ))}
        </div>
        <button onClick={nextMonth}>▶</button>

        <div style={{ marginLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{ width: 100, height: 40 }}>日報</button>
          <button style={{ width: 100, height: 40 }}>反省</button>
          <button style={{ width: 100, height: 40 }}>工程を完了</button>
        </div>
      </div>

      <div style={{
        marginTop: 20,
        border: "1px solid #888",
        borderRadius: 10,
        backgroundColor: "#ccc",
        padding: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>詳細（日報と反省）</div>
        <button style={{ backgroundColor: "#b0d8a3", borderRadius: 5, padding: "5px 15px" }}>編集</button>
      </div>
    </div>
  );
}


