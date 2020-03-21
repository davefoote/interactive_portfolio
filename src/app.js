import * as d3 from 'd3';
import './stylesheets/main.css';
var topojsonSimplify = require("topojson-simplify")
;

// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');

const slideSpeciesTypeMap = {
    'Birds': birdsPlot,
    'Fishes': fishesPlot,
    'Amphibians': amphiPlot,
    'Flowering Plants': fplantsPlot,
    'Crustaceans': crustPlot
};

domReady(() => {
    Promise.all([d3.json('./data/drp/socal.geojson'),
                d3.json('./data/la_critters/la_amphibians.geojson'),
                d3.json('./data/la_critters/la_birds.geojson'),
                d3.json('./data/la_critters/la_fplants.geojson'),
                d3.json('./data/la_critters/la_fishes.geojson'),
                d3.json('./data/la_critters/la_crust.geojson')])
      .then(
        d => {
            const [back, amphi, birds, fplants, fishes, crust] = d;
            console.log(d)
            application(back, amphi, birds, fplants, fishes, crust);
        },
    );
    
});


function application(data, amphi, birds, fplants, fishes, crust) {
  const state = {slideIdx: 0}
  console.log('birbs!', birds)
  laChart(data);
    
  d3.select('.buttons-container')
      .selectAll('button')
      .data(['Birds', 'Flowering Plants', 'Amphibians', 'Fishes', 'Crustaceans'])
      .enter()
      .append('button')
      .text(d => d)
      .on('click', d=> {
        var last_state = state.slideIdx
        console.log("last: ", last_state)
        state.slideIdx = d;
          if (state.slideIdx === 'Birds') {
            render(state, birds, last_state);};
          if (state.slideIdx === 'Flowering Plants') {
            render(state, fplants, last_state);};
          if (state.slideIdx === 'Fishes') {
            render(state, fishes, last_state);};
          if (state.slideIdx === 'Crustaceans') {
            render(state, crust, last_state);};
          if (state.slideIdx === 'Amphibians') {
            render(state, amphi, last_state);};
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
            var chartConfig = {
            target : 'chart',
            data_url : 'external_data.json',
            width: 900,
            height: 450,
            val: 100
        };
    
    if (state.slideIdx === 'Birds') {
          birdsPlot(data);
    };
    
    if (state.slideIdx === 'Flowering Plants') {
        fplantsPlot(data)
    };
    if (state.slideIdx === 'Amphibians') {
        amphiPlot(data)
    };
    if (state.slideIdx === 'Fishes') {
        fishesPlot(data);
    };
    if (state.slideIdx === 'Crustaceans') {
        crustPlot(data)
    };
};

function laChart(data) {
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    var width = 1000;
    var height = 400;
    
    var projection = d3.geoAlbersUsa()
        .scale(6000)
        .translate([width * 2.17, 10]);
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
        .style("stroke", "#605A50")
        .style("stroke-width", "1")
        .style("fill", "#fff")
        .on("mouseover", function(d) {		
          div.transition()		
            .duration(200)		
            .style("opacity", .75);		
          div.html(d.properties.COUNTY)
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px")
          console.log(d.properties.status)
          console.log(d.properties.sciname);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
};

function birdsPlot(habs) {
    console.log(document.readyState);
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    var width = 1000;
    var height = 400;
    var projection = d3.geoAlbersUsa()
        .scale(6000)
        .translate([width * 2.17, 10]);
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
            .style("opacity", .75);		
          div.html(d.properties.sciname + "    Status: " + 
                d.properties["status"])
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px")
          console.log(d.properties.status)
          console.log(d.properties.sciname);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
          .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.sciname, "_blank");
          })
          .style("stroke", "#392F16")
          .style("stroke-width", "3")
          .style("fill", "#392F16");
          console.log("feats: ", habs.features);
};

function fplantsPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 1000;
    var height = 400;
    var projection = d3.geoAlbersUsa()
                    .scale(6000)
                    .translate([width * 2.17, 10]);
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
    svg.selectAll("path")
          .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .75);		
            div.html(d.properties.sciname + "    Status: " + 
                     d.properties["status"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.status)
            console.log(d.properties.sciname);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
          .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.sciname, "_blank");
          })
          .style("stroke", "#E4572E")
          .style("stroke-width", "3")
          .style("fill", "#E4572E");
          console.log("feats: ", habs.features);
};

function amphiPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 1000;
    var height = 400;
    var projection = d3.geoAlbersUsa()
                    .scale(6000)
                    .translate([width * 2.17, 10]);
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
    svg.selectAll("path")
          .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .75);		
            div.html(d.properties.sciname + "    Status: " + 
                     d.properties["status"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.status)
            console.log(d.properties.sciname);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
          .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.sciname, "_blank");
          })
          .style("stroke", "#98AF49")
          .style("stroke-width", "3")
          .style("fill", "#98AF49");
          console.log("feats: ", habs.features);
};

function fishesPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 1000;
    var height = 400;
    var projection = d3.geoAlbersUsa()
                    .scale(6000)
                    .translate([width * 2.17, 13]);
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
     svg.selectAll("path")
          .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .75);		
            div.html(d.properties.sciname + "    Status: " + 
                     d.properties["status"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.status)
            console.log(d.properties.sciname);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
          .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.sciname, "_blank");
          })
          .style("stroke", "#253C78")
          .style("stroke-width", "3")
          .style("fill", "#253C78");
          console.log("feats: ", habs.features);
};

function crustPlot(habs) {
    var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
    var width = 1000;
    var height = 400;
    var projection = d3.geoAlbersUsa()
                    .scale(6000)
                    .translate([width * 2.17, 10]);
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
     svg.selectAll("path")
          .data(habs.features).enter()
          .append("path")
          .attr("d", path)
          .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .75);		
            div.html(d.properties.sciname + "    Status: " + 
                     d.properties["status"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            console.log(d.properties.status)
            console.log(d.properties.sciname);	
            })
          .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
          .on("click", function(d) {
            window.open("https://en.wikipedia.org/wiki/" + d.properties.sciname, "_blank");
          })
          .style("stroke", "#D36582")
          .style("stroke-width", "3")
          .style("fill", "#D36582");
          console.log("feats: ", habs.features);
};



