'use strict';

Professionals.controller('EditPwdController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', '$modalInstance', 'CommonService',
    function EditPwdController($scope, $routeParams, $http, $rootScope, $location, $modalInstance, CommonService) {
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.userPwd = {};

        $scope.editarPwd = function (e)
        {
            e.preventDefault();
            var data = {
                'oldPwd': $scope.userLogin.oldPwd,
                'newPwd': $scope.userLogin.newPwd
            };
            CommonService.postJsonRequest('api/edit-user-pwd', data).then(function (result) {
                if (result.success) {
                    $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Contraseña actualizada correctamente !'});
                    $modalInstance.close(0);
                } else
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            });
        };

    }]);