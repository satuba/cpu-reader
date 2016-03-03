var ramHistory = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var cpuHistory = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

function visualize(dataArray, svgGraph) {
  d3.select(svgGraph).selectAll("svg").remove();
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
  var graph = d3.select(svgGraph).append("svg:svg")
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

  graph.append("svg:path").attr("d", line(dataArray));
}

setInterval(function(){
  $.ajax({
    url: "/ram",
    type : 'GET',
    dataType : 'json',
    success: function (jsonData) {
      var percentage = 100-(jsonData.meminfo.MemFree.size/jsonData.meminfo.MemTotal.size*100);
      $('#ram').html(percentage.toFixed(4));
      ramHistory.shift();
      ramHistory.push(percentage);
      visualize(ramHistory, "#ramGraph");
    },
    error: function(err){
      return console.log(err);
    }
  });

  $.ajax({
    url: "/cpu",
    type : 'GET',
    success: function (data) {
      $('#cpu').html(data.cpu.toFixed(4));
      $('#model').html(data.model);
      cpuHistory.shift();
      cpuHistory.push(data.cpu);
      visualize(cpuHistory, "#cpuGraph");
    },
    error: function(err){
      return console.log(err);
    }
  });
}, 1000);

$(document).ready(function(){
  $('#ramGraph').hide();

  $('#ramButton').click(function() {
    $('#ramGraph').show();
    $('#cpuGraph').hide();
  });

  $('#cpuButton').click(function() {
    $('#ramGraph').hide();
    $('#cpuGraph').show();
  });
});
