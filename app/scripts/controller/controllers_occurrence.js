'use strict';

/* Controllers */

function CtrlOccurrence($scope, $routeParams, $http, config){

	config.then(function(config){

		$http.get(config.api.endpoint + '/occurrence/' + $routeParams.id)
			.success(function(data, status) {
				$scope.reponse = status;
				$scope.jsonOccurrence = data;
				var latitude = data.decimalLatitude;
				var longitude = data.decimalLongitude;
				var url = 'http://api.gbif.org/v0.9/species/' + data.ecatConceptId;
				$scope.genusKey = '';
				$scope.familyKey = '';
				$scope.orderKey = '';
				$scope.classKey = '';
				$scope.phylumKey = '';
				$scope.kingdomKey = '';


				$http.get(url)
					.success(function(data) {
						$scope.genusKey = data.genusKey;
						$scope.familyKey = data.familyKey;
						$scope.orderKey = data.orderKey;
						$scope.classKey = data.classKey;
						$scope.phylumKey = data.phylumKey;
						$scope.kingdomKey = data.kingdomKey;
					});

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

				if (typeof(latitude) !== 'undefined' && typeof(longitude) !== 'undefined') {
					var latlng=new L.LatLng(latitude,longitude);

					L.marker(latlng).addTo(map);

					map.setView([latitude, longitude], config.map.franceMetropolitan.zoom);
				}
			})
			.error(function(data, status) {
				$scope.reponse = status;
				$scope.jsonOccurrence = data;
			});

	});

}

myApp.controller('CtrlOccurrence', ['$scope', '$routeParams', '$http', 'config', CtrlOccurrence]);
