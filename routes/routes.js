"use strict";
var express = require("express");
var bodyparser = require("body-parser");
var fs = require("fs");
var child_process = require('child_process');
var os = require("os");

function updateData(){
  child_process.exec('luajit jsonfythis.lua meminfo', function(error, stdout, stderr){
    if(error) throw error;
  });
}

function calculateCPU(){
  var cpus = os.cpus();
  var model;
  var totalCpu = 0;

  for(var i = 0, len = cpus.length; i < len; i++) {
    var cpu = cpus[i];
    var total = 0;
    var processTotal = 0;
    model = cpu.model;

    for(var type in cpu.times){
      total += cpu.times[type];
    }

    for(var type in cpu.times){
      var percent = 100 * cpu.times[type] / total;
      if(type != 'idle'){
        processTotal += percent;
      }
    }
    totalCpu += processTotal;
  }
  return {cpu: totalCpu/cpus.length, model: model};
}

module.exports = function(router) {
  router.use(bodyparser.json());

  router.get("/ram", function(req, res) {
    fs.readFile("./data.json", function(err, data) {
      if (err) {console.log(err);}
      var fileContent = JSON.parse(data.toString());
      res.json(fileContent);
      updateData();
    });
  });

  router.get("/cpu", function(req, res){
    var data = calculateCPU()
    res.json(data);
  });
};
