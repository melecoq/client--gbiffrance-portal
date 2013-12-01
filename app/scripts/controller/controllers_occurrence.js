'use strict';

/* Controllers */

function CtrlOccurrence($scope, $routeParams, $http){

	$http.get('http://localhost:9000/api/occurrence/' + $routeParams.id)
		.success(function(data, status) {
			$scope.reponse = status;
			$scope.jsonOccurrence = data;
		})
		.error(function(data, status) {
			$scope.reponse = status;
			$scope.jsonOccurrence = data;
		});

}

myApp.controller('CtrlOccurrence', ['$scope', '$routeParams', '$http', CtrlOccurrence]);