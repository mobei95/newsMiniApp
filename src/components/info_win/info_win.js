import UPLOAD from "../../common/upload_file"
import {fileHost} from "../../config/index"
const { API, globalData } = getApp()
Component({
  properties: {
    visible: {
      type: Boolean,
      default: false
    },
    record_id: String | Number
  },
  data: {
    uploadImgSrc: null,
    imgKey: null,  // 截图上传后的key
    contentTop: null,
    imgMarTop: null,
    cancelTop: null
  },
  attached() {
    const { baseVh, baseRpx } = globalData.systemInfo
    const contentTop = 280 * baseRpx
    const cancelTop = 1100 * baseRpx
    const imgMarTop = baseVh * 7
    this.setData({
      contentTop,
      imgMarTop,
      cancelTop
    })
  },
  methods: {
    /**
     * @description 参数校验
     */
    checkParam(e) {
      const type = e.target.dataset.type
      console.log('params', e)
    },
    
    /**
     * @description 名称校验
     */
    checkName(str) {
      const reg = /^ [\u4e00 - \u9fa5] | [a-zA-Z]$/ 
      const check = str && str.length < 10
      if (!check) {
        tt.showToast({
          title: '名称格式不正确',
          icon: 'fail',
          duration: 2000
        })
        return false
      }
      return true
    },

    /**
     * @description 手机号码校验
     */
    checkPhone(phone) {
      const reg = /^1[3456789]\d{9}$/
      const check = reg.test(phone)
      if (!check) {
        tt.showToast({
          title: '手机号格式不正确',
          icon: 'fail',
          duration: 2000
        })
        return false
      }
      return true
    },

    /**
     * @description 地址信息校验
     */
    checkLocal(str) {
      if (!str || str.length < 8) {
        tt.showToast({
          title: '地址格式不正确',
          icon: 'fail',
          duration: 2000
        })
        return false
      }
      return true
    },

    /**
     * @description 图片信息校验
     */
    checkScreenshot() {
      if (!this.data.imgKey) {
        tt.showToast({
          title: '请上传截图',
          icon: 'fail',
          duration: 2000
        })
        return false
      }
      return true
    },

    /**
     * @description 上传截图
     */
    async uploadScreenshot() {
      const chooseResult = await UPLOAD.chooseImage()
      const filePath = chooseResult.tempFilePaths[0]
      console.log('filePath', filePath)
      UPLOAD.uploadImage(filePath).then(res => {
        console.log('UPLOAD', res)
        const { key } = res
        const uploadImgSrc = `${fileHost}${key}`
        console.log('`${fileHost}${imgKey}`', fileHost, key, `${fileHost}${key}`)
        this.setData({imgKey: key, uploadImgSrc})
      })
    },

    /**
     * @description 提交表单
     */
    submit(e) {
      console.log('submit', e, this.data)
      const {name, mobile, address} = e.detail.value
      if (this.checkName(name) && this.checkPhone(mobile) && this.checkLocal(address) && this.checkScreenshot()) {
        const { imgKey, record_id } = this.data
        API.submitInfoApi({name, mobile, address, screenshot: imgKey, record_id}).then(res => {
          console.log('信息提交成功', res)
          tt.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          tt.navigateTo({
            url: `/src/views/index/index`
          })
        })
      }
    },

    /**
     * @description 返回抖音
     */
    backVideo() {

    },

    /**
     * 关闭窗口
     */
    cancelWin() {
      this.triggerEvent("cancel", false, { bubbles: true })
    }
  }
})