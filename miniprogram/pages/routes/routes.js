//logs.js
let util = require('../../utils/util.js');
let wechat = require("../../utils/wechat");
let amap = require("../../utils/amap");
var amapFile = require("../map/libs/amap-wx.js");//如：..­/..­/libs/amap-wx.js
Page({
  data: {
    cindex: "0",
    types: ["getWalkingRoute", "getRidingRoute"],
    markers: [],
    polyline: [],
    distance: '',
    cost: '',
    transits: [],
    Course_details:null,
  },
  onLoad(e) {
    var origin = JSON.parse(e.origin)
    var destination = JSON.parse(e.destination)
    let markers = [
      {
        iconPath: "/img/mapicon_navi_s.png",
        id: 0,
        latitude:origin.latitude,
        longitude:origin.longitude,
        width: 23,
        height: 33
      }, {
        iconPath: "/img/mapicon_navi_e.png",
        id: 1,
        latitude: destination.latitude,
        longitude: destination.longitude,
        width: 24,
        height: 34
      }
    ];

    this.setData({
      markers,
      origin,
      destination,
      latitude:origin.latitude,
      longitude:origin.longitude,
    });
    this.getRoute();
  },
  changeType(e) {
    let { id } = e.target.dataset;
    let { cindex } = this.data;
    if (id == cindex) return;
    this.setData({ cindex: id });
    this.getRoute();
  },
  getRoute() {
    var that = this;
    let {origin, destination,types,cindex} = this.data;
    let type = types[cindex];
    let origin_location = `${origin.longitude},${origin.latitude}`;
    let destination_location = `${destination.longitude},${destination.latitude}`;
    amap.getRoute(origin_location, destination_location, type, "")
      .then(data => {
        that.setRouteData(data, type);
        console.log(data)
        this.setData({Course_details:data});
      })
      .catch(e => {
        console.log("错误信息",e);
      })
    
  },
  setRouteData(d, type) {
    if (type != "getTransitRoute") {
      let points = [];
      if (d.paths && d.paths[0] && d.paths[0].steps) {
        let steps = d.paths[0].steps;
        wx.setStorageSync("steps", steps);
        steps.forEach(item1 => {
          let poLen = item1.polyline.split(';');
          poLen.forEach(item2 => {
            let obj = {
              longitude: parseFloat(item2.split(',')[0]),
              latitude: parseFloat(item2.split(',')[1])
            }
            points.push(obj);
          })
        })
      }
      this.setData({
        polyline: [{
          points: points,
          color: "#0091ff",
          width: 6
        }]
      });
    }
    else {
      if (d && d.transits) {
        let transits = d.transits;
        transits.forEach(item1 => {
          let { segments } = item1;
          item1.transport = [];
          segments.forEach((item2, j) => {
            if (item2.bus && item2.bus.buslines && item2.bus.buslines[0] && item2.bus.buslines[0].name) {
              let name = item2.bus.buslines[0].name;
              if (j !== 0) {
                name = '--' + name;
              }
              item1.transport.push(name);
            }
          })
        })
        this.setData({ transits });
      }
    }
    if (type == "getDrivingRoute") {
      if (d.paths[0] && d.paths[0].distance) {
        this.setData({
          distance: d.paths[0].distance + '米'
        });
      }
      if (d.taxi_cost) {
        this.setData({
          cost: '打车约' + parseInt(d.taxi_cost) + '元'
        });
      }
    }
    else if (type == "getWalkingRoute" || type == "getRidingRoute") {
      if (d.paths[0] && d.paths[0].distance) {
        this.setData({
          distance: d.paths[0].distance + '米'
        });
      }
      if (d.paths[0] && d.paths[0].duration) {
        this.setData({
          cost: parseInt(d.paths[0].duration / 60) + '分钟'
        });
      }
    }
    else if (type == "getRidingRoute") {

    }
  },
  goDetail() {
    let Course_details = this.data.Course_details.paths[0];
    Course_details = JSON.stringify(Course_details)
    let url = `/pages/info/info?Course_details=` + Course_details;
    wx.navigateTo({ url });
  },
  nav() {
    let {destination} = this.data;
    wx.openLocation({
      latitude: destination.latitude,
      longitude: destination.longitude,
      name:destination.name,
      address: destination.address,
    });
  }
});
