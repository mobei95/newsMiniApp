const {API, globalData} = getApp()

Page({
  data: {
    currentTab: 1
  },
  onLoad: function() {
    console.log('welcome rule page')
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