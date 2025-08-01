import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/EquipmentRegist.css';




const judgeOptions = ['50', '40', '30', '20', '10'];

export default function EquipmentRegist() {

  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    equipName: '',
    limited: '',
    remaining: '',
    unit: '',
    storage: '',
    judge: '',
    remarks: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [projectIdForRegistration, setProjectIdForRegistration] = useState(null);
  const [unitMap,setUnitMap] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectIdFromUrl = params.get('projectId');
    
   

    axios.get("/api/equipment/get/units").then(respons => {
      setUnitMap(respons.data);
      console.log(respons.data);

    })
    .catch(error => {
      console.error('データの取得に失敗しました',error);
    },[]);
    

    if (projectIdFromUrl) {
      setProjectIdForRegistration(projectIdFromUrl);
      console.log('備品登録画面でプロジェクトID検出：',projectIdFromUrl);
    }
    else {
      setError('登録失敗：プロジェクトIDが取得できませんでした。');
      console.error('プロジェクトIDが見つかりませんでした。')
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


     if (!form.equipName ||!form.limited || !form.remaining || !form.unit || !form.storage || !form.judge || !form.remarks) {
      setError('入力されていない項目があります');
      return;
    }

    const formData = new FormData();
    formData.append('equipName', form.equipName);
    formData.append('limited', form.limited);
    formData.append('remaining', form.remaining);
    formData.append('unit', form.unit);
    formData.append('storage', form.storage);
    formData.append('judge', form.judge);
    formData.append('remarks', form.remarks || '');
    if (image) {
      formData.append('picture', image);
    }
    
    formData.append('projectId', projectIdForRegistration);

    console.log(formData);

    for(let[key,value] of formData.entries()){
      console.log(key + value);
    }


    try {
      const res = await axios.post(
        'http://localhost:8080/api/equipment/regist',
        formData
      );
      // alert('登録成功!');
      console.log(res.data);
      navigate(`/equipment?projectId=${projectIdForRegistration}`);

      //フォームと画像をクリア
      setForm({
        equipName: '',
        limited: '',
        remaining: '',
        unit: '',
        storage: '',
        remarks: '',
        judge: '',
      });
      setImage(null);
      setError('');
      
    } catch (err) {
      console.error('登録失敗:', err);
      // alert('登録に失敗しました。');
    }


  };



  
  return (
    <form onSubmit={handleSubmit}>
      <h2>備品登録</h2>
      <label>画像: <input type="file" accept="image/*" onChange={handleImageChange} /></label><br /><br />
      <label>備品名: <input name="equipName" value={form.equipName} onChange={handleChange} /></label><br />
      <label>期限: <input type="date" name="limited" value={form.limited} onChange={handleChange} /></label><br />
      <label>残量: <input type="number" name="remaining" value={form.remaining} onChange={handleChange} /></label><br />
      <label>単位:
        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="">選択</option>
          {unitMap.map((unit, index) => <option key={index} value={unit.unitId}>{unit.unit}</option>)}
        </select>
      </label><br />
      <label>保管場所: <input name="storage" value={form.storage} onChange={handleChange} /></label><br />
      <label>アラートのタイミング:
        <select name="judge" value={form.judge} onChange={handleChange}>
          <option value="">選択</option>
          {judgeOptions.map(opt => (
            <option key={opt} value={opt}>{opt}%</option>
          ))}
        </select>
      </label><br />
      <label>備考: <input name="remarks" value={form.remarks} onChange={handleChange} /></label><br />
      
      {error && <p style={{ color: 'red' }} className="error-message">{error}</p>}

        <div className="eqregist-button-group">
          <button type="button" className="eqregist-back" onClick={() => navigate(`/equipment?projectId=${projectIdForRegistration}`)}>戻る</button>
          <button type="submit" className="eqregist-submit" >登録</button>
        </div>
    </form>
  );
}
