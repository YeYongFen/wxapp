import Fly from 'flyio'
const fly = new Fly


// http.init({
//   baseURL: 'http://localhost:8888'
// })

fly.interceptors.response.use(
  (response) => {
    //只将请求结果的data字段返回
    return response.data
  },
  (err) => {
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
  }
)

export default fly
