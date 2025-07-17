import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Reflect() {
  const [reflectList, setReflectList] = useState([]);
  const [form, setForm] = useState({
    createdAt: "",
    tagId: "",
    comment: ""
  });
         useEffect(() => {
        
           fetch("/api/reflect")
             .then(res => res.json())
             .then(data => {setReflectList(data)
              })
             .catch(err => {
              console.error("Failed to fetch reflect", err);
          });
      }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("/api/reflect", form)
      .then(() => {
        alert("登録しました！");
        setForm({ createdAt: "", tagId: "", comment: "" });
      })
      .catch(() => alert("登録に失敗しました"));
  };

  return (
    <div className="reflection-form">
      <h2>反省登録</h2>
      <form onSubmit={handleSubmit}>
      
        <div>
          <label>日付：</label>
          <input
            type="date"
            name="createdAt"
            value={form.createdAt}
            onChange={handleChange}
            required
          />
        </div>
  
        <div>
          <label>タグの選択：</label>
          <select name="tag" value={form.tagId} onChange={handleChange} required>
                    <option value="">選択してください</option>
                         {(reflectList||[]).map(reflect => (
                         <option key={reflect.reflectId} value={reflect.reflectId}>
                          {reflect.reflectName}
                      </option>
                      ))}
          </select>
        </div>
       
        <div>
          <label>コメント：</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            
          />
        </div>
      
        <div style={{ marginTop: "10px" }}>
          <button type="button" onClick={() => window.history.back()}> 戻る</button>
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
}