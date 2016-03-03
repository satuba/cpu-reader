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
  var totalIdle = 0;
  var totalTick = 0;
  var model = "";

  for(var i = 0; i < cpus.length; i++) {
    var cpu = cpus[i];
    for(var type in cpu.times) {
      totalTick += cpu.times[type];
   }
    totalIdle += cpu.times.idle;
    model = cpu.model;
  }

  totalIdle = totalIdle / cpus.length;
  totalTick = totalTick / cpus.length;

  return {cpu: 100-(totalIdle/totalTick*100), model: model};
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
