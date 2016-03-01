"use strict";
var express = require("express");
var bodyparser = require("body-parser");
var fs = require("fs");

module.exports = function(router) {
  router.use(bodyparser.json());
  router.get("/data", function(req, res) {
    fs.readFile("./data.json", function(err, data) {
      if (err) {console.log(err);}
      var fileContent = JSON.parse(data.toString());
      res.json(fileContent);
    });
  });
};