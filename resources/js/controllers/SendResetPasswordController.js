'use strict';

Professionals.controller('SendResetPasswordController', ['$scope','$location','$rootScope','CommonService',
function SendResetPasswordController($scope,$location,$rootScope,CommonService) {
   $scope.user = {};
   $scope.goBackRegistration = function(){
        $location.path('/');
    }
    $scope.resetUserPassword = function (e)
    {
        e.preventDefault();
        CommonService.postJsonRequest('api/recoverPassword', $scope.user).then(function (result) {
            if (result.success) {
                $rootScope.$broadcast('alert-event', {type: 'success', msg: result.msg});
            } else{
                $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            }
            $location.path('/');
        });
    };
}]);




