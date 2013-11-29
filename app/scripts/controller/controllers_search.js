'use strict';

/* Controllers */

function CtrlSearch($scope, $route, $routeParams, $http, $q, searchForm, withMap){
  $scope.scientificNames=searchForm.getScientificName();
  $scope.vernacularNames=searchForm.getVernacularName();
  $scope.localities=searchForm.getLocality();
  $scope.latitudes=searchForm.getLatitude();
  $scope.longitudes=searchForm.getLongitude();
  $scope.boundingBoxes=searchForm.getBoundingBoxes();
  $scope.datapublishers=searchForm.getDatapublisher();
  $scope.datasets=searchForm.getDataset();
  $scope.georeferences = searchForm.getGeoreferencedData();
  $scope.datapublisherDataset = searchForm.getDatapublisherDataset();

  //Boolean for show the popup for the help
  $scope.isCollapsedCommun=true;
  $scope.isCollapsedScientific=true;
  $scope.isCollapsedLocality=true;
  $scope.isCollapsedLatitude=true;
  $scope.isCollapsedLongitude=true;
  $scope.isCollapsedGeoreferenced=true;
  $scope.isCollapsedDate=true;
  $scope.isCollapsedDatapublisher=true;
  $scope.isCollapsedDataset=true;
  $scope.isCollapsedRecherche=false;

  $scope.latitudeFilter="<";
  $scope.longitudeFilter="<";

  $scope.date = searchForm.getDate();
  $scope.dateslider = {
    special: ["NODATE", "PRE"],
    regular: ["1900", "1910", "1920", "1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010"],
    values: searchForm.getDate() || {}
  };

  // Function dedicated to the different filters of the research engine. 
  // Each function add its filter to the searchForm
  $scope.addScientificName = function() {
    var url = "http://api.gbif.org/v0.9/species/match?name="+$scope.scientificName;
    var scientificNameRank = "no rank";
    var scientificName = $scope.scientificName;

    $http.get(url).
      success(function(data, status) {
        scientificNameRank = data.rank;
        console.log(data.rank);
        searchForm.addScientificName(scientificName, scientificNameRank);
      }).
      error(function(data, status) {
        searchForm.addScientificName(scientificName, scientificNameRank);
      });
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
  }; 

  $scope.addLatitude = function(){
    searchForm.addLatitude($scope.latitude, $scope.latitudeFilter);
    $scope.latitude = '';
  };

  $scope.removeLatitude = function(index){
    searchForm.removeLatitude(index);
  }; 

  $scope.addGeoreferencedData = function(){
    searchForm.addGeoreferencedData($scope.georeference);
    $scope.georeferences = searchForm.getGeoreferencedData();
  };

  $scope.addLongitude = function(){
    searchForm.addLongitude($scope.longitude, $scope.longitudeFilter);
    $scope.longitude = '';
  };

  $scope.removeLongitude= function(index){
    searchForm.removeLongitude(index);
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

  // Update dataset field
  $scope.$watch("datapublisher", function(newValue, oldValue) {
    if (newValue) {
      $scope.datasetListShow = $scope.datasetList.filter(function(e){
        return e.dataPublisherId == newValue;
      });
    } else {
      $scope.datasetListShow = $scope.datasetList;
    }
  });

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

  $scope.removeDataset = function(index){
    searchForm.removeDataset(index);
  }

  $scope.setDate = function(){
    searchForm.setDate($scope.dateslider.values.left, $scope.dateslider.values.right);
    $scope.date = searchForm.getDate();
  };

  $scope.removeDate = function(){
    searchForm.removeDate();
    $scope.date = searchForm.getDate();
  };

  //function dedicated to the bounding box

  var filterLayers = function(bounds) {
  };
  var lookupLayers = function(bounds) {
  };

  $scope.highlightBoundingBox = function(highlight, box) {
    var layer = lookupLayers(box.bounds);
    if (layer) {
      layer.setStyle({fill: highlight});
    }
  }

  $scope.removeBoundingBox = function(box) {
    searchForm.removeBoundingBox(box.bounds);
    filterLayers(box.bounds);
    $scope.boundingBoxes = searchForm.getBoundingBoxes();
  }

  // Function dedicated to the map for the bounding box
  // Only initiate the map on the map view
  if (withMap) {
    var franceMetropolitan = new L.LatLng(47.0176, 2.3427);

    var map = L.map('search-map', {
      zoomControl: true,
      dragging: false,
      center: franceMetropolitan,
      zoom: 5
    });

    var layers = [];
    var addBoundingBox = function(bounds) {
      var layer = L.rectangle(bounds, {
        color: '#d62727',
        fill: false
      })
      layer.addTo(map);

      // Store layers in case we want to remove them
      layers.push({bounds: bounds, layer: layer});
    }

    lookupLayers = function(bounds) {
      var filteredLayers = layers.filter(function(b) {
        return b.bounds.equals(bounds);
      });

      return filteredLayers.map(function(e){return e.layer;})[0];
    }

    filterLayers = function(bounds) {
      layers = layers.filter(function(b){
        if (b.bounds.equals(bounds)) {
          map.removeLayer(b.layer);
          return false;
        } else {
          return true;
        }
      });
    };

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
      if (type === 'rectangle') {
        // Store bounding box in service
        searchForm.addBoundingBox(layer.getBounds());

        addBoundingBox(layer.getBounds());
        // Trigger the reload of layers
        $scope.$digest();
      }
    });

    // Fond de carte
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-dev-fr/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://mapbox.org">MapBox</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18,
        noWrap: true
    }).addTo(map);

    $scope.boundingBoxes.map(function(e){
      addBoundingBox(e.bounds);
    });
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


  //fonction pour récupérer les données sur les datapublishers et les datasets
  $http.get("http://localhost:9000/api/datapublisher").
    success(function(data, status) {
      $scope.dataPublisherList = data.map(function(taxa){ return {name:taxa.name, id:taxa.id};});
    }).
    error(function(data, status) {
      $scope.dataPublisherList =["Erreur" + status];
    });

  $http.get("http://localhost:9000/api/dataset").
    success(function(data, status) {
      $scope.datasetList = data.map(function(taxa){ return {name:taxa.name, id:taxa.id, dataPublisherId:taxa.dataPublisher.id};});
      $scope.datasetListShow = $scope.datasetList;
    }).
    error(function(data, status) {
      $scope.datasetList =["Erreur" + status];
      $scope.datasetListShow = $scope.datasetList;
    });


}


myApp.controller('CtrlSearch', ['$scope', '$route', '$routeParams', '$http', '$q', 'searchForm', 'withMap', CtrlSearch]);
