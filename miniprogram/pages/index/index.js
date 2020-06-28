//index.js
const db = wx.cloud.database()
const _ = db.command

Page({

  navigateToData1: function () {
    wx.navigateTo({
      url: '/pages/basic/basic',
    })},

  data: {
    disabled:false,
    seats:[],
    //日期选择：
    multiArray:[ {id:0,name:'星期一'},{id:1,name:'星期二'}, {id:2,name:'星期三'}, {id:3,name:'星期四'}, {id:4,name:'星期五'}, {id:5,name:'星期六'}, {id:6,name:'星期日'}],
    multiIndex: 0,
    /**
     * 
     */
    array:[ {id:0,name:"上午"}, {id:1,name:'下午'},{id:2,name:'晚上'}],
    index: 0
  },
  bindPickerChange0: function(e) {
    console.log('星期选择为：',e.detail.value)
    this.setData({
      multiIndex: this.data.multiArray[e.detail.value].id
    })
  },
  /**
   * 时间选择
   */
  bindPickerChange1: function(e) {
    console.log('时间选择为第:', e.detail.value)
    this.setData({
      index: this.data.array[e.detail.value].id
    })
  },
onLoad:function(){
  const that = this
  console.log("星期选择" +this.data.multiIndex)
  console.log("时间选择" +this.data.index)
wx.cloud.callFunction({
  name:"dbsearch",
  data:{
    day:this.data.multiIndex,
    time:this.data.index
  },
  success:function(res){
    console.log('数据库获取成功',res)
    that.setData({
      seats:res.result.data
    })
  },fail:function(res){
    console.log('数据库获取失败',res)
  }
})
},
updata:function(){
  this.setData({
    disabled:false
  })
  console.log("星期选择" +this.data.multiIndex)
  console.log("时间选择" +this.data.index)
  wx.cloud.callFunction({
    name:"dbupdata",
    data:{
      day:this.data.multiIndex,
      time:this.data.index
    },
    success:function(res){
      console.log('数据库更新成功',res)
    },fail:function(res){
      console.log('数据库更新失败',res)
    }
  })
},
 add:function(){
  this.setData({
    disabled:true
  })
  console.log("星期选择" +this.data.multiIndex)
  console.log("时间选择" +this.data.index)
  wx.cloud.callFunction({
    name:"add",
    data:{
      day:this.data.multiIndex,
      time:this.data.index
    },
    success:function(res){
      console.log('数据库更新成功',res)
    },fail:function(res){
      console.log('数据库更新失败',res)
    }
  })
}
})
