const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    name:"",
    school:"",
    sid:"",
    dep:"",
    phone: "",
    pwd: "",
    sex: " ",
    information:[],
    _openid:"",
    detail : {},
    isFriend : false,
    isVisual:true
  },

  onLoad: function (options) {
    let userId =options.userId
    db.collection('users').doc(userId).get().then((res)=>{
      this.setData({
        detail:res.data
      });
      let friendList = res.data.friendList;
      if(friendList.includes(app.userInfo[0]._id)){
        this.setData({
          isFriend:true
        });
      }else{
        if(userId == app.userInfo[0]._id){
          this.setData({
            isFriend:true,
            isVisual:false
          })
        }
      }
    })
},


onLoad: function() {
  let that = this

  wx.cloud.callFunction({
    name:"login",
    success:res=>{
      console.log("调用云函数成功,openid为："+res.result.openid)
      db.collection('logs').where({
        _openid:res.result.openid
      }).get({
        success:function(res){
         console.log('获取数据成功',res)
          that.setData({
            information: res.data
          })
        } ,fail:function(res){
          console.log('获取数据失败',res)
        }
  })
    },
    fail:res=>{
      console.log("调用云函数失败")
    }
  })
  }
})