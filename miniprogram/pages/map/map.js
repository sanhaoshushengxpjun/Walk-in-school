// pages/map/map.js

var amapFile = require('libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js
var myAmapFun = new amapFile.AMapWX({key:'f902c5375721de25853ece947a898817'});
Page({
  data: {
    markers: [],
    MarkerInfo:{},
    mylocation:{},
    latitude: '',
    longitude: '',
    textData: {},
    city: '',
    markerId: 0,
    tips:[],
    showview:true,
    controlId:null,
    controls: [
      //教室
      {
        id: 0,
        position: {
          left: wx.getSystemInfoSync().windowWidth - 65,
          top: 150,
          width: 65,
          height: 45
        ,},
        iconPath: "./img/jxl.png",
        clickable: true
      ,},
      //宿舍
      {
        id: 1,
        position: {
          left: wx.getSystemInfoSync().windowWidth -65,
          top: 210,
          width:65,
          height: 45
        ,},
        iconPath: "./img/ssl.png",
        clickable: true
      ,},
      //便利店
      {
        id: 2,
        position: {
          left: wx.getSystemInfoSync().windowWidth - 65,
          top: 270,
          width: 65,
          height: 45
        ,},
        iconPath: "./img/ggss.png",
        clickable: true
      ,},
      //返回当前位置
      {
        id: 3,
        position: {
          left: wx.getSystemInfoSync().windowWidth - 50,
          top: wx.getSystemInfoSync().windowHeight - 80 -40 - 100,
          width: 50,
          height: 50
        ,},
        iconPath: "./img/Initial_Position.png",
        clickable: true
      ,},
      
    ]
  },

  fetchData: function () {
    wx.request({
      url: 'https://tcb-api.tencentcloudapi.com',
      success:(res)=>{
        let results=res.data.results[0];
       this.setData({results});
      }
    })
  },
  //标签点击
  makertap: function(e) {
    var id = e.markerId;
    this.setData({markerId:id});
    var that = this;
    that.SetMarkerInfo(this.data.markers,id);
    that.  changeMarkerColor(this.data.markers,id,this.data.controlId);
  },

  onLoad: function() {
    var that = this;
    //获取当前详细位置
    myAmapFun.getRegeo({
      success:function(data){
        that.setData({
          mylocation:data[0],
          latitude:data[0].latitude,
          longitude:data[0].longitude,
          textData:{
            name:data[0].name,
            desc:data[0].desc,
          }
        });
      }
    })
   },
   //搜索框输入
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    if(keywords.length == 0 )  that.setData({showview:true})
    var myAmapFun = new amapFile.AMapWX({key: 'f902c5375721de25853ece947a898817'});
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function(data){
        
        if(data && data.tips){
          that.setData({
            tips: data.tips
          });
        }
        that.setData({showview:false});
      }
    })
  },
  //搜索框中项的点击
  backfill: function (e) {
    this.setData({      showview: true    });
    var id = e.currentTarget.id;
    var tips = this.data.tips;
    this.SetMarkerInfo(tips,id);
    var markers = [];
    markers.push(this.data.MarkerInfo);
    this.setData({markers:markers});

  },
  //设置最下部分详细内容
  SetMarkerInfo: function(data,i){
    var that = this;
    that.setData({
      MarkerInfo:data[i]
    });
    var MarkerInfo = this.data.MarkerInfo;
    //如果是搜索获得的tips对象里只有location键 ，需要向对象中加入经纬度键值对
    if(MarkerInfo.location != null){
      var latitude = "MarkerInfo.latitude";
      var longitude = "MarkerInfo.longitude";
      this.setData({
        [latitude]:parseFloat(this.strchange(MarkerInfo.location + "")[1]),
        [longitude]:parseFloat(this.strchange(MarkerInfo.location + "")[0]),
      });
    }
    let mpCtx = wx.createMapContext("map");
     mpCtx.moveToLocation({
      latitude: this.data.MarkerInfo.latitude ,
      longitude:this.data.MarkerInfo.longitude
    })
    this.showMarkerInfo(this.data.MarkerInfo)
  },
  //显示最下部分详细内容
  showMarkerInfo: function(data){
    var that = this;
    that.setData({
      textData: {
        name: data.name,
        desc: data.address
      }
    });
  },
  //改变标签颜色
   changeMarkerColor: function(data,i,controlId){
    var that = this;
    var markers = [];
    for(var j = 0; j < data.length; j++){
      if(j==i){
        data[j].iconPath = "img/marker_checked.png"; //如：..­/..­/img/marker_checked.png
      }else{
        switch(controlId){
          case 0:
            data[j].iconPath = "img/teacher.png"; //如：..­/..­/img/marker.png
            break;
          case 1:
            data[j].iconPath = "img/drom.png"; //如：..­/..­/img/marker.png
            break;
          case 2:
            data[j].iconPath = "img/shop.png"; //如：..­/..­/img/marker.png
            break;
        }
       
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  //获得路线
  getRoute() {
    // 起点
    let {mylocation,MarkerInfo } = this.data;
    mylocation = JSON.stringify(mylocation)
    MarkerInfo = JSON.stringify(MarkerInfo)
    let url = "../routes/routes?origin="+mylocation +"&destination="+MarkerInfo;
    wx.navigateTo({ url });
  },
  //控件点击
  clickcontrol(e) {
    var that = this;
    //显示太师教学楼
    if(e.controlId == 0){
      this.setData({controlId:e.controlId});
      var markers = 
      [
        {id:0,latitude:37.749271,longitude:112.718942,iconPath:"./img/marker_checked.png",width:22,height:32 ,name:"行思楼",address:"太原理工大学",callout:{content:"行思楼",display:"ALWAYS"},},
        {id:1,latitude:37.748851,longitude:112.719736,iconPath:"./img/teacher.png",width:22,height:32 ,name:"行逸楼",address:"太原理工大学",callout:{content:"行逸楼",display:"ALWAYS"},},
        {id:2,latitude:37.749457,longitude:112.724001,iconPath:"./img/teacher.png",width:22,height:32 ,name:"行知楼",address:"太原理工大学",callout:{content:"行知楼",display:"ALWAYS"},},
        {id:3,latitude:37.750255,longitude:112.725375,iconPath:"./img/teacher.png",width:22,height:32 ,name:"行远楼",address:"太原理工大学",callout:{content:"行远楼",display:"ALWAYS"},},
        {id:4,latitude:37.750064,longitude:112.724414,iconPath:"./img/teacher.png",width:22,height:32 ,name:"行勉楼",address:"太原理工大学",callout:{content:"行勉楼",display:"ALWAYS"},},
        {id:5,latitude:37.753371,longitude:112.724999,iconPath:"./img/teacher.png",width:22,height:32 ,name:"博睿楼",address:"太原理工大学",callout:{content:"博睿楼",display:"ALWAYS"},},
        {id:6,latitude:37.752671,longitude:112.716573,iconPath:"./img/teacher.png",width:22,height:32 ,name:"艺术学院",address:"太原理工大学",callout:{content:"艺术学院",display:"ALWAYS"},},
        {id:7,latitude:37.752646,longitude:112.720062,iconPath:"./img/teacher.png",width:22,height:32 ,name:"大数据学院",address:"太原理工大学",callout:{content:"大数据学院",display:"ALWAYS"},},
        {id:8,latitude:37.75195,longitude:112.720759,iconPath:"./img/teacher.png",width:22,height:32 ,name:"生物医学工程学院",address:"太原理工大学",callout:{content:"生物医学工程学院",display:"ALWAYS"},},
        {id:9,latitude:37.751899,longitude:112.719815,iconPath:"./img/teacher.png",width:22,height:32 ,name:"经济管理学院",address:"太原理工大学",callout:{content:"经济管理学院",display:"ALWAYS"},},
        {id:10,latitude:37.753642,longitude:112.724906,iconPath:"./img/teacher.png",width:22,height:32 ,name:"物理实验中心",address:"太原理工大学",callout:{content:"物理实验中心",display:"ALWAYS"},},
        {id:11,latitude:37.748112,longitude:112.719474,iconPath:"./img/teacher.png",width:22,height:32 ,name:"外语学院",address:"太原理工大学",callout:{content:"外语学院",display:"ALWAYS"},},
        {id:12,latitude:37.74793,longitude:112.720091,iconPath:"./img/teacher.png",width:22,height:32 ,name:"政法学院",address:"太原理工大学",callout:{content:"政法学院",display:"ALWAYS"},},
        {id:13,latitude:37.747035,longitude:112.720171,iconPath:"./img/teacher.png",width:22,height:32 ,name:"体育学院",address:"太原理工大学",callout:{content:"体育学院",display:"ALWAYS"},},
        {id:14,latitude:37.748268,longitude:112.723878,iconPath:"./img/teacher.png",width:22,height:32 ,name:"软件学院",address:"太原理工大学",callout:{content:"软件学院",display:"ALWAYS"},},
        {id:15,latitude:37.747068,longitude:112.724039,iconPath:"./img/teacher.png",width:22,height:32 ,name:"物理与光电工程学院",address:"太原理工大学",callout:{content:"物理与光电工程学院",display:"ALWAYS"},},
        {id:16,latitude:37.748629,longitude:112.724672,iconPath:"./img/teacher.png",width:22,height:32 ,name:"信息与计算机学院",address:"太原理工大学",callout:{content:"信息与计算机学院",display:"ALWAYS"},},
        {id:17,latitude:37.746559,longitude:112.722655,iconPath:"./img/teacher.png",width:22,height:32 ,name:"科技楼",address:"太原理工大学",callout:{content:"科技楼",display:"ALWAYS"},},
        {id:18,latitude:37.746512,longitude:112.724077,iconPath:"./img/teacher.png",width:22,height:32 ,name:"轻纺工程学院",address:"太原理工大学",callout:{content:"轻纺工程学院",display:"ALWAYS"},},
        {id:19,latitude:37.752171,longitude:112.720604,iconPath:"./img/teacher.png",width:22,height:32 ,name:"力学学院",address:"太原理工大学",callout:{content:"力学学院",display:"ALWAYS"},},
        {id:20,latitude:37.753146,longitude:112.724922,iconPath:"./img/teacher.png",width:22,height:32 ,name:"力学实验中心",address:"太原理工大学",callout:{content:"力学实验中心",display:"ALWAYS"},},
        {id:21,latitude:37.753664,longitude:112.725818,iconPath:"./img/teacher.png",width:22,height:32 ,name:"基础化学实验中心",address:"太原理工大学",callout:{content:"基础化学实验中心",display:"ALWAYS"},},
        {id:22,latitude:37.753125,longitude:112.725839,iconPath:"./img/teacher.png",width:22,height:32 ,name:"环工学院",address:"太原理工大学",callout:{content:"环工学院",display:"ALWAYS"},},
        {id:23,latitude:37.747573,longitude:112.724479,iconPath:"./img/teacher.png",width:22,height:32 ,name:"信息工程学院",address:"太原理工大学",callout:{content:"信息工程学院",display:"ALWAYS"},},
        {id:24,latitude:37.750232,longitude:112.712505,iconPath:"./img/teacher.png",width:22,height:32 ,name:"求真楼",address:"太原师范学院",callout:{content:"求真楼",display:"ALWAYS"},},
        {id:25,latitude:37.750241,longitude:112.710258,iconPath:"./img/teacher.png",width:22,height:32 ,name:"三行楼",address:"太原师范学院",callout:{content:"三行楼",display:"ALWAYS"},},
        {id:26,latitude:37.749734,longitude:112.706466,iconPath:"./img/teacher.png",width:22,height:32 ,name:"汇文书院",address:"太原师范学院",callout:{content:"汇文书院",display:"ALWAYS"},},
        {id:27,latitude:37.750245,longitude:112.710907,iconPath:"./img/teacher.png",width:22,height:32 ,name:"明理书院A栋",address:"太原师范学院",callout:{content:"明理书院A栋",display:"ALWAYS"},},
        {id:28,latitude:37.749469,longitude:112.712372,iconPath:"./img/teacher.png",width:22,height:32 ,name:"明理书院B栋",address:"太原师范学院",callout:{content:"明理书院B栋",display:"ALWAYS"},},
        {id:29,latitude:37.748506,longitude:112.711503,iconPath:"./img/teacher.png",width:22,height:32 ,name:"格物楼",address:"太原师范学院",callout:{content:"格物楼",display:"ALWAYS"},},
        {id:30,latitude:37.748319,longitude:112.712474,iconPath:"./img/teacher.png",width:22,height:32 ,name:"明辨楼",address:"太原师范学院",callout:{content:"明辨楼",display:"ALWAYS"},},
        {id:31,latitude:37.748676,longitude:112.710253,iconPath:"./img/teacher.png",width:22,height:32 ,name:"慎思楼",address:"太原师范学院",callout:{content:"慎思楼",display:"ALWAYS"},},
        {id:32,latitude:37.746758,longitude:112.707424,iconPath:"./img/teacher.png",width:22,height:32 ,name:"美瀛楼",address:"太原师范学院",callout:{content:"美瀛楼",display:"ALWAYS"},},
        {id:33,latitude:37.74717,longitude:112.706839,iconPath:"./img/teacher.png",width:22,height:32 ,name:"舞韵楼",address:"太原师范学院",callout:{content:"舞韵楼",display:"ALWAYS"},},
        {id:34,latitude:37.747157,longitude:112.705525,iconPath:"./img/teacher.png",width:22,height:32 ,name:"乐馨楼",address:"太原师范学院",callout:{content:"乐馨楼",display:"ALWAYS"},},
        {id:35,latitude:37.746101,longitude:112.709162,iconPath:"./img/teacher.png",width:22,height:32 ,name:"致远楼",address:"太原师范学院",callout:{content:"致远楼",display:"ALWAYS"},},

        {id:36,latitude:37.747256,longitude:112.728335,iconPath:"./img/teacher.png",width:22,height:32,name:"科研楼",address:"山西中医药大学",callout:{content:"科研楼",display:"ALWAYS"},},
        {id:37,latitude:37.751633,longitude:112.729944,iconPath:"./img/teacher.png",width:22,height:32,name:"硕博楼",address:"山西中医药大学",callout:{content:"硕博楼",display:"ALWAYS"},},
        {id:38,latitude:37.747826,longitude:112.731652,iconPath:"./img/teacher.png",width:22,height:32,name:"和济楼",address:"山西中医药大学",callout:{content:"和济楼",display:"ALWAYS"},},
        {id:39,latitude:37.749693,longitude:112.728091,iconPath:"./img/teacher.png",width:22,height:32,name:"知行书院",address:"山西中医药大学",callout:{content:"知行书院",display:"ALWAYS"},},
        {id:40,latitude:37.747206,longitude:112.730294,iconPath:"./img/teacher.png",width:22,height:32,name:"乙座实验楼",address:"山西中医药大学",callout:{content:"乙座实验楼",display:"ALWAYS"},},
        {id:41,latitude:37.750193,longitude:112.730911,iconPath:"./img/teacher.png",width:22,height:32,name:"仁济楼",address:"山西中医药大学",callout:{content:"仁济楼",display:"ALWAYS"},},
        {id:42,latitude:37.750154,longitude:112.732097,iconPath:"./img/teacher.png",width:22,height:32,name:"仁济书院乙座",address:"山西中医药大学",callout:{content:"仁济书院乙座",display:"ALWAYS"},},
        {id:43,latitude:37.750256,longitude:112.729307,iconPath:"./img/teacher.png",width:22,height:32,name:"仁爱楼",address:"山西中医药大学",callout:{content:"仁爱楼",display:"ALWAYS"},},
        ]
      this.setData({
        markers:markers,
      });
      // this.SetMarkerInfo(markers,0);
    }
    //显示太师宿舍楼
    if(e.controlId == 1){
      this.setData({controlId:e.controlId});
      var markers=[
        {id:0,latitude:37.751743,longitude:112.713422,iconPath:"./img/marker_checked.png.png",width:22,height:32 ,name:"启辰1号楼",address:"太原师范学院",callout:{content:"启辰1号楼" ,display:"ALWAYS"},},
        {id:1,latitude:37.752252,longitude:112.713406,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰2号楼",address:"太原师范学院",callout:{content:"启辰2号楼" ,display:"ALWAYS"},},
        {id:2,latitude:37.752791,longitude:112.713427,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰3号楼",address:"太原师范学院",callout:{content:"启辰3号楼" ,display:"ALWAYS"},},
        {id:3,latitude:37.752731,longitude:112.712569,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰4号楼",address:"太原师范学院",callout:{content:"启辰4号楼" ,display:"ALWAYS"},},
        {id:4,latitude:37.752248,longitude:112.712531,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰5号楼",address:"太原师范学院",callout:{content:"启辰5号楼" ,display:"ALWAYS"},},
        {id:5,latitude:37.751722,longitude:112.712558,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰6号楼",address:"太原师范学院",callout:{content:"启辰6号楼" ,display:"ALWAYS"},},
        {id:6,latitude:37.751331,longitude:112.711469,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰7号楼",address:"太原师范学院",callout:{content:"启辰7号楼" ,display:"ALWAYS"},},
        {id:7,latitude:37.751802,longitude:112.711502,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰8号楼",address:"太原师范学院",callout:{content:"启辰8号楼" ,display:"ALWAYS"},},
        {id:8,latitude:37.752248,longitude:112.711507,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰9号楼",address:"太原师范学院",callout:{content:"启辰9号楼" ,display:"ALWAYS"},},
        {id:9,latitude:37.752812,longitude:112.711523,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰10号楼",address:"太原师范学院",callout:{content:"启辰10号楼" ,display:"ALWAYS"},},
        {id:10,latitude:37.753219,longitude:112.711459,iconPath:"./img/drom.png",width:22,height:32 ,name:"启辰11号楼",address:"太原师范学院",callout:{content:"启辰11号楼" ,display:"ALWAYS"},},
        {id:11,latitude:37.752606,longitude:112.705607,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华1号楼",address:"太原师范学院",callout:{content:"聚华1号楼" ,display:"ALWAYS"},},
        {id:12,latitude:37.752139,longitude:112.705629,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华2号楼",address:"太原师范学院",callout:{content:"聚华2号楼" ,display:"ALWAYS"},},
        {id:13,latitude:37.751686,longitude:112.705624,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华3号楼",address:"太原师范学院",callout:{content:"聚华3号楼" ,display:"ALWAYS"},},
        {id:14,latitude:37.753056,longitude:112.706525,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华4号楼",address:"太原师范学院",callout:{content:"聚华4号楼" ,display:"ALWAYS"},},
        {id:15,latitude:37.752352,longitude:112.706525,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华5号楼",address:"太原师范学院",callout:{content:"聚华5号楼" ,display:"ALWAYS"},},
        {id:16,latitude:37.751915,longitude:112.706493,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华6号楼",address:"太原师范学院",callout:{content:"聚华6号楼" ,display:"ALWAYS"},},
        {id:17,latitude:37.751410,longitude:112.706541,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华7号楼",address:"太原师范学院",callout:{content:"聚华7号楼" ,display:"ALWAYS"},},
        {id:18,latitude:37.752693,longitude:112.707301,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华8号楼",address:"太原师范学院",callout:{content:"聚华8号楼" ,display:"ALWAYS"},},
        {id:19,latitude:37.752231,longitude:112.707366,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华9号楼",address:"太原师范学院",callout:{content:"聚华9号楼" ,display:"ALWAYS"},},
        {id:20,latitude:37.751717,longitude:112.707285,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华10号楼",address:"太原师范学院",callout:{content:"聚华10号楼" ,display:"ALWAYS"},},
        {id:21,latitude:37.751285,longitude:112.707317,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华11号楼",address:"太原师范学院",callout:{content:"聚华11号楼" ,display:"ALWAYS"},},
        {id:22,latitude:37.753022,longitude:112.707372,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华12号楼",address:"太原师范学院",callout:{content:"聚华12号楼" ,display:"ALWAYS"},},
        {id:23,latitude:37.752954,longitude:112.704658,iconPath:"./img/drom.png",width:22,height:32 ,name:"聚华13号楼",address:"太原师范学院",callout:{content:"聚华13号楼" ,display:"ALWAYS"},},
        {id:24,latitude:37.753017,longitude:112.705656,iconPath:"./img/drom.png",width:22,height:32 ,name:"教工公寓",address:"太原师范学院",callout:{content:"教工公寓" ,display:"ALWAYS"},},
        
        {id:25,latitude:37.747038,longitude:112.725326,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑1号楼",address:"太原理工大学",callout:{content:"明泽苑1号楼" ,display:"ALWAYS"},},
        {id:26,latitude:37.747467,longitude:112.725401,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑2号楼",address:"太原理工大学",callout:{content:"明泽苑2号楼" ,display:"ALWAYS"},},
        {id:27,latitude:37.747904,longitude:112.72538,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑3号楼",address:"太原理工大学",callout:{content:"明泽苑3号楼" ,display:"ALWAYS"},},
				{id:28,latitude:37.748324,longitude:112.725487,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑4号楼",address:"太原理工大学",callout:{content:"明泽苑4号楼" ,display:"ALWAYS"},},
				{id:29,latitude:37.748744,longitude:112.725503,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑5号楼",address:"太原理工大学",callout:{content:"明泽苑5号楼" ,display:"ALWAYS"},},
				{id:30,latitude:37.747925,longitude:112.717886,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑6号楼",address:"太原理工大学",callout:{content:"明泽苑6号楼" ,display:"ALWAYS"},},
				{id:31,latitude:37.748391,longitude:112.718095,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑7号楼",address:"太原理工大学",callout:{content:"明泽苑7号楼" ,display:"ALWAYS"},},
				{id:32,latitude:37.748756,longitude:112.718041,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑8号楼",address:"太原理工大学",callout:{content:"明泽苑8号楼" ,display:"ALWAYS"},},
				{id:33,latitude:37.749261,longitude:112.717714,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑9号楼",address:"太原理工大学",callout:{content:"明泽苑9号楼" ,display:"ALWAYS"},},
				{id:34,latitude:37.749655,longitude:112.717714,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑10号楼",address:"太原理工大学",callout:{content:"明泽苑10号楼" ,display:"ALWAYS"},},
				{id:35,latitude:37.749303,longitude:112.716711,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑11号楼",address:"太原理工大学",callout:{content:"明泽苑11号楼" ,display:"ALWAYS"},},
				{id:36,latitude:37.749639,longitude:112.716652,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑12号楼",address:"太原理工大学",callout:{content:"明泽苑12号楼" ,display:"ALWAYS"},},
				{id:37,latitude:37.750063,longitude:112.716448,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑13号楼",address:"太原理工大学",callout:{content:"明泽苑13号楼" ,display:"ALWAYS"},},
				{id:38,latitude:37.750461,longitude:112.716453,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑14号楼",address:"太原理工大学",callout:{content:"明泽苑14号楼" ,display:"ALWAYS"},},
				{id:39,latitude:37.750818,longitude:112.716662,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑15号楼",address:"太原理工大学",callout:{content:"明泽苑15号楼" ,display:"ALWAYS"},},
				{id:40,latitude:37.752094,longitude:112.718996,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑16号楼",address:"太原理工大学",callout:{content:"明泽苑16号楼" ,display:"ALWAYS"},},
				{id:41,latitude:37.752519,longitude:112.718953,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑17号楼",address:"太原理工大学",callout:{content:"明泽苑17号楼" ,display:"ALWAYS"},},
				{id:42,latitude:37.752883,longitude:112.719248,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑18号楼",address:"太原理工大学",callout:{content:"明泽苑18号楼" ,display:"ALWAYS"},},
				{id:43,latitude:37.753384,longitude:112.719109,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑19号楼",address:"太原理工大学",callout:{content:"明泽苑19号楼" ,display:"ALWAYS"},},
				{id:44,latitude:37.752967,longitude:112.721690,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑20号楼",address:"太原理工大学",callout:{content:"明泽苑20号楼" ,display:"ALWAYS"},},
				{id:45,latitude:37.752988,longitude:112.722414,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑21号楼",address:"太原理工大学",callout:{content:"明泽苑21号楼" ,display:"ALWAYS"},},
        {id:46,latitude:37.753433,longitude:112.722001,iconPath:"./img/drom.png",width:22,height:32 ,name:"明泽苑22号楼",address:"太原理工大学",callout:{content:"明泽苑22号楼" ,display:"ALWAYS"},},

        {id:47,latitude:37.751902,longitude:112.729340,iconPath:"./img/drom.png",width:22,height:32,name:"杏园甲座",address:"山西中医药大学",callout:{content:"杏园甲座",display:"ALWAYS"},},
        {id:48,latitude:37.751465,longitude:112.729307,iconPath:"./img/drom.png",width:22,height:32,name:"杏园乙座",address:"山西中医药大学",callout:{content:"杏园乙座",display:"ALWAYS"},},
        {id:49,latitude:37.751045,longitude:112.729307,iconPath:"./img/drom.png",width:22,height:32,name:"杏园丙座",address:"山西中医药大学",callout:{content:"杏园丙座",display:"ALWAYS"},},
        {id:50,latitude:37.751906,longitude:112.730922,iconPath:"./img/drom.png",width:22,height:32,name:"杏园丁座",address:"山西中医药大学",callout:{content:"杏园丁座",display:"ALWAYS"},},
        {id:51,latitude:37.751478,longitude:112.730927,iconPath:"./img/drom.png",width:22,height:32,name:"杏园戊座",address:"山西中医药大学",callout:{content:"杏园戊座",display:"ALWAYS"},},
        {id:52,latitude:37.751020,longitude:112.730901,iconPath:"./img/drom.png",width:22,height:32,name:"杏园己座",address:"山西中医药大学",callout:{content:"杏园己座",display:"ALWAYS"},},
        {id:53,latitude:37.751974,longitude:112.732258,iconPath:"./img/drom.png",width:22,height:32,name:"杏园庚座",address:"山西中医药大学",callout:{content:"杏园庚座",display:"ALWAYS"},},
        {id:54,latitude:37.751588,longitude:112.732274,iconPath:"./img/drom.png",width:22,height:32,name:"杏园辛座",address:"山西中医药大学",callout:{content:"杏园辛座",display:"ALWAYS"}, },
      ];
      this.setData({
        markers:markers,
      });
      // this.SetMarkerInfo(markers,0);
    }
    //显示公共设施
    if(e.controlId == 2){
      this.setData({controlId:e.controlId});
      var markers =[
        {id:0,latitude:37.749445,longitude:112.721245,iconPath:"./img/marker_checked.png",width:22,height:32 ,name:"明向校区图书馆",     address:"太原理工大学",callout:{content:"明向校区图书馆",display:"ALWAYS"},},
        {id:1,latitude:37.749469,longitude:112.725359,iconPath:"./img/shop.png",width:22,height:32 ,name:"第一餐厅",           address:"太原理工大学",callout:{content:"第一餐厅",display:"ALWAYS"},},
        {id:2,latitude:37.750254,longitude:112.717993,iconPath:"./img/shop.png",width:22,height:32 ,name:"静雅轩第二食堂",     address:"太原理工大学",callout:{content:"静雅轩第二食堂",display:"ALWAYS"},},
        {id:3,latitude:37.753418,longitude:112.720515,iconPath:"./img/shop.png",width:22,height:32 ,name:"第三餐厅",           address:"太原理工大学",callout:{content:"第三餐厅",display:"ALWAYS"},},

        {id:4,latitude:37.749760,longitude:112.708831,iconPath:"./img/shop.png",width:22,height:32 ,name:"图书馆", address:"太原师范学院",callout:{content:"图书馆",display:"ALWAYS"},},
        {id:5,latitude:37.750763,longitude:112.712911,iconPath:"./img/shop.png",width:22,height:32 ,name:"启辰餐厅",           address:"太原师范学院",callout:{content:"启辰餐厅",display:"ALWAYS"},},
        {id:6,latitude:37.750971,longitude:112.705567,iconPath:"./img/shop.png",width:22,height:32 ,name:"聚华餐厅",           address:"太原师范学院",callout:{content:"聚华餐厅",display:"ALWAYS"},},

        {id:7,latitude:37.748994,longitude:112.729177,iconPath:"./img/shop.png",width:22,height:32,name:"杏林图书馆",address:"山西中医药大学",callout:{content:"杏林图书馆",display:"ALWAYS"},},
        {id:8,latitude:37.750351,longitude:112.733468,iconPath:"./img/shop.png",width:22,height:32,name:"杏林体育场",address:"山西中医药大学",callout:{content:"杏林体育场",display:"ALWAYS"},},
       {id:9,latitude:37.747519,longitude:112.730727,iconPath:"./img/shop.png",width:22,height:32,name:"傅山广场",address:"山西中医药大学",callout:{content:"傅山广场",display:"ALWAYS"},},
       {id:10,latitude:37.747520,longitude:112.732640,iconPath:"./img/shop.png",width:22,height:32,name:"活动中心",address:"山西中医药大学",callout:{content:"活动中心",display:"ALWAYS"},},
       {id:11,latitude:37.751168,longitude:112.732285,iconPath:"./img/shop.png",width:22,height:32,name:"餐厅",address:"山西中医药大学",callout:{content:"餐厅",display:"ALWAYS"},},
       {id:12,latitude:37.749353,longitude:112.733583,iconPath:"./img/shop.png",width:22,height:32,name:"杏林体育馆",address:"山西中医药大学",callout:{content:"杏林体育馆",display:"ALWAYS"},},
      ];
      this.setData({
        markers:markers,
      });
      // this.SetMarkerInfo(markers,0);
    }
    //回归定位点
    if(e.controlId == 3){
      let mpCtx = wx.createMapContext("map");
      mpCtx.moveToLocation();
      this.setData({
        textData:{
          name:this.data.mylocation.name,
          desc:this.data.mylocation.desc,
        }
      })
    }  
  },
  //地图点击
  mapclick(e){
    // var latitude =(parseFloat(e.detail.latitude)).toFixed(6);
    var that = this;
    var latitude =e.detail.latitude;
    var longitude =e.detail.longitude;
    console.log(latitude+","+longitude)
    var myAmapFun = new amapFile.AMapWX({key:'f902c5375721de25853ece947a898817'});
    var markers = [];
    myAmapFun.getRegeo({
      iconPath:"img/marker_checked.png",
      width:20,
      height:25,
      location:longitude +","+latitude,
      success:function(data){
        var tempobj = {
          latitude:latitude,
          longitude:longitude,
          iconPath:data[0].iconPath,
          width:22,
          height:32,
          name:data[0].name,
          address:data[0].desc,
          id:0,
        };
        markers.push(tempobj);
        that.setData({markers:markers});
        that.SetMarkerInfo(that.data.markers,0)
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  strchange(str){
    var list=[];
    list = str.split(",");
    return list;
  }
})



