import { baseURL } from '../config/index'
import { isHttp } from '../utils/util'
import { getStorage } from "../utils/storage";

class Instance {
  constructor(options) {
    this.baseURL = baseURL,
    this.header = {
      "content-type": "application/json",
    }
  }

  
  request({method, uri, data, header = this.header}) {
    const token = getStorage('token')
    console.log('token', token)
    if (token) {
      header['authorization'] = `Bearer ${token}`
    }
    // console.log('baseURL', baseURL)
    console.log('请求路径', `${this.baseURL}${uri}`)
    return new Promise((resolve, reject) => {
      tt.request({
        url: isHttp(uri) ? uri : `${this.baseURL}${uri}`,
        method: method || 'GET',
        header: header,
        dataType: "JSON",
        data,
        success: (res) => {
          
          const { statusCode, data } = res
          console.log('请求结果', data, res)
          const response = JSON.parse(data)
          if (response.code === 0) {
            resolve(response.data)
          } else {
            reject(response)
            if (response.code !== 1249) {
              tt.showToast({
                title: response.message,
                icon: 'fail',
                duration: 2000
              })
            }
          }
        },
        fail: (err) => {
          console.log('err', err)
          reject(err)
        }
      })
    })
  }
}

module.exports = new Instance()