'use strict';

/* Controllers */

function CtrlMetadata($scope, $http, $q, config){
	
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

	var mapInfoDefer = $q.defer();
	var mapInfo = mapInfoDefer.promise;

	// Once we get config, display the map
	config.then(function(config){

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


		// Store informations for future use in global context
		mapInfoDefer.resolve({
			map: map,
			baseLayer: baseLayer,
			layers: {}
		});

	});

	// Adds a layer to map showing the new dataset
	$scope.toggleDataset = function(datasetId) {
		console.log("toggleoutside", datasetId);
		config.then(function(config){
			mapInfo.then(function(info){
				console.log("toggleinside", datasetId);
				if (info.layers[datasetId]) {
					// Unset layer and remove it
					info.map.removeLayer(info.layers[datasetId]);
					delete info.layers[datasetId];

					delete $scope.datasetShown[datasetId];
				} else {
					// Set layer
					var layer = L.tileLayer("http://www.gbif.fr/mbtiles/datasets/dataset_{datasetId}/{z}/{x}/{y}.png", {
						datasetId: datasetId
					});
					layer.addTo(info.map);

					// Store layer
					info.layers[datasetId] = layer;

					$scope.datasetShown[datasetId] = true;
				}
			});
		});
	};

	$scope.datasetShown = {};

};

myApp.controller('CtrlMetadata', ['$scope', '$http', '$q', 'config', CtrlMetadata]);