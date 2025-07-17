import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Report() {
   const [equipmentList, setEquipmentList] = useState([]);
   
     

     const [form, setForm] = useState({
         createdAt: "",
         processId: "",
         projectId: "",
         comment: "",
         projectName: "",
         equipId: "",
         usageAmount: ""
     });
     

    useEffect(() => {
  
     fetch("/api/report")
       .then(res => res.json())
     
       .then(data => {setEquipmentList(data)
        })
       .catch(err => {
        console.error("Failed to fetch equipment", err);
    });
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
             projectName: "",
             equipId: "",
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
             <div>日付:<input type="date" name="createdAt"value={form.createdAt} onChange={handleChange}required/>
             </div>
             <div> 研修タイトル:<input type="text" name="projectName" value={form.projectName}  onChange={handleChange}/> 
             </div>
             <div> 備品名:
                <select name="equipId" value={form.equipId} onChange={handleChange}>
                      <option value="">選択してください</option>
                         {(equipmentList||[]).map(equip => (
                         <option key={equip.equipId} value={equip.equipId}>
                          {equip.equipName}
                      </option>
                      ))}
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
