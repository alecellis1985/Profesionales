/* Element exmpl 
 [{
 city : 'Toronto',
 desc : 'This is the best city in the world!',
 lat : 43.7000,
 long : -79.4000
 }]
 */
Professionals.directive('mapLoadMarkers', function () {
    return {
        restrict: 'E',
        scope: {
            //mapOptions: '=',
            locations: '='
        },
        template: '<div class="row">' +
                '<div class="col-xs-12 col-md-12 col-sm-12">' +
                '<div class="GoogleMap  col-xs-12 col-md-12 col-sm-12"></div>' +
                '</div>' +
                '</div>',
        link: function ($scope, element, attr) {
            //default is montevideo
            //$scope.mapOptions = $scope.mapOptions || {
            $scope.mapOptions = {  
                zoom: 8,
                center: new google.maps.LatLng(-34.8746349, -56.1472729),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };

            $scope.map = new google.maps.Map(element.find('.GoogleMap')[0], $scope.mapOptions);

            $scope.markers = [];

            var infoWindow = new google.maps.InfoWindow();

            $scope.createMarker = function (info) {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.latitude, info.longitude),
                    title: info.city
                });
//                marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
//
//                google.maps.event.addListener(marker, 'click', function () {
//                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
//                    infoWindow.open($scope.map, marker);
//                });

                $scope.markers.push(marker);
            };

            if ($scope.locations !== undefined)
            {
                var length = $scope.locations.length;
                for (var i = 0; i < length; i++) {
                    $scope.createMarker($scope.locations[i]);
                }
            }

            $scope.openInfoWindow = function (e, selectedMarker) {
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            };
        }
    };
});

Professionals.directive('mapSetMarkers', function () {
    return {
        restrict: 'E',
        scope: {
            markersArr: '='
        },
        template: '<div class="row">' +
                '<div class="form-group col-xs-12 col-md-2">' +
                '<button ng-enabled="!markerOn" ng-click="setMarkerOn($event)" class="btn btn-primary pull-left">Agregar marcador</button>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 col-sm-12">' +
                '<div class="GoogleMap  col-xs-12 col-md-12 col-sm-12"></div>' +
                '</div>' +
                '</div>',
//        template:'<div class="GoogleMap col-xs-12 col-md-12 col-sm-12"></div>',
        link: function ($scope, element, attr) {
            //Default is montevideo
            $scope.mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.8746349, -56.1472729),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };


            $scope.markerOn = false;
            $scope.selectedMarker = null;

            $scope.setMarkerOn = function (e) {
                e.preventDefault();
                $scope.markerOn = true;
            };

            $scope.map = new google.maps.Map(element.find('.GoogleMap')[0], $scope.mapOptions);
            
            google.maps.event.addListener($scope.map, 'click', function (event) {
                if ($scope.markerOn) {
                    $scope.markerOn = false;
                    $scope.placeMarker(event.latLng);
                }
            });

            var infoWindow = new google.maps.InfoWindow();

            $scope.placeMarker = function (location) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: $scope.map
                });

                google.maps.event.addListener(marker, 'click', markerClick);

                $scope.markersArr.push(marker);
            };

            /*$scope.loadMarker = function (info, position) {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.latitude, info.longitude)
                });

                google.maps.event.addListener(marker, 'click', markerClick);
                $scope.markersArr[position] = marker;
            };*/

            function markerClick() {
                infoWindow.setContent('<button class="btn btn-primary pull-left deleteMarker">Borrar?</button>');
                infoWindow.open($scope.map, this);
                $scope.selectedMarker = this;
            }

            $scope.openInfoWindow = function (e, selectedMarker) {
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            };

            $scope.clearMarkers = function (e) {
                e.preventDefault();
                var arrLength = $scope.markersArr.length;
                for (var i = 0; i < arrLength; i++) {
                    $scope.markersArr[i].setMap(null);
                }
                $scope.markersArr = [];
            };

            $(document).on('click', '.deleteMarker', deleteMarker);

            function deleteMarker(e) {
                e.preventDefault();
                var arrLength = $scope.markersArr.length;
                var toDelete = $scope.selectedMarker;
                $scope.selectedMarker.setMap(null);
                $scope.selectedMarker = null;
                
                var arrLength = $scope.markersArr.length;
                while(arrLength--) {
                    if($scope.markersArr[arrLength] === toDelete){
                        $scope.markersArr[arrLength].setMap(null);
                        $scope.markersArr.splice(arrLength,1);
                    }
                }
            }

            if ($scope.markersArr !== undefined)
            {
                var length = $scope.markersArr.length;
                var allMarkers = [];
                while(length--){
                    allMarkers.push($scope.markersArr.pop());
                }
                var allMarkersLength = allMarkers.length;
                for (var i = 0; i < allMarkersLength; i++) {
                    var pos = new google.maps.LatLng(allMarkers[i].latitude, allMarkers[i].longitude);
                    $scope.placeMarker(pos);
                }
            }
            
            $scope.$on('$destroy', function() {
                $(document).off('click', '.deleteMarker', deleteMarker);
            });
        }
    };
});