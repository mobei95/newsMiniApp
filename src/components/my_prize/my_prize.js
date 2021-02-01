import { formatTime } from '../../utils/util'
const { API, globalData } = getApp()
Component({
  properties: {},
  data: {
    write_info: false,
    record_id: '',
    prize: [
      {
        id: 1,
        name: '巴黎欧莱雅（美礼专列）',
        thumbnail: 'http://qnmbgor40.hn-bkt.clouddn.com/awards/air-speaker.png',
        status: 0
      }
    ]
  },
  attached() {
    console.log('getApp()')
    API.myPrize().then(res => {
      console.log('res', res)
      let prize = res.map(item => {
        const startDay = formatTime(item.created_at)
        const endDay = formatTime(new Date(item.created_at).getTime() + 1000 * 60 * 60 * 24)
        item.timeLimit = `${startDay}至${endDay}`
        return item
      })
      this.setData({
        prize: res
      })
    })
  },
  methods: {
    /**
     * @description 去填写信息
     * @param {Object} e 事件对象
     */
    toWriteInfo(e) {
      console.log('111', e)
      const { id } = e.currentTarget.dataset
      const find = this.data.prize.find(item => item.id === id)
      if (find && find.status) {
        console.log('信息已填写')
        tt.showToast({
          title: "奖品正在发出",
          duration: 2000
        });
      } else {
        console.log('record_id, 填信息', id)
        this.setData({
          record_id: id, 
          write_info: true
        })
      }
    },

    /**
     * @description 关闭信息填写窗口
     * @param {Object} e 事件对象
     */
    cancelInfoWin(e) {
      this.setData({write_info: e.detail})
    }
  }
})