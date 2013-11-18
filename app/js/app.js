
'use strict';

/* App Module */

var myApp = angular.module('portailApp', ['ngRoute', 'ui.bootstrap']).
  	config(['$routeProvider', function($routeProvider) {
  	$routeProvider.
		when('/', {templateUrl: 'portal/index.html'}).
		when('/search/taxa', {templateUrl: 'portal/search/search.taxa.html',   controller: 'CtrlSearch'}).
		when('/search/geography', {templateUrl: 'portal/search/search.geo.html',   controller: 'CtrlSearch'}).
		when('/search/dataset',{templateUrl: 'portal/search/search.dataset.html',   controller: 'CtrlSearch'}).
		when('/search/date',{templateUrl: 'portal/search/search.date.html',   controller: 'CtrlSearch'}).
		when('/dataset',{templateUrl: 'portal/dataset.html',   controller: 'CtrlIndex'}).
      	otherwise({redirectTo: '/'});
	}]);

myApp.factory('searchForm', function(){
		//initialisation
		var scientificNames = [];
		var vernacularNames = [];
		var localities = [];
		var latitudes = [];
		var longitudes = [];
		var datapublishers = [];
		var datasets = [];
		var dates = [];
		var georeferencedData = false;
		var datapublisherDataset = [];

		// Getter and setter for the taxa part
		var getScientificName = function(){
			return scientificNames;
		}
		var addScientificName = function(name){
			scientificNames.push({text:name});
		}
		var removeScientificName = function(index){
			scientificNames.splice(index, 1);
		}
		var getVernacularName = function(){
			return vernacularNames;
		}
		var addVernacularName = function(name){
			vernacularNames.push({text:name});
		}
		var removeVernacularName = function(index){
			vernacularNames.splice(index, 1);
		}

		// Getter and setter for the geography part
		var getLocality = function(){
			return localities;
		}
		var addLocality = function(name){
			localities.push({text:name});
		}
		var removeLocality = function(index){
			localities.splice(index, 1);
		}
		var getLatitude = function(){
			return latitudes;
		}
		var addLatitude = function(number){
			latitudes.push({float:number});
		}
		var getLongitude = function(){
			return longitudes;
		}
		var addLongitude = function(number){
			longitudes.push({float:number});
		}
		var getGeoreferencedData = function(){
			return georeferencedData;
		}
		var addGeoreferencedData = function(checked){
			georeferencedData = checked;
		}

		// Getter and setter for the dataset part
		//DEPRECIED
		var getDatapublisher = function(){
				return datapublishers;
		}
		//DEPRECIED
		var addDatapublisher = function(name){
				datapublishers.push({text:name});
		}
		//DEPRECIED
		var getDataset = function(){
				return datasets;
		}
		//DEPRECIED
		var addDataset = function(name){
				datasets.push({text:name});
		}
		var getDatapublisherDataset = function(){
			return datapublisherDataset;
		}
		var addDatapublisherDataset = function(nameDatapublisher, nameDataset){
			datapublisherDataset.push({datapublisher:nameDatapublisher, dataset:nameDataset});
		}

		// Getter and setter for the date part
		var getDate = function(){
				return dates;
		}
		var addDate = function(date){
				dates.push({dateFormat:date});
		}


		return {
			// Return for the taxa tab
			getScientificName : getScientificName,
			addScientificName : addScientificName,
			removeScientificName : removeScientificName,
			getVernacularName : getVernacularName,
			addVernacularName : addVernacularName,
			removeVernacularName : removeVernacularName,

			// Return for the geography tab
			getLocality : getLocality,
			addLocality : addLocality,
			removeLocality : removeLocality,
			getLatitude : getLatitude,
			addLatitude : addLatitude,
			getLongitude : getLongitude,
			addLongitude : addLongitude,
			getGeoreferencedData : getGeoreferencedData,
			addGeoreferencedData : addGeoreferencedData,

			// Return for the dataset tab
			getDatapublisher : getDatapublisher,
			addDatapublisher : addDatapublisher,
			getDataset : getDataset,
			addDataset : addDataset,
			addDatapublisherDataset:addDatapublisherDataset,
			getDatapublisherDataset:getDatapublisherDataset,


			//Return for the date tab
			getDate : getDate,
			addDate : addDate
		};
	});
