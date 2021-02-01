import { get, post } from './methods'


export default {
  // 发送登录凭证
  sendLoginCode: params => get('/auth/login', params),

  // 获取七牛云token
  qiniuToken: () => get(`/tool/qiniu/token?bucket=xinhuanet`),

  // 查询剩余抽奖次数
  lastCountApi: () => get('/activity/leftTimes'),

  // 抽奖
  lotteryApi: () => post('/activity/draw'),

  // 提交收货信息
  submitInfoApi: params => post('/activity/address/fill', params),
  
  // 查询我的奖品
  myPrize: () => post('/activity/awards/my')
}