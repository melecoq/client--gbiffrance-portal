'use strict';

/* Controllers */

function CtrlDatapublisher($scope, $routeParams, $http){

	$http.get('http://localhost:9000/api/datapublisher/' + $routeParams.id)
		.success(function(data, status) {
			$scope.reponse = status;
			$scope.jsonDatapublisher = data;
		})
		.error(function(data, status) {
			$scope.reponse = status;
			$scope.jsonDatapublisher = data;
		});

	$http.get('http://localhost:9000/api/dataset')
		.success(function(data, status) {
			$scope.datasets = data.filter(function(el) {
				return el.dataPublisher.id == $routeParams.id;
			});
		})

}

myApp.controller('CtrlDatapublisher', ['$scope', '$routeParams', '$http', CtrlDatapublisher]);

