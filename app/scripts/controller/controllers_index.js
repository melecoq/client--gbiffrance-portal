'use strict';

function CtrlIndex($scope, $http, config) {

	var map = L.map('index-map', {
		zoomControl:false,
		dragging:false,
		scrollWheelZoom: false,
		doubleClickZoom: false,
		boxZoom: false
	}).setView([47.3, -0.89], 2);


	config.then(function(config) {

		// Fond de carte
		var options = {};
		angular.extend(options, config.map.layers.default.options);
		angular.extend(options, {
			noWrap: true,
		});
		var baseLayer = L.tileLayer(config.map.layers.default.url, options);
		baseLayer.addTo(map);

		// Layer GBIF
		L.tileLayer('http://api.gbif.org/v0.9/map/density/tile?key=FR&x={x}&y={y}&z={z}&type=PUBLISHING_COUNTRY&palette=red', {
			attribution: 'GBIF',
			maxZoom: 9
		}).addTo(map);

		var datasetStats = $http.get(config.api.endpoint + '/dataset/statistics')
			.success(function(data) {
				$scope.datasetStats = data;
			})

	});
}

myApp.controller('CtrlIndex', CtrlIndex);
