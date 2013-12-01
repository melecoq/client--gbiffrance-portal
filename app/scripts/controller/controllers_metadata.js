'use strict';

/* Controllers */

function CtrlMetadata($scope, $http){
	
	$http.get("http://localhost:9000/api/datapublisher")
		.success(function(data, status) {
      		$scope.reponse = status;
          	$scope.jsonDatapublisher = data;
    	})
    	.error(function(data, status) {
      		$scope.reponse = status;
          	$scope.jsonDatapublisher = data;
    	});

    $http.get("http://localhost:9000/api/dataset")
			.success(function(data, status) {
	      		$scope.reponse = status;
	          	$scope.jsonDataset = data;
	    	})
	    	.error(function(data, status) {
	      		$scope.reponse = status;
	          	$scope.jsonDataset = data;
	    	});
}

myApp.controller('CtrlMetadata', ['$scope', '$http', CtrlMetadata]);