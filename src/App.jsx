import { useState } from 'react'
// 引入 axios
import axios from "axios";
//引入css
import "./assets/style.css";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;




function App() {
  const [formData,setFormData] = useState({
    username: '',
    password: '',
  });
  const [isAuth,setIsAuth] = useState(false);  //boolean
  // const [products,setProducts] = useState([]); //陣列
  // const [tempProducts,setTempProducts] = useState(null); //空值

  const url = 'https://ec-course-api.hexschool.io/v2'; //六角api網域，加上一定會有的v2路徑
	const apiPath = 'keven0503'; //這是自己申請以後會有的ID

  //const eventHandler = (e) =>{}
  //function eventHandler (e){}

  function eventHandler(e) {
    const { value, name } = e.target; //取得的內容裡面去抓輸入的value, 和name的值
    console.log(value, name );
    setFormData((preData) => ({
      // 覆蓋形式
      ...preData,
      [name]: value,
    }));
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault(); //禁止submit的其他功能
      const res = await axios.post(`${VITE_API_BASE}/admin/signin`, formData);
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <>
      {
        !isAuth ? (
          <div className="container login">
            <h1>帳號登入</h1>
            <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" name="username" placeholder="name@example.com" value={formData.username} onChange={(e) => eventHandler(e)}/>
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" name="password" placeholder="Password" value={formData.password} onChange={(e) => eventHandler(e)}/>
                <label htmlFor="password">Password</label>
              </div>
              <button type='submit'className="btn btn-primary mt-2 w-100" >登入</button>
            </form>
          </div>
        ) : (
          <div>已登入</div>
        )
      }
    </>
  )
}

export default App
