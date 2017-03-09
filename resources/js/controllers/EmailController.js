'use strict';

Professionals.controller('EmailController', ['$scope','$rootScope', '$location', '$modalInstance', 'CommonService','email',
    function EmailController($scope,$rootScope, $location, $modalInstance, CommonService,email) {
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function (e) {
            e.preventDefault();
            $modalInstance.dismiss('cancel');
        };
        
        $scope.user = {contactemail:email};
        
        $scope.closeModal = function(e){
            e.preventDefault();
            $modalInstance.dismiss('cancel');
            $location.path('/restaurar-password');
        }
        
        $scope.enviarMail = function(isValid){
            if (!isValid ) {
                $rootScope.$broadcast('alert-event', {type: 'danger', msg: "Existen errores en el formulario!"});
                return;
            } 
            CommonService.postJsonRequest('api/sendMailContact', $scope.user).then(function (result) {
                if (result.success) {
                    $rootScope.$broadcast('alert-event', {type: 'success',  msg: result.msg});
                } else{
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
                }
                $modalInstance.dismiss('cancel');
                $location.path('/');
            });
        };
    }]);


