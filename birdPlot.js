import * as d3 from 'd3';

export default birdsPlot(habs) {
    var width = 960;
    var height = 500;
    
    var projection = d3.geoAlbersUsa();
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    svg.selectAll("path")
            .data(habs.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", "#3F89E2")    
};