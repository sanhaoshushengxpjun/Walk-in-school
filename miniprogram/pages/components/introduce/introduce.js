let app = getApp();
Page({
  data: {
    warn: "",
    name:"",
    school:"",
    sid:"",
    dep:"",
    phone: "",
    pwd: "",
    sex: "男"
  },


  buttonListener:function(){
    var that = this
    wx.navigateTo({
      // url: '/pages/components/jump/jump?e.detail.value.name=' + this.data.name + '&e.detail.value.school=' + this.data.school
    url:'/pages/components/jump/jump'
    }) 
  }, 


  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  schoolInput: function(e) {
    this.setData({
      school: e.detail.value
    });
  },
  depInput: function(e) {
    this.setData({
      dep: e.detail.value
    });
  },
  sidInput: function(e) {
    this.setData({
      sid: e.detail.value
    });
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  pwdInput: function(e) {
    this.setData({
      pwd: e.detail.value
    });
  },
  radioChange : function(e){
    this.setData({
      sex: e.detail.value
    }); 
  },
  handlog: function(e) {
    const db = wx.cloud.database()
    db.collection('logs').add({
      data: {
        name: this.data.name,
        school:this.data.school,
        dep:this.data.dep,
        sid:this.data.sid,
        phone:this.data.phone,
        pwd:this.data.pwd,
        sex:this.data.sex
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          name: e.detail.value.name,
          school: e.detail.value.school,
          dep: e.detail.value.dep,
          sid: e.detail.value.sid,
          phone: e.detail.value.phone,
          pwd: e.detail.value.pwd,
          sex: e.detail.value.sex,
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
   formReset: function () {
     console.log('form发生了reset事件')
   }
  
 })