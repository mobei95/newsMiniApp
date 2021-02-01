import { getStorage, setStorage } from "../utils/storage";
import API from '../service/api'

/**
 * @description 登录成功，设置token
 * @param {String} token
 */
const setToken = function(token) {
  setStorage('token', token)
}

/**
 * @description 获取用户信息
 */
const getUserInfo = function() {
  return new Promise((resolve, reject) => {
    tt.getUserInfo({
      success: result => {
        console.log('用户信息', result)
        resolve(result.userInfo)
      },
      fail: err => {
        console.log('授权失败', err)
        tt.exitMiniProgram({
          complete: res => {
            console.log('退出结果', res)
          }
        })
        reject(err)
      }
    })
  })
}

/**
 * @description 获取登录凭证
 */
const getLoginCode = function(cb) {
  console.log('开始拿code')
  tt.login({
    success: async res => {
      const { code, anonymousCode, isLogin } = res
      console.log('拿到临时凭证', code)
      const result = await API.sendLoginCode({ code })
      console.log('token', result)
      await getUserInfo()
      setToken(result.token)
      cb && cb()
    },
    fail: err => {
      tt.exitMiniProgram({
        complete: res => {
          console.log('退出结果', res)
        }
      })
    }
  });
}

export default function login(cb) {
  const token = getStorage('token')
  if (token) {
    tt.checkSession({
      success: () => { // session未过期
        cb && cb()
      },
      fail: () => { // session已过期，重新登陆
        getLoginCode(cb)
      }
    })
  } else {
    getLoginCode(cb)
  }
}