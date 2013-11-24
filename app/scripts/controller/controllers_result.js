'use strict';

/* Controllers */

function CtrlResult($scope, searchForm, $http){
	$scope.scientificNames=searchForm.getScientificName();
  	$scope.vernacularNames=searchForm.getVernacularName();
  	$scope.localities=searchForm.getLocality();
  	$scope.latitudes=searchForm.getLatitude();
  	$scope.longitudes=searchForm.getLongitude();
  	$scope.boundingBoxes=searchForm.getBoundingBoxes();
  	$scope.datapublishers=searchForm.getDatapublisher();
  	$scope.datasets=searchForm.getDataset();
  	$scope.dates=searchForm.getDate();
  	$scope.georeferences = searchForm.getGeoreferencedData();
  	$scope.datapublisherDataset = searchForm.getDatapublisherDataset();

	$scope.json = searchForm.buildJson();

	$http.post("http://localhost:9000/", $scope.json)
		.success(function(data, status) {
      		$scope.reponse = status;
    	})
    	.error(function(data, status) {
      		$scope.reponse = status;
    	});
}

myApp.controller('CtrlResult', ['$scope', 'searchForm', '$http', CtrlResult]);