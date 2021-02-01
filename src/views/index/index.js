import Shake from '../../common/shake'
import login from '../../common/login'
import { throttle } from '../../utils/util'
// import API from '../../service/api'
const {API, getLastCount, globalData} = getApp()

Page({
  data: {
    rule_win: false,
    write_info: false,
    result_win: false,
    next_time: null,  // 下次活动时间
    left_times: null, // 剩余抽奖次数
    prize_info: {}, // 奖品信息
    is_shake: false // 是否在摇一摇
  },
  onLoad: async function () {
    console.log('Welcome to Mini Code')
    login(this.launchCallback)
    // const countInfo =  await getLastCount()
    // this.launchCallback(countInfo)
    tt.showToast({
      title: "奖品准备中",
      icon: 'loading',
      duration: 5000
    })
  },

  onShow() {
    this.checkLeftTimes()
  },

  /**
   * @description 验证是否还有抽奖机会
   */
  checkLeftTimes() {
    const left_times = this.data.left_times
    if (left_times) {
      this.tapStartAccelerometer()
    }
  },

  /**
   * @description 登录完成并获得剩余次数的回调
   * @param {Object} countInfo 
   */
  launchCallback() {
    console.log('开始回调')
    tt.hideToast()
    API.lastCountApi().then(countInfo => {
      console.log('取到次数', countInfo)
      const {next_time, left_times, active} = countInfo
      if (!active || !left_times) { // 活动未开启 or 抽奖机会已用完
        this.setData({prize_info: {type: 3, next_time}})
        console.log('打开result-win')
        this.openResultWin()
        return
      }
      this.setData({next_time, left_times})
      this.openRuleWin()
    })
  },

  /**
   * @description 打开规则窗口
   */
  openRuleWin() {
    this.setData({rule_win: true})
    this.stopShake()
  },

  /**
   * @description 关闭规则窗口
   */
  cancelRuleWin(e) {
    this.setData({rule_win: e.detail})
    const { left_times, next_time } = this.data
    console.log('left_times', left_times)
    if (left_times) {  // 规则窗口关闭，且还有剩余抽奖机会，开始监听速度感应器
      this.tapStartAccelerometer()
    } else {
      this.setData({prize_info: {type: 3, next_time}})
      this.openResultWin()
    }
  },

  /**
   * @deprecated 开始监听速度感应器
   */
  async tapStartAccelerometer() {
    console.log('开始监听摇一摇', this)
    const shake = new Shake()
    let result = await shake.startShake()
    result && shake.onShake({
      startCb: this.startShake,
      endCb: this.startLottery
    })
    console.log('startShake', result)
  },

  /**
   * @description 开始摇一摇
   */
  startShake() {
    this.setData({is_shake: true})
  },

  /**
   * @description 摇一摇结束，开始抽奖
   */
  startLottery: throttle(function() {
    console.log('开始抽奖')
    this.setData({is_shake: false})
    API.lotteryApi().then(result => {
      console.log('抽奖结果', result)
      const { award, left_times, next_time, record_id, win } = result
      let prize_info = {
        award,
        left_times,
        next_time,
        record_id
      }
      if (!win && !left_times) {
        prize_info.type = 3
      } else {
        // prize_info.type = 2
        prize_info.type = win ? 1 : 2
      }
      console.log('抽奖结果', result)
      this.setData({
        prize_info,
        left_times,
        next_time
      })
      this.openResultWin()
    }).catch(err => {
      console.log('抽奖出错', err)
      tt.showToast({
        title: '活动太火爆啦',
        icon: 'fail',
        duration: 2000
      })
      this.tapStartAccelerometer()
    })
    
  }, 600),

  /**
   * @description 打开信息填写窗口
   */
  openInfoWin() {
    this.setData({write_info: true})
  },

  /**
   * @description 关闭信息填写窗口
   */
  cancelInfoWin(e) {
    this.setData({write_info: e.detail})
    this.checkLeftTimes()
  },

  /**
   * @description 打开抽奖结果窗口
   */
  openResultWin(e) {
    // const { type } = e.currentTarget.dataset
    // this.setData({result_win: true, prize_info: {type: +type}})
    // 以上为测试代码
    this.setData({result_win: true})
  },

  /**
   * @description 关闭抽奖结果窗口
   */
  cancelResultWin(e) {
    this.setData({result_win: e.detail})
    const { left_times, prize_info } = this.data
    // 未中奖
    if (left_times && prize_info.type === 2) { // 从未中奖窗口关闭且还有抽奖机会
      this.tapStartAccelerometer()
      return
    }
    if (!left_times && prize_info.type === 2) { // 从未中奖窗口关闭但没有抽奖机会
      let prize_info = this.data.prize_info
      prize_info = 3
      this.setData({prize_info})
      this.openResultWin()
      return
    }

    // 中奖
    if (prize_info.type === 1) { // 从中奖窗口关闭
      this.openInfoWin()
      return
    }
  },

  /**
   * 去规则页面
   */
  toRulePage() {
    tt.navigateTo({
      url: '/src/views/rule/rule'
    })
  },

  /**
   * @description 停止重力感应器监听
   */
  stopShake() {
    tt.stopAccelerometer({
      success: () => {
        console.log('页面关闭，停止速度感应器监听')
      }
    })
  },

  onHide() {
    console.log('hide')
    this.stopShake()
  },

  onUnload() {
    console.log('onUnload')
  }
})
