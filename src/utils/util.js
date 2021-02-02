export const isHttp = url => {
  return /^http/.test(url)
}

/**
 * @description 节流函数
 * @param {Function} callback 需要执行的方法
 * @param {Number | String} wait: 等待的时间（毫秒）
 * */
export const throttle = function(callback, wait) {
  let context = null
  let args = null
  let previous = 0
  return function() {
    context = this
    args = arguments
    let now = +new Date()
    if (now - previous > wait) {
      callback.apply(context, args)
      previous = now
    }
  }
}

/**
 * @description 格式化时间戳
 * @param {String} value 时间字符串
 * */
export const formatTime = function(value) {
  const date = typeof value === 'number' ? new Date(value) : new Date(value.replace(/\-/g,'/'))
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
  }

  return `${[year, month, day].map(formatNumber).join('.')} ${[hour, minute, second].map(formatNumber).join(':')}`
}