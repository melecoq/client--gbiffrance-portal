'use strict';

/* Controllers */

function CtrlDatapublisher($scope, $routeParams, $http){

	$http.get("http://localhost:9000/api/datapublisher/" + $routeParams.id)
		.success(function(data, status) {
      		$scope.reponse = status;
          	$scope.jsonDatapublisher = data;
    	})
    	.error(function(data, status) {
      		$scope.reponse = status;
          	$scope.jsonDatapublisher = data;
    	});

}

myApp.controller('CtrlDatapublisher', ['$scope', '$routeParams', '$http', CtrlDatapublisher]);