import login from './src/common/login'
import globalData from './global_data'
import API from './src/service/api'
App({
  onLaunch: function () {
    console.log('launch')
    // login(this.getLastCount)
    this.getSystenInfo()
  },

  /**
   * @description 查询剩余抽奖次数
   */
  getLastCount() {
    console.log('查询抽奖次数')
    return new Promise(async (resolve, reject) => {
      console.log('66666666666666666')
      const countInfo = await API.lastCountApi()
      console.log('查到次数', countInfo)
      if (countInfo) {
        resolve(countInfo)
      } else {
        console.log('剩余次数查询出错')
        reject('剩余次数查询出错')
      }
    })
  },

  /**
   * @description 获取系统信息
   */
  getSystenInfo() {
    const nativeSystemInfo = tt.getSystemInfoSync()
    console.log('nativeSystemInfo', nativeSystemInfo)
    const { pixelRatio, windowHeight, windowWidth } = nativeSystemInfo
    const baseVh = windowHeight / 100
    const baseVw = (windowWidth * pixelRatio) / 100
    const baseRpx = windowWidth / 750 
    globalData.systemInfo = {pixelRatio, windowHeight, windowWidth, baseVh, baseVw, baseRpx}
  },

  globalData,
  API 
})
