
d3.selectAll("td").style("color", "blue");

var counter = 0;
var vis = d3.select("#graph")
        .append("svg");
var w = 900, h = 400;
function visualize() {
  $.ajax({
    url: "/data",
    type : 'GET',
    dataType : 'json',
    success: function (jsonData) {
      obj = jsonData;
      console.log('jsonData', obj.meminfo.Shmem.size); 
      var nodes = [
        {x: counter, y: obj.meminfo.Shmem.size}
      ];
      
      vis.attr("width", w)
        .attr("height", h)
        .text("The Graph")
        .select("#graph");
      vis.selectAll("circle .nodes")
        .data(nodes)
        .enter()
        .append("svg:circle")
        .attr("class", "nodes")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", "10px")
        .attr("fill", "black")
      counter += 10;        
    },
    error: function(err){
      console.log(err);
    }
  });
}
$('button').on('click', function(){
  setInterval(visualize, 1000);
});
