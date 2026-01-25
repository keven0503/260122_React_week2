import { useState } from 'react'
// 引入 axios
import axios from "axios";
//引入css
import "./assets/style.css";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

//最外層
function App() {
  //解構相關的內容
  const [formData,setFormData] = useState({
    username: '',
    password: '',
  });
  const [isAuth,setIsAuth] = useState(false);  //boolean
  const [products,setProducts] = useState([]);
  const [tempProduct,setTempProduct] = useState(null);

  //輸入內容，從e.target裡面找出輸入的內容，用setFormData修改formData的內容
  //而input要顯示的內容都需要從formData裡面去取得
  function eventHandler(e) {
    const { value, name } = e.target; //取得的內容裡面去抓輸入的value, 和name的值
    console.log(value, name );
    setFormData((preData) => ({
      // 覆蓋形式
      ...preData,
      [name]: value,
    }));
  }

  //點擊登入按鈕後，觸發onSubmit函式，透過async非同步處理，發送 POST 請求至登入的API，並將 formData 作為 request body 傳送以進行帳號驗證
  const onSubmit = async (e) => {
    try {
      e.preventDefault(); //禁止submit的其他功能

      //post請求，post請求登入API
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(res.data);

      //取出時間限期，token，放到cookie ★把token存在cookie
      const {expired,token} = res.data;
      document.cookie = `customName=${token}; expires=${new Date(expired)};`;

      //把token帶入到headers ★把token存在headers，可以給api使用
      axios.defaults.headers.common['Authorization'] = token;

      getProducts();

      setIsAuth(true);

    } catch (error) {
      console.log(error.response);
      setIsAuth(false);
    }
  }

  const checkLogin = async(e) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("customName="))
        ?.split("=")[1];

      axios.defaults.headers.common['Authorization'] = token;
      console.log(`token為${token}`)

      const res = await axios.post(`${API_BASE}/api/user/check`); 
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`); 
      setProducts(res.data.products);
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
                <input type="email" className="form-control" id="username" name="username" placeholder="name@example.com" value={formData.username} onChange={(e) => eventHandler(e)}/>
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={formData.password} onChange={(e) => eventHandler(e)}/>
                <label htmlFor="password">Password</label>
              </div>
              <button type='submit'className="btn btn-primary mt-2 w-100" >登入</button>
            </form>
          </div>
        ) : (
          <div className="container">
              <div className="row">
                <div className="col-md-6">
                    <button type='button' className="btn btn-primary mb-4" onClick={(e) => checkLogin(e)}>確認是否已登入</button>
                    <h2>產品列表</h2>
                    <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">產品名稱</th>
                            <th scope="col">原價</th>
                            <th scope="col">售價</th>
                            <th scope="col">是否啟用</th>
                            <th scope="col">查看細節</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((products) => (
                                <tr key={products.id}>
                                    <td>{products.title}</td>
                                    <td>{products.origin_price}</td>
                                    <td>{products.price}</td>
                                    <td>{products.is_enabled ? '啟用' : '未啟用'}</td>
                                    <td><button type="button" class="btn btn-primary" onClick={() => {setTempProduct(products)}}>查看詳情</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <h2>產品細節</h2>
                    {tempProduct ? 
                        <div className="card">
                            <img src={tempProduct.imageUrl} className="card-img-top card-height" alt="主圖" />
                            <div className="card-body">
                                <h5 className="card-title">{tempProduct.title}</h5>
                                <p className="card-text">商品描述:{tempProduct.category}</p>
                                <p className="card-text">商品內容:{tempProduct.description}</p>
                                <p className="card-text"><del className="text-secondary">{tempProduct.origin_price}元</del> / {tempProduct.price}元</p>
                                <h4>更多圖片</h4>
                                <div className="d-flex flex-wrap">
                                    {tempProduct.imagesUrl.map((url,index) => 
                                        <img key={index.id} src={url} className="images" />
                                    )}
                                </div>
                            </div>
                        </div>
                    : '尚未選取商品'}
                </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default App
