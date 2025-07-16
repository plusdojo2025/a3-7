import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Report() {
     const [items, setItems] = useState([]);
     const [form, setForm] = useState({
         createdAt: "",
         processId: "",
         projectId: "",
         comment: "",
         title: "",
         equipName: "",
         usageAmount: ""
     });

     useEffect(() => {
    
     fetch("/api/report")
         .then(res => res.json())
         .then(data => setItems(data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

     const handleAdd = (e) => {
         e.preventDefault();

        axios.post("/api/report", form)
        .then(() => {
             alert("登録成功！");
             setForm({
             createdAt: "",
             processId: "",
             projectId: "",
             comment: "",
             title: "",
             equipName: "",
             usageAmount: ""
        });
      })
      .catch(() => {
        alert("登録失敗");
      });
  };

  return (
    <div className="report-register">
      <h2 className="title">日報登録</h2>
        <form onSubmit={handleAdd}>
             <div>日付:<input type="datetime-local" name="createdAt"value=  {form.createdAt} onChange={handleChange}required/>
             </div>
             <div> 研修タイトル:<input type="text" name="title" value={form.title}  onChange={handleChange}/>
             </div>
             <div> 備品名:
                <select name="equipName" value={form.equipName} onChange={handleChange}>
                     <option value="">選択してください</option>
                     <option value="試薬A">試薬A</option>
                     <option value="器具B">器具B</option>
                     <option value="機材C">機材C</option>
                </select>
             </div>
             <div> 使用量:
                 <input type="text" name="usageAmount" value={form.usageAmount} onChange={handleChange}/>
             </div>
             <div>コメント:<textarea name="comment" value={form.comment} onChange={handleChange}/>
             </div>
             <div>
                 <button type="button">戻る</button>
                 <button type="submit" style={{ marginLeft: 10 }}>登録</button>
             </div>
        </form>
    </div>
  );
}
