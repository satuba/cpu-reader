var dataHistory = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

function visualize(json) {
  var percentage = 100-(json.meminfo.MemFree.size/json.meminfo.MemTotal.size*100);
  dataHistory.shift();
  dataHistory.push(percentage);
  // function getRandomInt(min, max) {
  //   return Math.floor(Math.random() * (max - min)) + min;
  // }
  // var random = getRandomInt(0, 100);
  // dataHistory.push(random);

  $('#memory').html(percentage.toFixed(2));
  //$('#memory').html(random);

  d3.select('#graph').selectAll("svg").remove();
  var margin = [20, 20, 20, 20];
  var width = 500 - margin[1] - margin[3];
  var height = 400 - margin[0] - margin[2];
  
  var x = d3.scale.linear().domain([0, 20]).range([0, width]);
  var y = d3.scale.linear().domain([0, 100]).range([height, 0]);

  var line = d3.svg.line()
    .x(function(d,i) { 
      return x(i); 
    })
    .y(function(d) { 
      return y(d); 
    });
  var graph = d3.select("#graph").append("svg:svg")
    .attr("width", width + margin[1] + margin[3])
    .attr("height", height + margin[0] + margin[2])
    .append("svg:g")
    .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

  var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
  graph.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
  graph.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(-25,0)")
    .call(yAxisLeft);

  graph.append("svg:path").attr("d", line(dataHistory));
}

setInterval(function(){
  $.ajax({
    url: "/data",
    type : 'GET',
    dataType : 'json',
    success: function (jsonData) {
      visualize(jsonData);
    },
    error: function(err){
      return console.log(err);
    }
  });
}, 1000);
