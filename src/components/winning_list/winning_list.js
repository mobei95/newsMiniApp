import { formatTime } from '../../utils/util'
const { API, globalData } = getApp()
Component({
  properties: {},
  data: {
    page: 1,
    page_size: 20,
    total: 0,
    winiingList: [],
    isMore: false,
    isLoading: false
  },
  attached() {
    console.log('attached')
    this.setData({isLoading: true})
    this.getWinningHistory()
  },
  methods: {
    /**
     * @description 获取中奖记录
     */
    async getWinningHistory() {
      const { page, page_size, winiingList } = this.data
      API.winningListApi({page, page_size}).then(result => {
        const { data, total } = result
        const isMore = page < Math.ceil(total / page_size)
        let newWiniingList = data.map(item => {
          const timeArr = formatTime(item.created_at).split(' ')
          item.date = timeArr[0]
          item.time = timeArr[1]
          return item
        })
        this.setData({
          winiingList: [...winiingList, ...newWiniingList],
          total, 
          isMore,
          isLoading: false
        })
      }).catch(err => {

      })
    },

    /**
     * @description 滚动条触底
     */
    scrollOver(e) {
      console.log('到底了', e, this.data.isMore)
      let { isMore, page } = this.data
      if (isMore) {
        this.setData({page: ++page, isLoading: true})
        this.getWinningHistory()
      }
    }
  }
})