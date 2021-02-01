import { formatTime } from '../../utils/util'
const { API, globalData } = getApp()
Component({
  properties: {},
  data: {
    scrollHeight: null,
  },
  attached() {},
  ready() {
    console.log('ready')
    const { windowHeight, pixelRatio } = globalData.systemInfo
    const rpxHeight = windowHeight * pixelRatio


    // 
    const query = tt.createSelectorQuery()
    query.select('.rule-page-head').boundingClientRect()
    query.exec(res => {
      const headHeight = res[0].height * pixelRatio
      const scrollHeight = rpxHeight - headHeight - 44 - 60 - 70
      console.log('rpxHeight', rpxHeight, headHeight)
      console.log('contentRef', scrollHeight)
      this.setData({scrollHeight})
    })
    
  },
  methods: {}
})