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
        item.timeLimit = `${item.receive_start.replace(/\-/g, '/')}至${item.receive_end.replace(/\-/g, '/')}`
        item.statusTxt = item.status ? item.status === 3 ? '奖品已过期' : '信息已填写' : '填写收件信息'
        return item
      })
      console.log('prize', prize)
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
      const { id, type } = e.currentTarget.dataset
      console.log('111', e, type)
      if (type) {
        this.setData({
          record_id: id, 
          write_info: true
        })
      }
      // const find = this.data.prize.find(item => item.id === id)

      // 测试内容start
      // this.setData({
      //   record_id: id, 
      //   write_info: true
      // })
      // 测试内容end

      // if (find && find.status && find.status < 3) {
      //   console.log('信息已填写')
      //   tt.showToast({
      //     title: "奖品正在发出",
      //     duration: 2000
      //   });
      // } else {
      //   console.log('record_id, 填信息', id, )
      //   const createTime = new Date(find.created_at.replace(/\-/g, '/')).getTime()
      //   console.log('newDate', createTime)
      //   const maxTime = new Date(createTime + (1000 * 60 * 60 * 48)).getTime() // 过期时间48小时
      //   console.log('maxTime', maxTime)
      //   const currentTime = new Date().getTime()
      //   if (currentTime >= maxTime || find.status >= 3) {
      //     tt.showToast({
      //       title: "奖品已过期",
      //       icon: 'fail',
      //       duration: 2000
      //     });
      //   } else {
      //     console.log('校验成功')
      //     this.setData({
      //       record_id: id, 
      //       write_info: true
      //     })
      //   }
      // }
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