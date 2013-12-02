'use strict';

/* Controllers */

function CtrlOccurrence($scope, $routeParams, $http, config){

	$http.get('http://localhost:9000/api/occurrence/' + $routeParams.id)
		.success(function(data, status) {
			$scope.reponse = status;
			$scope.jsonOccurrence = data;
			var latitude = data.decimalLatitude;
			var longitude = data.decimalLongitude;
			console.log(latitude +" - "+ longitude +"-"+$scope.jsonOccurrence.decimalLongitude);

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

				if (typeof(latitude) !== 'undefined' && typeof(longitude) !== 'undefined') {
					var latlng=new L.LatLng(latitude,longitude);

					L.marker(latlng).addTo(map)
				}
			});
			
		})
		.error(function(data, status) {
			$scope.reponse = status;
			$scope.jsonOccurrence = data;
		});



	


}

myApp.controller('CtrlOccurrence', ['$scope', '$routeParams', '$http', 'config', CtrlOccurrence]);