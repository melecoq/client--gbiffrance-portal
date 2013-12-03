'use strict';

/* Controllers */

function CtrlResultStat($scope, searchForm, $http, config, withMap){
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

  $http.post('http://localhost:9000/api/search/statistics', $scope.json)
    .success(function(data, status) {
      $scope.reponse = status;
      $scope.jsonStat = data;

    })
    .error(function(data, status) {
      $scope.reponse = status;
      $scope.jsonStat = data;
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

}

myApp.controller('CtrlResultStat', ['$scope', 'searchForm', '$http', CtrlResultStat]);