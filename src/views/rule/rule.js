const {API, globalData} = getApp()

Page({
  data: {
    currentTab: 1,
    contentHeight: null
  },
  onLoad: function(option) {
    const { type } = option
    this.setData({currentTab: +type})
    console.log('welcome rule page', option)
  },

  onReady: function() {
    const { windowHeight, baseRpx, basePx } = globalData.systemInfo
    const rpxHeight = windowHeight * basePx 
    const rpxContentHeight = rpxHeight - (340 + 44 + 70 + 30) // 340是头图的高度，44是main的上下paddinng，70是tab-bar的高度，
    const contentHeight = rpxContentHeight * baseRpx
    this.setData({contentHeight})
  },

  /**
   * @description 切换tab
   */
  tabChange(e) {
    console.log('change', e)
    this.setData({currentTab: e.detail})
    console.log(this.data.currentTab)
  }
})