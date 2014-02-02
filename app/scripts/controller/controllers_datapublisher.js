'use strict';
/* Controllers */

function CtrlDatapublisher($scope, $routeParams, $http, config){

	config.then(function(config){
		$http.get(config.api.endpoint + '/datapublisher/' + $routeParams.id)
			.success(function(data) {
				$scope.jsonDatapublisher = data;
			})
			.error(function(data) {
				$scope.jsonDatapublisher = data;
			});

		var datasets = $http.get(config.api.endpoint + '/dataset');

		var filteredDatasets = datasets.then(function(data) {
			$scope.datasets = data.data.filter(function(el) {
				return el.dataPublisher.id == $routeParams.id;
			});
			return $scope.datasets;
		});


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
			var baseLayer = L.tileLayer(config.map.layers.default.url, options);
			baseLayer.addTo(map);


			// Dataset information
			filteredDatasets.map(function(dataset){
				var layer = L.tileLayer('http://www.gbif.fr/mbtiles/datasets/dataset_{datasetId}/{z}/{x}/{y}.png', {
					datasetId: dataset.id
				});
				layer.addTo(map);
			});
		});
	});

}

myApp.controller('CtrlDatapublisher', ['$scope', '$routeParams', '$http', 'config', CtrlDatapublisher]);

