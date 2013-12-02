
'use strict';

/* App Module */

var myApp = angular.module('portailApp', ['ngRoute', 'ui.bootstrap', 'ui.select2'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {templateUrl: 'portal/index.html'})
			.when('/search/taxa',      {templateUrl: 'portal/search/search.taxa.html',       controller: 'CtrlSearch', resolve: {
				withMap: function () { return false; }
			}})
			.when('/search/geography', {templateUrl: 'portal/search/search.geo.html',        controller: 'CtrlSearch', resolve: {
				withMap: function () { return true; }
			}})
			.when('/search/dataset',   {templateUrl: 'portal/search/search.dataset.html',    controller: 'CtrlSearch', resolve: {
				withMap: function () { return false; }
			}})
			.when('/search/date',           {templateUrl: 'portal/search/search.date.html',       controller: 'CtrlSearch', resolve: {
				withMap: function () { return false; }
			}})
			.when('/metadata',              {templateUrl: 'portal/metadata/metadata.html',          controller: 'CtrlMetadata'})
			.when('/dataset/:id',           {templateUrl: 'portal/dataset/show.html',           controller: 'CtrlDataset'})
			.when('/datapublisher/:id',     {templateUrl: 'portal/datapublisher/show.html',         controller: 'CtrlDatapublisher'})
			.when('/occurrence/:id',        {templateUrl: 'portal/occurrence/show.html',            controller:'CtrlOccurrence'})
			.when('/result/taxa',       {templateUrl: 'portal/result/result.taxa.html',       controller: 'CtrlResult', resolve: {
				withMap: function () { return false; }
			}})
			.when('/result/occurrence', {templateUrl: 'portal/result/result.occurrence.html', controller: 'CtrlResult', resolve: {
				withMap: function () { return true; }
			}})
			.when('/result/stat',       {templateUrl: 'portal/result/result.stat.html',       controller: 'CtrlResult', resolve: {
				withMap: function () { return false; }
			}})
			.when('/result/map',        {templateUrl: 'portal/result/result.map.html',        controller: 'CtrlResult', resolve: {
				withMap: function () { return false; }
			}})
			.when('/occurrence/:id',    {templateUrl: 'portal/occurrence/show.html',            controller:'CtrlOccurrence'})
			.otherwise({redirectTo: '/'});
	}])
	.directive('dateSlider', dateSlider);

myApp.factory('config', function($q) {

	var defer = $q.defer();

	defer.resolve({
		map: {
			franceMetropolitan: {
				lat: 47.0176,
				lon: 2.3427,
				zoom: 5
			},
			layers: {
				default: {
					url: 'http://{s}.tiles.mapbox.com/v3/examples.map-dev-fr/{z}/{x}/{y}.png',
					options:{
						attribution: 'Map data &copy; <a href="http://mapbox.org">MapBox</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
						maxZoom: 18
					}
				}
			}
		}
	});

	return defer.promise;
});

