'use strict';

Professionals.controller('LoginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', '$modalInstance', 'CommonService',
    function LoginController($scope, $routeParams, $http, $rootScope, $location, $modalInstance, CommonService) {
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function (e) {
            e.preventDefault();
            $modalInstance.dismiss('cancel');
        };
        $scope.userLogin = {};
        
        $scope.closeModal = function(e){
            e.preventDefault();
            $modalInstance.dismiss('cancel');
            $location.path('/restaurar-password');
        }

        $scope.loginUser = function (e)
        {
            e.preventDefault();
            var data = {
                'username': $scope.userLogin.username,
                'password': $scope.userLogin.password
            };
            //CommonService.postJsonRequest('api/login-user', data).then(function (result) {
            CommonService.postUrlEncoded('api/login-user', data).then(function (result) {   
                if (result.success) {
                    $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Bienvenido ' + result.data.username + ' !'});
                    $rootScope.user = result.data;
                    $modalInstance.close(0);
                    if($rootScope.user.IsAdmin){
                        $location.path('/administrar-users');
                    }
                    else
                    { 
                        $location.path('/ver-usuario');
                    }
                } else
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            });
        };

    }]);