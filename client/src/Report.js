import React from "react";


class Report extends React.Component{
    
    render(){
         return(
            <div>
                 <div className="report-register">
                     <h2 className="title">日報登録</h2>
                     <form>
                         日付 <input type="datetime-local" placeholder="日付"></input>
                         研修タイトル <input type="text"></input>
                         備品名:
                            <select name="equipName">
                                 <option value="">選択してください</option>
                                 <option value="試薬A">試薬A</option>
                                 <option value="器具B">器具B</option>
                                 <option value="機材C">機材C</option>
                            </select><br />
        
                     </form>
                 </div>
            </div>
    )
  
   }
}
export default Report;import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
