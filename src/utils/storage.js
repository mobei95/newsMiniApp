const defaultTime = 1000 * 60 * 60 * 24 // 缓存的默认有效时间

/**
 * @description 设置缓存
 * @param {String} key
 * @param {String} value
 * @param {Number} time 过期时间，不传则不设置
 */
export const setStorage = (key, value, time) => {
  let expiresTime = time ? new Date().getTime() + (defaultTime * time) : time
  let data = {
    value,
    expiresTime
  }
  tt.setStorageSync(key, data)
}

/**
 * @description 读取缓存
 * @param {String} key
 */
export const getStorage = key => {
  let data = tt.getStorageSync(key)
  
  if (!data) { // 当前缓存不存在
    return null
  }
  
  if (data.expiresTime) { // 缓存存在，验证过期时间
    let now = new Date().getTime()
    if (now - data.expiresTime < 0) { // 未过期
      return data.value
    }
    tt.removeStorageSync(key);
    return null
  }
  
  return data.value // 缓存未设置过期时间
}

/**
 * @description 删除指定缓存
 * @param {String} key
 */
export const removeStorage = key => {
  tt.removeStorageSync(key)
}