myApp.factory('searchForm', function(){
	//initialisation
	var scientificNames = [];
	var vernacularNames = [];
	var localities = [];
	var latitudes = [];
	var longitudes = [];
	var boundingBoxes = [];
	var datapublishers = [];
	var datasets = [];
	var date = undefined;
	var georeferencedData = false;
	var datapublisherDataset = {empty: function() {
		var self = this;

		return Object.keys(self).length <= 1;
	}};

	// Getter and setter for the taxa part
	var getScientificName = function(){
		return scientificNames;
	};
	var addScientificName = function(name, level){
		scientificNames.push({text:name, rank:level});
	};
	var removeScientificName = function(index){
		scientificNames.splice(index, 1);
	};
	var getVernacularName = function(){
		return vernacularNames;
	};
	var addVernacularName = function(name){
		vernacularNames.push({text:name});
	};
	var removeVernacularName = function(index){
		vernacularNames.splice(index, 1);
	};

	// Getter and setter for the geography part
	var getLocality = function(){
		return localities;
	};
	var addLocality = function(name, bound){
		localities.push({text:name, bounds:bound});
	};
	var removeLocality = function(index){
		localities.splice(index, 1);
	};
	var getLatitude = function(){
		return latitudes;
	};
	var addLatitude = function(number, filter){
		latitudes.push({bound:number, filter: filter});
	};
	var removeLatitude = function(index){
		latitudes.splice(index, 1);
	};
	var getLongitude = function(){
		return longitudes;
	};
	var addLongitude = function(number, filter){
		longitudes.push({bound:number, filter: filter});
	};
	var removeLongitude = function(index){
		longitudes.splice(index, 1);
	};
	var getGeoreferencedData = function(){
		return georeferencedData;
	};
	var addGeoreferencedData = function(checked){
		georeferencedData = checked;
	};

	var addBoundingBox = function(bounds, name){
		boundingBoxes.push({bounds: bounds, name: name || 'Bounding Box'});
	};
	var getBoundingBoxes = function(){
		return boundingBoxes;
	};
	var removeBoundingBox = function(bounds){
		boundingBoxes = boundingBoxes.filter(function(b){
			return !b.bounds.equals(bounds);
		});
	};

	// Getter and setter for the dataset part
	var getDatapublisherDataset = function(){
		return datapublisherDataset;
	};
	var addDatapublisher = function(datapublisherId, datapublisherName, datasets) {
		var datapublisher = datapublisherDataset[datapublisherId] || {};
		datapublisher.id = datapublisherId;
		datapublisher.includeAll = true;
		datapublisher.name = datapublisherName;
		datapublisher.datasets = {};
		datasets.map(function(el) {
			datapublisher.datasets[el.id] = el;
		});

		datapublisherDataset[datapublisherId] = datapublisher;
	};
	var addDataset = function(datapublisherId, datapublisherName, datasetId, datasetName) {
		var datapublisher = datapublisherDataset[datapublisherId] || {};
		datapublisher.datasets = datapublisher.datasets || {};

		datapublisher.id = datapublisherId;
		datapublisher.includeAll = datapublisher.includeAll || false;
		datapublisher.name = datapublisherName;
		datapublisher.datasets[datasetId] = datasetName;

		datapublisherDataset[datapublisherId] = datapublisher;
	};
	var removeDataset = function(id){
		for (var key in datapublisherDataset) {
			if (typeof(datapublisherDataset[key]) === 'object') {
				delete datapublisherDataset[key].datasets[id];
				if (Object.keys(datapublisherDataset[key].datasets).length === 0 && !datapublisherDataset[key].includeAll) {
					delete datapublisherDataset[key];
				}
			}
		}
	};
	var removeDatapublisher = function(id){
		delete datapublisherDataset[id];
	};

	// Getter and setter for the date part
	var getDate = function(){
		// return a shallow copy
		if (date) {
			return {
				beginDate: date.beginDate,
				endDate: date.endDate
			};
		}
	};
	var setDate = function(left, right){
		date = {
			beginDate: left,
			endDate: right
		};
	};
	var removeDate = function(index){
		date = undefined;
	};

	var buildJson = function(){
		var dsets = [];

		for (var key in datapublisherDataset) {
			if (typeof(datapublisherDataset[key]) === 'object') {
				for (var subkey in datapublisherDataset[key].datasets) {
					dsets.push(subkey);
				}
			}
		}

		var json = {
			'scientificNames': scientificNames.map(function(scientificName){
				return {scientificName:scientificName.text, rank:scientificName.rank};
			}),
			'vernacularName': vernacularNames.map(function(vernacularName){
				return vernacularName.text;
			}),
			'localities':localities.map(function(locality){
				return{name:locality.text, bounds:locality.bounds};
			}),
			'latitude': latitudes,
			'longitude':longitudes,
			'geolocalizedData': georeferencedData,
			'boundingBox': boundingBoxes,
			'date': date,
			'dataset': dsets
		};
		return json;
	};


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
		removeLatitude : removeLatitude,
		getLongitude : getLongitude,
		addLongitude : addLongitude,
		removeLongitude : removeLongitude,
		getGeoreferencedData : getGeoreferencedData,
		addGeoreferencedData : addGeoreferencedData,
		getBoundingBoxes: getBoundingBoxes,
		addBoundingBox: addBoundingBox,
		removeBoundingBox: removeBoundingBox,

		// Return for the dataset tab
		getDatapublisherDataset:getDatapublisherDataset,
		addDatapublisher : addDatapublisher,
		addDataset: addDataset,
		removeDataset : removeDataset,
		removeDatapublisher : removeDatapublisher,

		//Return for the date tab
		getDate : getDate,
		setDate : setDate,
		removeDate : removeDate,

		buildJson : buildJson
	};
});
