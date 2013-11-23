'use strict';

function CtrlIndex($scope) {

	$scope.MapIndex= function(){
		var map = L.map('index-map', {zoomControl:false, dragging:false}).setView([47.3, -0.89], 1);

		// Fond de carte
		L.tileLayer('http://{s}.tiles.mapbox.com/v3/timrobertson100.map-x2mlizjd/{z}/{x}/{y}.png', {
	    	attribution: 'Map data &copy; <a href="http://mapbox.org">MapBox</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	    	maxZoom: 18,
	    	noWrap: true
		}).addTo(map);

		// Layer GBIF
		L.tileLayer('http://api.gbif.org/v0.9/map/density/tile?key=FR&x={x}&y={y}&z={z}&type=PUBLISHING_COUNTRY&palette=greens', {
	    	attribution: 'GBIF',
	    	maxZoom: 9
		}).addTo(map);
	};
}

function ChangeView($scope, $location) {
	$scope.changeView = function(view){
		$location.path(view);
	}
}

myApp.controller('CtrlIndex', ['$scope', '$routeParams', CtrlIndex]);
