import Shake from '../../common/shake'
import login from '../../common/login'
import { throttle } from '../../utils/util'
import { getStorage } from '../../utils/storage';
// import API from '../../service/api'
const APP = getApp()
const {API, getLastCount, globalData} = APP

Page({
  data: {
    // rule_win: false,
    write_info: false,
    result_win: false,
    next_time: null,  // 下次活动时间
    left_times: null, // 剩余抽奖次数
    active: false, // 活动是否开启
    prize_info: {}, // 奖品信息
    // is_shake: false // 是否在摇一摇，控制摇一摇动画
  },
  onLoad: async function () {
    console.log('Welcome index page')
    tt.showToast({
      title: "奖品准备中",
      icon: 'loading',
      duration: 5000
    })
    const token = getStorage('token')
    if (token) {
      this.launchCallback()
    } else {
      APP.appReadyCallback = () => {
        console.log('callback')
        this.launchCallback()
      }
    }
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
    const prizeInfo = API.myPrize().then()
    const countInfo = API.lastCountApi().then()

    Promise.all([prizeInfo, countInfo]).then(res => {
      console.log('res', res)
      const prizeInfo = res[0].find(item => item.status === 0)
      const countInfo = res[1]
      this.setCountInfo(countInfo)
      this.checkPrizeStatus(prizeInfo)
    }).catch(err => {
      tt.showToast({
        title: '服务器开小差啦',
        icon: 'fail',
        duration: 2000
      })
    })
  },

  /**
   * @description 设置次数信息
   */
  setCountInfo(countInfo) {
    const {next_time, left_times, active} = countInfo
    this.setData({next_time, left_times, active})
    console.log('信息设置完成')
  },

  /**
   * @description 验证奖品状态
   */
  checkPrizeStatus(prizeInfo) {
    console.log('开始验证奖品状态', prizeInfo)
    if (prizeInfo && !prizeInfo.status) { // 有奖品但还没有填写奖品信息
      this.setData({prize_info: {...prizeInfo, record_id: prizeInfo.id}})
      this.openInfoWin()
    } else {  // 没有奖品或奖品信息已填写
      const { active } = this.data
      if (!active) {
        console.log('活动未开启，打开modal')
        this.openModal(this.data.next_time)
        return
      }
      // 准备完毕，打开重力感应器
      this.tapStartAccelerometer()
    }
  },

  /**
   * @description 活动未开启的modal
   */
  openModal(next_time) {
    tt.showModal({
      title: '活动暂未开启',
      content: `下轮活动开启时间：${next_time} 10:00`,
      confirmText: '下轮再来',
      showCancel: false,
      success: res => {
        // tt.exitMiniProgram({
        //   complete: res => {
        //     console.log('退出结果', res)
        //   }
        // })
      },
      fail(err) {
        console.log(`showModal 调用失败`, err);
      }
    })
  },

  /**
   * @deprecated 开始监听速度感应器
   */
  async tapStartAccelerometer() {
    console.log('开始监听摇一摇', this)
    const { left_times, next_time } = this.data
    if (left_times) {
      console.log('还有机会，可以继续摇')
      const shake = new Shake()
      let result = await shake.startShake()
      result && shake.onShake({
        startCb: this.startShake,
        endCb: this.startLottery
      })
    } else {
      console.log('没有机会了，不能再摇了')
      const { prize_info } = this.data
      prize_info.type = 3
      prize_info.next_time = next_time
      this.setData({prize_info})
      this.openResultWin()
    }
    
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
      let prize_info = {award, left_times, next_time, record_id}
      prize_info.type = win ? 1 : 2
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
    const active = this.data.active
    if (!active) {
      this.openModal()
    } else {
      this.checkLeftTimes()
    }
    
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
      prize_info.type = 3
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
  toRulePage(e) {
    const { type } = e.currentTarget.dataset
    tt.navigateTo({
      url: `/src/views/rule/rule?type=${type}`
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

  /**
   * @description 页面分享
   */
  onShareAppMessage() {
    return {
      title: '戳这里 领取新华社宠粉福利！',
      desc: '新华社“不打烊的中国年”，正在宠粉，快来抽大奖吧！',
      path: '/src/views/index',
      imageUrl: '/src/assets/share.jpg',
      success: () => {
        console.log('转发调起')
      },
      fail: err => {
        console('转发调起失败', err)
      }
    }
  },


  onHide() {
    console.log('hide')
    this.stopShake()
  },

  onUnload() {
    console.log('onUnload')
  }
})
