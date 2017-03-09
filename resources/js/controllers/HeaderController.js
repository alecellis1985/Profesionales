'use strict';

Professionals.controller('HeaderController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', '$modal', 'CommonService', 'Helper',
    function HeaderController($scope, $routeParams, $http, $rootScope, $location, $modal, CommonService, Helper) {
        $scope.template = {
            "header": "resources/tpl/header.html"
        };

        $scope.items = ['item1', 'item2', 'item3'];
        $scope.collapsed = false;

        $scope.ingresarAction = function (evt, size) {
            evt.preventDefault();
            evt.stopPropagation();
            var modalInstance = $modal.open({
                templateUrl: 'resources/tpl/login.html',
                controller: 'LoginController',
                size: size
                        //        resolve: {
                        //          items: function () {
                        //            return $scope.items;
                        //          }
                        //        }
            });
            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
//                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.salirAction = function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            CommonService.postJsonRequest('api/logout-user', {}).then(function (result) {
                if (result.success) {
                    $location.path('/');
                    $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Ha salido con éxito! Hasta la próxima :)'});
                    delete $rootScope.user;
                } else
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            });

        };


        $scope.init = function () {
            Helper.getUser().then();
        };
        //Execute the initial funcitons
        $scope.init();
    }]);

