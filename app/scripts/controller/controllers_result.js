'use strict';

/* Controllers */

function CtrlResult($scope, $routeParams, searchForm, $http, config, withMap){
  $scope.scientificNames=searchForm.getScientificName();
  $scope.vernacularNames=searchForm.getVernacularName();
  $scope.localities=searchForm.getLocality();
  $scope.latitudes=searchForm.getLatitude();
  $scope.longitudes=searchForm.getLongitude();
  $scope.boundingBoxes=searchForm.getBoundingBoxes();
  $scope.dates=searchForm.getDate();
  $scope.georeferences = searchForm.getGeoreferencedData();
  $scope.datapublisherDataset = searchForm.getDatapublisherDataset();
  $scope.isCollapsedRecherche = true;
  $scope.json = searchForm.buildJson();

  var url = 'http://localhost:9000/api/search/occurrences';
  if ($routeParams.pageId) {
    url = url + "?page=" + $routeParams.pageId + "&size=" + $routeParams.pageSize;
    $scope.pageId = parseInt($routeParams.pageId, 10);
    $scope.pageSize = parseInt($routeParams.pageSize, 10);
  } else {
    $scope.pageId = 0;
    $scope.pageSize = 10;
  }

  $http.post(url, $scope.json)
    .success(function(data, status, headers) {
      $scope.reponse = status;
      $scope.dataJson = data;
      $scope.totalHits = parseInt(headers('X-Max-Hits') || 0, 10);

    })
    .error(function(data, status) {
      $scope.reponse = status;
      $scope.dataJson = data;
  	});

  $scope.removeScientificName = function(index){
    searchForm.removeScientificName(index);
  };

  $scope.removeVernacularName = function(index){
    searchForm.removeVernacularName(index);
  };

  $scope.removeLocality = function(index){
    searchForm.removeLocality(index);
  };

  $scope.removeLatitude = function(index){
    searchForm.removeLatitude(index);
  };

  $scope.removeLongitude= function(index){
    searchForm.removeLongitude(index);
  };

  $scope.removeDataset = function(index){
    searchForm.removeDataset(index);
  };

  $scope.removeDate = function(index){
    searchForm.removeDate(index);
  };

  var loadMarkerPopup = function(marker, element) {
    return function() {
      $http.get('http://localhost:9000/api/occurrence/' + element.id)
        .success(function(data, status){
          marker.bindPopup('<a href="#/occurrence/'+element.id+'">'+data.scientificName+'</a>').openPopup()
        });
    };
  };

  if(withMap) {
    config.then(function(config){
      var franceMetropolitan = new L.LatLng(
        config.map.franceMetropolitan.lat,
        config.map.franceMetropolitan.lon);

      var map = L.map('result-map', {
        zoomControl: true,
        dragging: true,
        center: franceMetropolitan,
        zoom: config.map.franceMetropolitan.zoom
      });

      // Fond de carte
      var options = {};
      angular.extend(options, config.map.layers.default.options);
      angular.extend(options, {
        noWrap: true
      });
      L.tileLayer(config.map.layers.default.url, options).addTo(map);

      var canvasTiles = L.tileLayer.canvas({
        //async: true
      });
      canvasTiles.drawTile = function(canvas, tilePoint, zoom) {

        // Get back tile bounds
        var tileSize = canvasTiles.options.tileSize;

        var nwPoint = tilePoint.multiplyBy(tileSize);
        var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));

        var nwCoord = map.unproject(nwPoint, zoom, true);
        var seCoord = map.unproject(sePoint, zoom, true);

        $http.post('http://localhost:9000/api/search/occurrences/tile/'
          + nwCoord.lat + '/'
          + nwCoord.lng + '/'
          + seCoord.lat + '/'
          + seCoord.lng, $scope.json)
          .success(function(data, status, h) {
            var content = {
              max: parseInt(h('X-Max-Hits') || 0, 10) * 2,
              data: data.filter(function(e) {return e.count > 0;}).map(function(e) {
                var x = (e.lng - nwCoord.lng) / (seCoord.lng - nwCoord.lng) * $(canvas).width();
                var y = $(canvas).height() - (e.lat - seCoord.lat ) / (nwCoord.lat - seCoord.lat) * $(canvas).height();

                return {
                  x: x,
                  y: y,
                  count: e.count
                };
              })
            };

            // Get total of content
            var total = 0;
            content.data.map(function(e){
              total += e.count;
            });

            if (total >= 500 || total >= 15 * (18 - map.getZoom())) {
              // We have too many elements in there. We need to display them as squares ...

              var doc = $('<div></div>');
              doc.attr('style', $(canvas).attr('style'));
              doc.attr('class', $(canvas).attr('class'));
              doc.height($(canvas).height());
              doc.width($(canvas).width());
              doc.attr('data-nw', nwCoord);
              doc.attr('data-se', seCoord);
              var elem = $(canvas).replaceWith(doc);

              var heatmap = h337.create({
                element: doc[0],
                radius: 30,
                opacity: 100,
                'visible': true
              });

              heatmap.store.setDataSet(content);
            } else {
              $http.post('http://localhost:9000/api/search/occurrences/markers/'
                + nwCoord.lat + '/'
                + nwCoord.lng + '/'
                + seCoord.lat + '/'
                + seCoord.lng, $scope.json)
                .success(function(data, status){
                  var lg = L.layerGroup();
                  data.map(function(element) {
                    var marker = L.marker([element.lat, element.lng]);

                    // Bind popup to the marker
                    marker.on('click', loadMarkerPopup(marker, element));
                    lg.addLayer(marker);
                  });

                  var originalZoom = map.getZoom();
                  lg.addTo(map);

                  // If we load another zoom, remove those markers
                  map.on('zoomend', function(){
                    if (map.getZoom() != originalZoom) {
                      map.removeLayer(lg);
                    }
                  });
                });

            }
          });
      }

      canvasTiles.addTo(map);

    });
  }

}

myApp.controller('CtrlResult', ['$scope', '$routeParams', 'searchForm', '$http', 'config', 'withMap', CtrlResult]);