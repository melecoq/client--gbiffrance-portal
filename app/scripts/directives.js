'use strict';

/* Directives */
var dateSlider = function() {

	return {
		require: 'ngModel',
		restrict: 'A',
		scope: {ngModel:'='},
		link: function(scope, element, attrs) {
			var dates = scope.ngModel || {};
			var specialDates = dates.special || [];
			var regularDates = dates.regular || [];
			var values = dates.values || {};
			var left = values.left || specialDates[0] || regularDates[0];
			var right = values.right || regularDates[regularDates.length - 1] || specialDates[specialDates.length - 1];


			function template(dates) {
				var specialDates = dates.special || [];
				var regularDates = dates.regular || [];
				var values = dates.values || {};
				var left = values.left || specialDates[0] || regularDates[0];
				var right = values.right || regularDates[regularDates.length - 1] || specialDates[specialDates.length - 1];

				var li = [];
				angular.forEach(specialDates, function(el){
					this.push('<li class="noyear">' + el + '</li>');
				}, li);
				angular.forEach(regularDates, function(el){
					this.push('<li class="year">' + el + '</li>');
				}, li);

				/*jshint multistr: true */
				return '<div class="slider">\
				    <div class="tipsy"><span></span><div class="arrow"></div></div>\
				    <div class="time">\
				        <div class="trail">\
				            <div class="handle left"></div>\
				            <div class="handle right"></div>\
				        </div>\
				        <ul class="years">' + li.join('') + '</ul>\
				        <div class="range">\
				            <div class="line"></div>\
				        </div>\
				        <div class="visible_years">\
				            <div class="noyear"></div>\
				            <div class="preyear"></div>\
				        </div>\
				    </div>\
				</div>';
			}

			/*jshint unused: vars */
			scope.$watch(dates, function(dates, oldValue) {
				if (dates) {
					var specialDates = dates.special || [];
					var regularDates = dates.regular || [];
					var values = dates.values || {};
					var left = values.left || specialDates[0] || regularDates[0];
					var right = values.right || regularDates[regularDates.length - 1] || specialDates[specialDates.length - 1];

					element.html(template(dates));
					$(element).dateSlider({
						onChange: function (l, r) {
							scope.ngModel.values.left = l;
							scope.ngModel.values.right = r;
						},
						initial: {
							left: left,
							right: right
						}
					});
				}
			});

			element.html(template(dates));

			scope.ngModel.values.left = left;
			scope.ngModel.values.right = right;

			$(element).dateSlider({
				onChange: function (l, r) {
					scope.ngModel.values.left = l;
					scope.ngModel.values.right = r;
				},
				initial: {
					left: left,
					right: right
				}
			});
		}
	};
};

var barsChart = function($parse){
	var directeDefinitionObject = {
		restrict:'E',
		replace:false,
		scope: {data: '=charData'},
		link: function (scope, element, attrs){
			var chart = d3.select(element[0]);
			chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(scope.data).enter().append("div")
             .transition().ease("elastic")
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
		}
	};
	return directeDefinitionObject;
};
