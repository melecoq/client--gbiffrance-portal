'use strict';

/* Controllers */

function CtrlSearch($scope, $routeParams, $http, $q, searchForm){
  $scope.scientificNames=searchForm.getScientificName();
  $scope.vernacularNames=searchForm.getVernacularName();
  $scope.localities=searchForm.getLocality();
  $scope.latitudes=searchForm.getLatitude();
  $scope.longitudes=searchForm.getLongitude();
  $scope.datapublishers=searchForm.getDatapublisher();
  $scope.datasets=searchForm.getDataset();
  $scope.dates=searchForm.getDate();
  $scope.georeferences = searchForm.getGeoreferencedData();
  $scope.datapublisherDataset = searchForm.getDatapublisherDataset();

  //Boolean for show the popup for the help
  $scope.isCollapsedCommun=true;
  $scope.isCollapsedScientific=true;
  $scope.isCollapsedLocality=true;
  $scope.isCollapsedLatitude=true;
  $scope.isCollapsedLongitude=true;
  $scope.isCollapsedGeoreferenced=true;

  // Function dedicated to the different filters of the research engine. 
  // Each function add its filter to the searchForm
  $scope.addScientificName = function() {
    searchForm.addScientificName($scope.scientificName);
    $scope.scientificName = '';
  };

  $scope.removeScientificName = function(index){
    searchForm.removeScientificName(index);
  }

  $scope.addVernacularName = function() {
    searchForm.addVernacularName($scope.vernacularName);
    $scope.vernacularName = '';
  };

  $scope.removeVernacularName = function(index){
    searchForm.removeVernacularName(index);
  }  

  $scope.addLocality = function(){
    searchForm.addLocality($scope.locality);
    $scope.locality = '';
  };

  $scope.removeLocality = function(index){
    searchForm.removeLocality(index);
  } 

  $scope.addLatitude = function(){
    searchForm.addLatitude($scope.latitude);
    $scope.latitude = '';
  };

  $scope.addGeoreferencedData = function(){
    searchForm.addGeoreferencedData($scope.georeference);
    $scope.georeferences = searchForm.getGeoreferencedData();
  };

  $scope.addLongitude = function(){
    searchForm.addLongitude($scope.longitude);
    $scope.longitude = '';
  };
  //DEPRECIED
  $scope.addDatapublisher = function(){
    searchForm.addDatapublisher($scope.datapublisher);
    $scope.datapublisher = '';
  };
  //DEPRECIED
  $scope.addDataset = function(){
    searchForm.addDataset($scope.dataset);
    $scope.dataset = '';
  };

  $scope.addDatapublisherDataset = function(){
    var datapublisherName = $scope.dataPublisherList.filter(function(datapublisher){
      return datapublisher.id == $scope.datapublisher;
    })[0];
    var datasetName = $scope.datasetList.filter(function(dataset){
      return dataset.id == $scope.dataset;
    })[0];
    searchForm.addDatapublisherDataset(datapublisherName, datasetName);
    $scope.datapublisher = '';
    $scope.dataset = '';
  }

  $scope.addDate = function(){
    searchForm.addDate($scope.date);
    $scope.date = '';
  };

  // Function dedicated to the map for the bounding box
  $scope.mapBoundingBox = function(){
    var franceMetropolitan = new L.LatLng(47.0176, 2.3427);

    var map = L.map('map', {
      zoomControl: false,
      dragging: false,
      center: franceMetropolitan,
      zoom: 5
    });

    // Bounding box controls
    var drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        // Disable all controls
        polyline: false,
        polygon: false,
        marker: false,
        circle: false,
        // Activate rectangle
        rectangle: {
          allowIntersection: false,
          drawError: {
            color: '#b00b00',
            timeout: 1000
          },
          shapeOptions: {
            color: '#d62727',
            clickable: false
          }
        }
      }
    });

    map.addControl(drawControl);
    map.on('draw:created', function (e) {
      var type = e.layerType,
          layer = e.layer;

      // Only add rectangle layer types
      if (type === 'rectangle' || true) {
        map.addLayer(layer);
      }
    });

    // Fond de carte
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-dev-fr/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://mapbox.org">MapBox</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18,
        noWrap: true
    }).addTo(map);
  }

  // Generic function for the autocomplete
  var autocomplete = function(url, mapper){
    return function(name){
      // Create the promise box 
      var nameList = $q.defer();

      $http.get(url+name).
        success(function(data, status) {
          nameList.resolve([].concat.apply([], data.map(mapper)));
        }).
        error(function(data, status) {
          nameList.resolve(["Erreur " + status]);
      });
      return nameList.promise;
    }
  }

  //Functions for the autocompletion for the different fields of the research engine
  $scope.autocompleteScientificName =  autocomplete("http://api.gbif.org/v0.9/species/suggest?datasetkey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=20&q=", 
    function(taxa){ 
      return [taxa.canonicalName];
    });

  $scope.autocompleteVernacularName =  autocomplete(
    "http://api.gbif.org/v0.9/species/suggest?datasetkey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=20&q=", 
    function(taxa){ 
      return taxa.vernacularNames.filter(function(vernacularName){
          return vernacularName.language=="FRENCH";
      }).map(function(vernacularNameObject){
        return vernacularNameObject.vernacularName;
      });
    });

  $scope.autocompleteLocality = autocomplete("http://nominatim.openstreetmap.org/search/?format=json&limit=10&q=",
    function(locality){
        return [locality.display_name];
    });


  $http.get("http://localhost:8000/app/json/datapublisher.json").
    success(function(data, status) {
      $scope.dataPublisherList = data.map(function(taxa){ return {name:taxa.name, id:taxa.id};});

    }).
    error(function(data, status) {
      $scope.dataPublisherList =["Erreur" + status];
    });

  $http.get("http://localhost:8000/app/json/dataset.json").
    success(function(data, status) {
      $scope.datasetList = data.map(function(taxa){ return {name:taxa.name, id:taxa.id, datapubliserId:taxa.datapubliserId};});
    }).
    error(function(data, status) {
      $scope.datasetList =["Erreur" + status];
    });


}


myApp.controller('CtrlSearch', ['$scope', '$routeParams', '$http', '$q', 'searchForm', CtrlSearch]);