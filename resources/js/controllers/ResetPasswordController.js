'use strict';

Professionals.controller('ResetPasswordController', ['$scope', '$routeParams', '$rootScope', '$location','CommonService',
function ResetPasswordController($scope, $routeParams,$rootScope, $location,CommonService) {
   $scope.userPwd = {'token':$routeParams.token};

    $scope.editarPwd = function ()
    {
        CommonService.postJsonRequest('api/resetPasswordToken', $scope.userPwd).then(function (result) {
            if (result.success) {
                $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Contraseña actualizada correctamente !'});
            } else{
                $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            }
            $location.path('/');
        });
    };
}]);