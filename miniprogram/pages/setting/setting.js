var app = getApp();

  Page({
    data:{
      userinfo:{},
      openid:""
    },

    onGotUserInfo:function(e){
      const that = this
      wx.cloud.callFunction({
        name:"login",
        success:res=>{
          console.log("云函数调用成功")
          that.setData({
            openid:res.result.openid,
            userinfo: e.detail.userInfo
          })
          that.data.userinfo.openid = that.data.openid
          console.log("userinfo", that.data.userinfo)
          wx.setStorageSync("userinfo", that.data.userinfo)
        },
        fail:res=>{
          console.log("云函数调用失败")
        }
      })
    },

    onLoad:function(options){
      const ui = wx.getStorageSync('userinfo')
      this.setData({
        userinfo:ui,
        openid:ui.openid
      })
    },

    introduce: function () {
           wx.navigateTo({
             url: '../components/introduce/introduce'
           })
         },
         showRank: function () {
           wx.navigateTo({
             url: '../components/rank/rank'
           })
         },
         advice: function () {
              wx.navigateTo({
                 url: '../components/advice/advice'
               })
            },
            makeSugar: function () {
                 wx.navigateTo({
                    url: '../components/sugar/sugar'
                 })
                },
        

  })



