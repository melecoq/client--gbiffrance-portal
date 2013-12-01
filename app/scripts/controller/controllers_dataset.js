
'use strict';

/* Controllers */

function CtrlDataset($scope, $routeParams, $http){

	$http.get("http://localhost:9000/api/dataset/" + $routeParams.id)
		.success(function(data, status) {
      		$scope.reponse = status;
          	$scope.jsonDataset = data;
    	})
    	.error(function(data, status) {
      		$scope.reponse = status;
          	$scope.jsonDataset = data;
    	});

}

myApp.controller('CtrlDataset', ['$scope', '$routeParams', '$http', CtrlDataset]);