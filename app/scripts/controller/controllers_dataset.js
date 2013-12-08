
'use strict';

/* Controllers */

function CtrlDataset($scope, $routeParams, $http, config){

	var datasetId = $routeParams.id;

	// Once we get config, display the map
	config.then(function(config){
		var dataset = $http.get(config.api.endpoint + '/dataset/' + $routeParams.id);

		dataset.then(function(dataset){
			$scope.jsonDataset = dataset.data;
			console.log($scope.jsonDataset);

			$http.get(config.api.endpoint + '/datapublisher/'+ $scope.jsonDataset.dataPublisher['$id'])
				.success(function(data) {
					$scope.dataPublisherName = data.name;
				});
		});

		var datasetStats = $http.get(config.api.endpoint + '/dataset/' + $routeParams.id + '/stats')
			.success(function(data) {
				$scope.datasetStats = data;
			})


		dataset.then(function(dataset){

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
			var baseLayer = L.tileLayer(config.map.layers.default.url, options);
			baseLayer.addTo(map);


			// Dataset information
			var layer = L.tileLayer('http://www.gbif.fr/mbtiles/datasets/dataset_{datasetId}/{z}/{x}/{y}.png', {
				datasetId: datasetId
			});
			layer.addTo(map);

		});
	});

}

myApp.controller('CtrlDataset', ['$scope', '$routeParams', '$http', 'config', CtrlDataset]);
