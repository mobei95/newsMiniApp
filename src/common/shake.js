class Shake {
  constructor() {
    this._lastX = 0
    this._lastY = 0
    this._lastZ = 0
    this._isShake = false
  }


  /**
   * @description 开始摇一摇(开启加速度计监听)
   */
  startShake() {
    return new Promise((resolve, reject) => {
      tt.startAccelerometer({
        success: () => {
          resolve(true)
        },
        fail: () => {
          reject(false)
        }
      })
    })
  }

  /**
   * @description 加速度计变化
   * @param {Function} cb 
   */
  onShake({startCb, endCb}) {
    tt.onAccelerometerChange(res => {
      const accelerometet = res
      const { x, y, z } = accelerometet
      const { _lastX, _lastY, _lastZ } = this
      let range = Math.abs(x - _lastX) + Math.abs(y - _lastY) + Math.abs(z - _lastZ)
      console.log('range', range, range > 3, this._isShake)
      if(range > 3) {
        this._isShake = true
        startCb && startCb()
      }
      
      console.log('hhhhhh')
      if(range < 1 && this._isShake) {
        console.log('摇到了一个妹子')
        this.startShock()
        this.stopShake()
        endCb && endCb()
      }
      this._lastX = x
      this._lastY = y
      this._lastZ = z
    })
  }

  /**
   * @description 暂停加速度计监听
   */
  stopShake() {
    tt.stopAccelerometer({
      success: res => {
        console.log('自动stop', res)
        this._isShake = false
        this._lastX = 0
        this._lastY = 0
        this._lastZ = 0
      },
      fail: err => {
        console.log('err', err.errMsg)
      }
    })
  }

  /**
   * @description 开启手机震动
   */
  startShock() {
    tt.vibrateLong({
      success: () => {},
      fail: err => {
        console.log('震动失败', err)
      }
    })
  }

}


module.exports = Shake