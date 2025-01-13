import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const API_BASE = import.meta.env.VITE_BASE_URL;

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexTokenWeek2\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  // const uploadData = async ()=>{
  //   console.log(API_BASE,API_PATH)
  //   try{
  //     await axios.post(`${API_BASE}/v2/api/${API_PATH}/admin/product`,{
  //       data:{
  //         category: "烤馬鈴薯",
  //         content: "選用上等培根與新鮮馬鈴薯，搭配濃郁的起司，與柔滑的馬鈴薯餡料相得益彰。",
  //         description: "每一口都能品味到培根的煙燻香氣與起司的濃厚風味，完美演繹的經典組合。",
  //         imageUrl: "https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //         imagesUrl: [
  //           "https://images.unsplash.com/photo-1645673197548-9adfa2ea55dc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  //         ],
  //         is_enabled: 1,
  //         origin_price: 90,
  //         price: 90,
  //         title: "培根起司馬鈴薯",
  //         unit: "份"
  //       }
  //     },
  //     {
  //       headers: {
  //         Authorization: token
  //       }
  //     })
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }
  const getProducts = async ()=>{
    const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`)
    setProducts(res.data.products);
  }
  const checkLogin = async () => {
    try{
      await axios.post(`${API_BASE}/api/user/check`, {},
      {
        headers: {
          Authorization: token
        },
      });
      alert("您已經成功登入")
    }
    catch(error){
      alert("尚未登入")
    }
  }
  useEffect(() => {
    (async () => {
      try{
        const res = await axios.post(`${API_BASE}/api/user/check`, {},
        {
          headers: {
            Authorization: token
          },
        });
        setIsAuth(true);
        getProducts();
      }
      catch(error){
        console.log(error);
      }
    })();
  }, []);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, {
        username: formData.username,
        password: formData.password,
      });
      const oneMonthInSeconds = 30 * 24 * 60 * 60; // 30 天
      document.cookie = `hexTokenWeek2=${res.data.token}; max-age=${oneMonthInSeconds}`;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e) => {
    setFormData((preFormData) => ({
      ...preFormData,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      {isAuth ? (
        <div className="container">
          <button type="button" className="btn btn-primary mt-4" onClick={checkLogin}>checkLogin</button>
          <div className="row mt-5">
            <div className="col-md-6">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setTempProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.category}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="images"
                          alt="副圖"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    name="username"
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    name="password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
