import React from "react";


class Report extends React.Component{
    
    render(){
         return(
            <div>
                 <div className="report-register">
                     <h2 className="title">日報登録</h2>
                     <form>
                         日付 <input type="datetime-local" placeholder="日付"></input><br/>
                         研修タイトル <input type="text"></input><br/>
                         備品名:
                            <select name="equipName">
                                 <option value="">選択してください</option>
                                 <option value="試薬A">試薬A</option>
                                 <option value="器具B">器具B</option>
                                 <option value="機材C">機材C</option>
                            </select><br/>
                         使用量: <input type="text"/><br />
                         コメント: <textarea/><br />
                         <button>戻る</button>
                         <button>登録</button>
        
                     </form>
                 </div>
            </div>
    )
  
   }
}
export default Report;


