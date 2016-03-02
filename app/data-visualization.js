var dataHistory = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var temporaryCounter = 0;
var counter = 0;

function visualize(json) {
  var percentage = 100-(json.meminfo.MemFree.size/json.meminfo.MemTotal.size*100);
  dataHistory.shift();
  dataHistory.push(percentage);

  temporaryCounter += 1;  
  counter += 1; 

  d3.select('#graph').selectAll("svg").remove();
  var m = [20, 20, 20, 20]; // margins
  var w = 500 - m[1] - m[3]; // width
  var h = 400 - m[0] - m[2]; // height
  
  var data = dataHistory;
  var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
  var y = d3.scale.linear().domain([0, 100]).range([h, 0]);

  var line = d3.svg.line()
    .x(function(d,i) { 
      return x(i); 
    })
    .y(function(d) { 
      return y(d); 
    })
    var graph = d3.select("#graph").append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
          .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);

    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);
  
    graph.append("svg:path").attr("d", line(data));
    console.log(dataHistory);
}

function ajaxCall() {
  $.ajax({
    url: "/data",
    type : 'GET',
    dataType : 'json',
    success: function (jsonData) {
      visualize(jsonData);
    },
    error: function(err){
      console.log(err);
    }
  });
}

setInterval(ajaxCall, 1000);
