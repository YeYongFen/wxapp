import http from './utils/http.js'
import EventEmitter from 'events'

//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    this.login()
      .then(() => {
        return this.getSetting()
      })
      .then(() => {
        return this.getUserInfo()
      })
      .then((userInfo) => {
        this.globalData.userInfo = userInfo
        this.emitter.emit('update')
      })
      .catch(e => {
        console.log(e)
      })
  },


  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          var code = res.code;
          if (code) {
            http.get('http://localhost:8888/oauth/login', {
              code
            }).then(resp => {
              if (resp.status == 'success') {
                this.globalData.openid = resp.openid
                resolve()
              }else{
                reject()
              }
            }).catch(e => {
              console.log(e)
              reject()
            })
          } else {
            console.log('获取用户登录态失败：' + res.errMsg);
            reject();
          }
          
        },
        fail: () => {
          reject()
        }
      });
    })
  },

  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: res => {
          //this.globalData.userInfo = res.userInfo
          resolve(res.userInfo)
        },
        fail: () => {
          reject()
        }
      })
    })
  },

  getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            resolve()
          } else {
            reject()
          }
        },
        fail: () => {
          reject()
        }
      })
    })
  },

  emitter: new EventEmitter(),


  globalData: {
    userInfo: null,


  }
})