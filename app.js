import login from './src/common/login'
import globalData from './global_data'
import API from './src/service/api'
App({
  onLaunch: function () {
    console.log('launch')
    login(this)
    this.getSystenInfo()
  },

  /**
   * @description 获取系统信息
   */
  getSystenInfo() {
    const nativeSystemInfo = tt.getSystemInfoSync()
    console.log('nativeSystemInfo', nativeSystemInfo)
    const { pixelRatio, windowHeight, windowWidth } = nativeSystemInfo
    const baseVh = windowHeight / 100
    const baseVw = windowWidth / 100
    const baseRpx = windowWidth / 750 // 得到1rpx对应的px
    const basePx = 750 / windowWidth // 得到1px对应的rpx
    globalData.systemInfo = {pixelRatio, windowHeight, windowWidth, baseVh, baseVw, baseRpx, basePx}
  },

  globalData,
  API 
})
