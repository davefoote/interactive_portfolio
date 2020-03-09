import * as d3 from 'd3';
import './stylesheets/main.css';
var topojsonSimplify = require("topojson-simplify");

// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');

const slideSpeciesTypeMap = {
    'Birds': birdsPlot,
    'Insects': insectsPlot,
    'Amphibians': amphiPlot,
    'Reptiles': reptilesPlot
};

var palette = ["#A2A8A8", "#D37E34", "#18872C", "#8C271E", "#3F89E2", "#EC7A8E"]

domReady(() => {
    Promise.all([d3.json('./data/drp/DRP_COUNTY_BOUNDARY.geojson'),
                d3.json('./data/la_critters/la_amphibians.geojson'),
                d3.json('./data/la_critters/la_birds.geojson'),
                d3.json('./data/la_critters/la_insects.geojson'),
                d3.json('./data/la_critters/la_reptiles.geojson')])
      .then(
        d => {
            const [back, amphi, birds, insects, reptiles] = d;
            console.log(d)
            application(back, amphi, birds, insects, reptiles);
        },
    );
    
});


function application(data, amphi, birds, insects, reptiles) {
  const state = {slideIdx: 0}
  console.log('birbs!', birds)
  laChart(data);
    
  d3.select('.buttons-container')
      .selectAll('button')
      .data(['Birds', 'Insects', 'Amphibians', 'Reptiles'])
      .enter()
      .append('button')
      .text(d => d)
      .on('click', d=> {
        var last_state = state.slideIdx
        console.log("last: ", last_state)
        state.slideIdx = d;
          if (state.slideIdx === 'Birds') {
            render(state, birds, last_state)
            console.log(d);};
          if (state.slideIdx === 'Insects') {
            render(state, insects, last_state)
            console.log(d);};
          if (state.slideIdx === 'Reptiles') {
            render(state, reptiles, last_state)
            console.log(d);};
          if (state.slideIdx === 'Amphibians') {
            render(state, amphi, last_state)
            console.log(d);};
          });
 
}

function render(state, data, last) {
    d3.select('#mapzone *').remove();
    console.log("slide idx is: ", state.slideIdx)
    if (last !== 0) {
        d3.select('svg:last-of-type').remove();
    };
    d3.select('#mapzone')
      .append('h1')
      .text(state.slideIdx);
    
    if (state.slideIdx === 'Birds') {
        birdsPlot(data)
    };
    
    if (state.slideIdx === 'Insects') {
        insectsPlot(data)
    };
    if (state.slideIdx === 'Amphibians') {
        amphiPlot(data)
    };
    if (state.slideIdx === 'Reptiles') {
        reptilesPlot(data)
    };
};

function laChart(data) {
    var width = 960;
    var height = 800;
    
    var projection = d3.geoAlbersUsa()
                    .scale(26000)
                    .translate([width * 8.75, -800]);
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("width", width)
            .attr("height", height)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", "#A2A8A8");
};

function birdsPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 960;
    var height = 500;
    var projection = d3.geoAlbersUsa()
                .scale(26000)
                .translate([width * 8.75, -800]);
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    var g = svg.selectAll("path")
            .data(habs.features)
            .enter()
            .append("g");
    svg.selectAll("path")
          .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.properties.Scientific + "    Commonly known as: " + 
                     d.properties["Common Nam"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.Scientific);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
          .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.Scientific, "_blank");
          })
          .style("stroke", "#fff")
          .style("stroke-width", "1")
          .style("fill", "#3F89E2");
          console.log("feats: ", habs.features);
};

function insectsPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 960;
    var height = 500;
    var projection = d3.geoAlbersUsa()
                    .scale(26000)
                    .translate([width * 8.75, -800]);
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    var g = svg.selectAll(".collection")
            .data(habs.features)
            .enter()
            .append("g")
            .attr("class", "collection");
    g.selectAll("path")
            .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.properties.Scientific + "    Commonly known as: " + 
                     d.properties["Common Nam"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.Scientific);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
            })
           .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.Scientific, "_blank");
            })
          .style("stroke", "#fff")
          .style("stroke-width", "1")
          .style("fill", "#3F89E2");
          console.log("feats: ", habs.features);
};

function amphiPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 960;
    var height = 500;
    var projection = d3.geoAlbersUsa()
                    .scale(26000)
                    .translate([width * 8.75, -800]);
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    var g = svg.selectAll(".collection")
            .data(habs.features)
            .enter()
            .append("g")
            .attr("class", "collection");
    g.selectAll("path")
            .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.properties.Scientific + "    Commonly known as: " + 
                     d.properties["Common Nam"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.Scientific);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
           .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.Scientific, "_blank");
          })
          .style("stroke", "#fff")
          .style("stroke-width", "1")
          .style("fill", "#3F89E2");
          console.log("feats: ", habs.features);
};

function reptilesPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 960;
    var height = 500;
    var projection = d3.geoAlbersUsa()
                    .scale(26000)
                    .translate([width * 8.75, -800]);
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    var g = svg.selectAll(".collection")
            .data(habs.features)
            .enter()
            .append("g")
            .attr("class", "collection");
    g.selectAll("path")
            .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.properties.Scientific + "    Commonly known as: " + 
                     d.properties["Common Nam"])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.Scientific);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
           .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.Scientific, "_blank");
          })
          .style("stroke", "#fff")
          .style("stroke-width", "1")
          .style("fill", "#3F89E2");
          console.log("feats: ", habs.features);
};



