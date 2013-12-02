'use strict';

/* Controllers */

function CtrlOccurrence($scope, $routeParams, $http){

	$http.get('http://localhost:9000/api/occurrence/' + $routeParams.id)
		.success(function(data, status) {
			$scope.reponse = status;
			$scope.jsonOccurrence = data;
			var latitude = data.decimalLatitude;
			var longitude = data.decimalLongitude;
			console.log(latitude +" - "+ longitude +"-"+$scope.jsonOccurrence.decimalLongitude);

			if(typeof(latitude) === 'undefined' || typeof(longitude) === 'undefined'){
				var map = L.map('occurrence-map', {zoomControl:false, dragging:false}).setView([47.3, -0.89], 5);

				L.tileLayer('http://{s}.tiles.mapbox.com/v3/timrobertson100.map-x2mlizjd/{z}/{x}/{y}.png', {
					attribution: 'Map data &copy; <a href="http://mapbox.org">MapBox</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
					maxZoom: 18,
					noWrap: true
				}).addTo(map);
			} else {
				var map = L.map('occurrence-map', {zoomControl:false, dragging:false}).setView([latitude, longitude], 5);

				// Fond de carte
				L.tileLayer('http://{s}.tiles.mapbox.com/v3/timrobertson100.map-x2mlizjd/{z}/{x}/{y}.png', {
					attribution: 'Map data &copy; <a href="http://mapbox.org">MapBox</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
					maxZoom: 18,
					noWrap: true
				}).addTo(map);

				var latlng=new L.LatLng(latitude,longitude);

				L.marker(latlng).addTo(map)
			}
		})
		.error(function(data, status) {
			$scope.reponse = status;
			$scope.jsonOccurrence = data;
		});



	


}

myApp.controller('CtrlOccurrence', ['$scope', '$routeParams', '$http', CtrlOccurrence]);