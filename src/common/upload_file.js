import { fileHost } from '../config/index'
import qiniuUploader from '../utils/qiniu_uploader'
import API from '../service/api'


class UploadFile {
  constructor() {
    this.init()
  }

  /**
   * @description 获取上传token
   * @returns {String} token
   */
  async getToken() {
    return await API.qiniuToken()
  }

  /**
   * @description 初始化七牛云配置
   * @param {Object} options
   */
  async init() {
    const uptoken = await this.getToken()
    // console.log('uptoken', uptoken)
    const options = {
      region: 'SCN',
      uptoken,
      domain: fileHost,
      shouldUseQiniuFileName: false
    }
    qiniuUploader.init(options)
  }

  /**
   * @description 选择图片文件
   * @param {Object} 
   */
  chooseImage(count = 1, sourceType = ['album']) {
    return new Promise((resolve, reject) => {
      tt.chooseImage({
        count,
        sourceType,
        success: res => {
          const { tempFilePaths, tempFiles } = res
          resolve({ tempFilePaths, tempFiles })
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }

  /**
   * @description 上传图片
   * @param {String} filePath
   */
  uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      qiniuUploader.upload(filePath, res => {
        // console.log('res', res)
        resolve(res)
      }, err => {
        console.log('upload', err)
        reject(err)
      })
    })
    
  }
}

export default new UploadFile()