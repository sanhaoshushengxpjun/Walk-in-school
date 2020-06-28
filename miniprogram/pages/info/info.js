//logs.js
let util = require('../../utils/util.js');
let wechat = require("../../utils/wechat");
let amap = require("../../utils/amap");
Page({
  data: {
    steps: [],
    distance:"",
    cost:"",
  },
  onLoad(e) {
    var Course_details = JSON.parse(e.Course_details);
    var steps = Course_details.steps;
    var distance = Course_details.distance + "米";
    var cost = parseInt(Course_details.duration / 60) + "分钟";
    console.log(Course_details)
    this.setData({ 
      Course_details,
      steps:steps,
      distance,
      cost,
    });
  },
});
