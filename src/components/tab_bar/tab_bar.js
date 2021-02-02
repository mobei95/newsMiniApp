Component({
  properties: {
    currentKey: {
      type: Number,
      default: 1
    }
  },
  data: {
    // currentKey: 1
  },
  methods: {
    /**
     * @description 点击tab
     */
    touchTab(e) {
      const { key } = e.target.dataset
      this.setData({currentKey: +key})
      this.emeitEvent(+key)
    },

    /**
     * @description 向父级广播事件
     */
    emeitEvent(key) {
      this.triggerEvent("change", key, { bubbles: true })
    }
  }
})