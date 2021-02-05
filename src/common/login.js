import { getStorage, setStorage } from "../utils/storage";
import API from '../service/api'


let APP = null

/**
 * @description 登录成功，设置token
 * @param {String} token
 */
const setToken = function(token) {
  console.log('token', token)
  setStorage('token', token)
}

/**
 * @description 拒绝授权 or 拒绝登录，推出程序
 */
const rejectHandle = function() {
  tt.exitMiniProgram({
    complete: res => {
      console.log('退出结果', res)
    }
  })
}

/**
 * @description 进入业务流程
 */
const toBusiness = function() {
  console.log('APP', APP)
  APP.appReadyCallback && APP.appReadyCallback()
}

/**
 * @description 获取用户信息
 */
const getUserInfo = function(code) {
  return new Promise((resolve, reject) => {
    tt.getUserInfo({
      success: async result => {
        console.log('用户信息', result)
        const { avatarUrl, nickName } = result.userInfo
        const loginResult = await API.sendLoginCode({ code, avatarUrl, nickName })
        console.log('loginResult', loginResult)
        resolve(loginResult)
      },
      fail: err => {
        console.log('授权失败', err)
        rejectHandle()
        reject(err)
      }
    })
  })
}

/**
 * @description 获取登录凭证
 */
const getLoginCode = function() {
  console.log('开始拿code')
  tt.login({
    success: async res => {
      const { code, anonymousCode, isLogin } = res
      console.log('拿到临时凭证', code)
      const result = await getUserInfo(code)
      console.log('token', result)
      setToken(result.token)
      toBusiness()
    },
    fail: err => {
      rejectHandle()
    }
  });
}

export default function login(app) {
  APP = app
  const token = getStorage('token')
  console.log('开始')
  if (token) {
    tt.checkSession({
      success: () => { // session未过期，进入业务
        console.log('直接进入业务')
        toBusiness()
      },
      fail: () => { // session已过期，重新登陆
        getLoginCode()
      }
    })
  } else {
    getLoginCode()
  }
}