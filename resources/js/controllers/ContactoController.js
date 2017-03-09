'use strict';

Professionals.controller('ContactoController', ['$scope', '$routeParams', '$http', '$rootScope', '$location','CommonService', 
    function ContactoController($scope, $routeParams, $http, $rootScope, $location,CommonService) {
    goToTop();
          
    $scope.enviarMail = function(isValid){
        if (!isValid ) {
            $rootScope.$broadcast('alert-event', {type: 'danger', msg: "Existen errores en el formulario!"});
            return;
        } 
        CommonService.postJsonRequest('api/sendMail', $scope.user).then(function (result) {
            if (result.success) {
                $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Se ha enviado un email a el profesional seleccionado.'});
            } else{
                $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            }
            $location.path('/');
        });
    };
}]);

