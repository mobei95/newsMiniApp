import { formatTime } from '../../utils/util'
const { API, globalData } = getApp()
Component({
  properties: {},
  data: {
    write_info: false,
    record_id: '',
    prize: []
  },
  attached() {
    API.myPrize().then(result => {
      console.log('res111', result)
      let prize = result.map(item => {
        const createdAt = item.created_at.replace(/\-/g, '/')
        const startDay = formatTime(createdAt).split(' ')[0]
        const endTime = new Date(createdAt).getTime() + (1000 * 60 * 60 * 24)
        const endDay = formatTime(endTime).split(' ')[0]
        item.timeLimit = `${startDay}至${endDay}`
        return item
      })
      this.setData({
        prize
      })
    }).catch(err => {
      console.log('err', err)
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

      // 测试内容start
      // this.setData({
      //   record_id: id, 
      //   write_info: true
      // })
      // 测试内容end

      if (find && find.status && find.status < 3) {
        console.log('信息已填写')
        tt.showToast({
          title: "奖品正在发出",
          duration: 2000
        });
      } else {
        console.log('record_id, 填信息', id)
        const maxTime = new Date(find.created_at.replace(/\-/g, '/').getTime() + (1000 * 60 * 60 * 24)).getTime() // 过期时间
        const currentTime = new Date().getTime()
        if (currentTime >= maxTime || find.status >= 3) {
          tt.showToast({
            title: "奖品已过期",
            icon: 'fail',
            duration: 2000
          });
        } else {
          this.setData({
            record_id: id, 
            write_info: true
          })
        }
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