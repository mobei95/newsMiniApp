const {API, globalData} = getApp()

Page({
  data: {
    currentTab: 1
  },
  onLoad: function(option) {
    const { type } = option
    this.setData({currentTab: +type})
    console.log('welcome rule page', option)
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