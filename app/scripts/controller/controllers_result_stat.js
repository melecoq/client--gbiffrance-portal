'use strict';

/* Controllers */

function CtrlResultStat($scope, searchForm, $http, config){
  $scope.scientificNames=searchForm.getScientificName();
  $scope.vernacularNames=searchForm.getVernacularName();
  $scope.localities=searchForm.getLocality();
  $scope.latitudes=searchForm.getLatitude();
  $scope.longitudes=searchForm.getLongitude();
  $scope.boundingBoxes=searchForm.getBoundingBoxes();
  $scope.dates=searchForm.getDate();
  $scope.georeferences = searchForm.getGeoreferencedData();
  $scope.datapublisherDataset = searchForm.getDatapublisherDataset();
  $scope.isCollapsedRecherche = true;
  $scope.json = searchForm.buildJson();

  $scope.exampleData = [10, 20, 30, 40, 50, 60, 80, 20, 50];

  config.then(function(config){

    $http.post(config.api.endpoint + '/search/statistics', $scope.json)
      .success(function(data, status) {
        $scope.reponse = status;
        $scope.jsonStat = data;

      });
  });

  $scope.removeScientificName = function(index){
    searchForm.removeScientificName(index);
  };

  $scope.removeVernacularName = function(index){
    searchForm.removeVernacularName(index);
  };

  $scope.removeLocality = function(index){
    searchForm.removeLocality(index);
  };

  $scope.removeLatitude = function(index){
    searchForm.removeLatitude(index);
  };

  $scope.removeLongitude= function(index){
    searchForm.removeLongitude(index);
  };

  $scope.removeDataset = function(index){
    searchForm.removeDataset(index);
  };

  $scope.removeDate = function(index){
    searchForm.removeDate(index);
  };

  // Datasets
  $scope.$watch('jsonStat', function(data) {
    console.log(data);
    if (!data) return;


    var datasets = data.filter(function(el) { return el.typeFilter== 'dataset';});


    var width = 400,
      height = 250,
      radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.count; });

    var svg = d3.select('#dataset').append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var values = datasets.map(function(el){ return {name: el.name, count: +el.count};});


    var g = svg.selectAll(".arc")
      .data(pie(values))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.name); });

    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; });

  });

  // Dates
  $scope.$watch('jsonStat', function(data) {
    console.log(data);
    if (!data) return;


    var years = data.filter(function(el) { return el.typeFilter== 'year';});


    var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;


    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var svg = d3.select("#years").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var values = years.map(function(el){ return {year: el.term, frequency: +el.count};});

    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

    svg.selectAll(".bar")
      .data(values)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
      .text("Years");

  });

}

myApp.controller('CtrlResultStat', ['$scope', 'searchForm', '$http', 'config', CtrlResultStat]);