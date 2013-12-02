'use strict';

/* Controllers */

function CtrlDatapublisher($scope, $routeParams, $http, config){

	$http.get('http://localhost:9000/api/datapublisher/' + $routeParams.id)
		.success(function(data, status) {
			$scope.reponse = status;
			$scope.jsonDatapublisher = data;
		})
		.error(function(data, status) {
			$scope.reponse = status;
			$scope.jsonDatapublisher = data;
		});

	var datasets = $http.get('http://localhost:9000/api/dataset');

	var filteredDatasets = datasets.then(function(data, status) {
		$scope.datasets = data.data.filter(function(el) {
			return el.dataPublisher.id == $routeParams.id;
		});
		return $scope.datasets;
	})


	config.then(function(config){
		filteredDatasets.then(function(filteredDatasets){

			var franceMetropolitan = new L.LatLng(
				config.map.franceMetropolitan.lat,
				config.map.franceMetropolitan.lon);

			// Generate map
			var map = L.map('map', {
				zoomControl: true,
				dragging: true,
				center: franceMetropolitan,
				zoom: config.map.franceMetropolitan.zoom
			});


			// Map background
			var options = {};
			angular.extend(options, config.map.layers.default.options);
			angular.extend(options, {
				noWrap: true
			});
			var baseLayer = L.tileLayer(config.map.layers.default.url, options)
			baseLayer.addTo(map);


			// Dataset information
			filteredDatasets.map(function(dataset){
				var layer = L.tileLayer("http://www.gbif.fr/mbtiles/datasets/dataset_{datasetId}/{z}/{x}/{y}.png", {
					datasetId: dataset.id
				});
				layer.addTo(map);
			});
		});
	});

}

myApp.controller('CtrlDatapublisher', ['$scope', '$routeParams', '$http', 'config', CtrlDatapublisher]);

