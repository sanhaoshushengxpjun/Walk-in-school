const app = getApp()
const now = new Date();
const month = now.getMonth() + 1 //月份需要+1
const day = now.getDate()

Page({

  data: {
    str:'',
    page:0
  },

  onLoad: function (options) {
      let that =this
      wx.request({
        url: 'http://api.juheapi.com/japi/toh?'+"month="+month+"&day="+day+"&key="+app.globalData.juheKey,
        data:{
            month:month,
            day:day,
            key:app.globalData.juheKey,
        },
        header:{
          'content-type':'application/json'
        },
        success(res){
          console.log(res.data.result)
          that.setData({
            str:res.data.result
          })
        }
      })
  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  } 
})