"use strict";
var express = require("express");
var bodyparser = require("body-parser");
var fs = require("fs");
var child_process = require('child_process');

function updateData(){
  child_process.exec('luajit jsonfythis.lua meminfo', function(error, stdout, stderr){
    if(error) throw error;
  });
}

module.exports = function(router) {
  router.use(bodyparser.json());
  router.get("/data", function(req, res) {
    fs.readFile("./data.json", function(err, data) {
      if (err) {console.log(err);}
      var fileContent = JSON.parse(data.toString());
      res.json(fileContent); 
      updateData();
    });
  });
};
