Component({
  properties: {
    visible: {
      type: Boolean,
      default: false
    },
    prizeInfo: {
      type: Object,
      default: {}, // 包含type，prize，type：1: 中奖，2：未中奖，3: 没有机会了
      observer: (newVal, oldVal) => {
        console.log('newVal', newVal)
        console.log('oldVal', oldVal)
      }
    }
  },
  data: {},
  methods: {
    /**
     * 关闭窗口
     */
    cancelWin() {
      this.triggerEvent("cancel", false, { bubbles: true })
    }
  }
})