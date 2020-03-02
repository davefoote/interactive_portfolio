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
    'Mammals': mammalsPlot,
    'Reptiles': reptilesPlot
}

var palette = ["#A2A8A8", "#D37E34", "#18872C", "#8C271E", "#3F89E2", "#EC7A8E"]

domReady(() => {
    Promise.all([d3.json('./data/gz_2010_us_040_00_5m.json'), d3.json('./data/critical_habitats.json')])
      .then(
        d => {
            const [back, fore] = d;
            console.log(d)
            application(back, fore);
        },
    );
    
});


function application(data, toplayer) {
  const state = {slideIdx: 'Birds'}
  console.log(data)
  usaChart(data);
    
  d3.select('.buttons-container')
      .selectAll('button')
      .data(['Birds', 'Insects', 'Amphibians', 'Mammals', 'Reptiles'])
      .enter()
      .append('button')
      .text(d => d)
      .on('click', d=> {
        state.slideIdx = d;
        render(state, toplayer)
        console.log(d);
      });
 
}

function render(state, data) {
    d3.select('#mapzone *').remove();
    d3.select('#mapzone')
      .append('h1')
      .text(state.slideIdx);
    
    if (state.slideIdx === 'Birds') {
        birdsPlot(data)
    }
}

function usaChart(data) {
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
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", "#A2A8A8");
};

function birdsPlot(habs) {
    var habitats = topojsonSimplify(habs)
    var width = 960;
    var height = 500;
    var projection = d3.geoAlbersUsa();
    var path = d3.geoPath()
            .projection(projection);
    var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    var g = svg.selectAll(".collection")
            .data(habs.arcs)
            .enter()
            .append("g")
            .attr("class", "collection");
    g.selectAll("path")
            .data(habs.arcs).enter()
          .append("path")
          .attr("d", path)
          .style("stroke", "#fff")
          .style("stroke-width", "1")
          .style("fill", "#3F89E2");
          console.log("arcs: ", habs.arcs);
};
function insectsPlot(data) {};
function amphiPlot(data) {};
function mammalsPlot(data) {};
function reptilesPlot(data) {};



