// 引入axios
import axios from 'axios'

const require = (config) => {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888',
    timeout: 5000
  })
  return instance(config)
} 
export default require