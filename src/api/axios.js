import qs from 'qs'
import axios from 'axios'

const instance = axios.create({
  timeout: 5000
})

instance.interceptors.request.use(
  config => {
    // 如果请求类型为post， 设置content-type并序列化data参数
    if (config.method !== 'get' && !config.headers['Content-Type']) {
      config.headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      config.data = qs.stringify(config.data)
    }
    return config
  }
)

function Axios (config) {
  return new Promise((resolve, reject) => {
    instance(config)
      .then(res => {
        resolve({ code: 0, data: res.data })
      })
      .catch(err => {
        resolve({ code: -1, err })
      })
  })
}

export default Axios
