'use strict';

Professionals.controller('UsersController', ['$scope', '$routeParams', '$http', '$rootScope', '$timeout', '$location', 'CommonService','Helper', function ($scope, $routeParams, $http, $rootScope, $timeout, $location, CommonService,Helper) {

        $scope.users = [];
        $scope.loader = true;
        $scope.showUnauthorized = false;
        $scope.currentUserIsAdmin = false;
        
        $scope.planes = 
        {1:'Profesional Basico Mensual',
        2:'Profesional Premium Mensual',
        3:'Profesional Basico Semestral',
        4:'Profesional Basico Anual',
        5:'Profesional Premium Semestral',
        6:'Profesional Premium Anual',
        7:'Empresarial Basico Mensual',
        8:'Empresarial Premium Mensual',
        9:'Empresarial Basico Semestral',
        10:'Empresarial Basico Anual',
        11:'Empresarial Premium Semestral',
        12:'Empresarial Premium Anual',
        13:'Profesional Basico Trimestral',
        14:'Empresarial Premium Trimestral',
        15:'Profesional Premium Trimestral',
        16:'Empresarial Basico Trimestral'
    };

        $scope.getAllUsers = function () {
            $timeout(function () {
                CommonService.getRequest('api/users').then(function (data) {
                    data.data.map(function(elem){
                        elem.planDesc = $scope.planes[elem.plan];
                    });
                    $scope.users = data.data;
                    $scope.loader = false;
                });
            }, 1000);
        };
        
        $scope.updateDb = function()
        {   
            CommonService.getRequest('api/updateDb');
        }
        
        $scope.cambiarPremuimState = function(){
            if($scope.mostrarPremiumUsersActivos === 0){
                $scope.mostrarPremiumUsersActivos = 1;
            }
            else{
                $scope.mostrarPremiumUsersActivos = 0;
            }
        }
        
        $scope.mostrarPremiumUsersActivos = 0;
        
        $scope.premiumPlans = [2,5,6,8,11,12];
        $scope.premium = function (item) { 
            return $scope.premiumPlans.indexOf(item.plan) !== -1 && item.IsActive === $scope.mostrarPremiumUsersActivos ;
        };
        
        $scope.cambiarNoPremuimState = function(){
            if($scope.mostrarNoPremiumUsersActivos === 0){
                $scope.mostrarNoPremiumUsersActivos = 1;
            }
            else{
                $scope.mostrarNoPremiumUsersActivos = 0;
            }
        }
        
        $scope.getFullDate = function(){
            var h = new Date();
            return h.getFullYear() +'-' +(h.getMonth()+1)+'-'+ h.getDay();
        }
        
        $scope.mostrarNoPremiumUsersActivos = 0;
        $scope.noPremium = function (item) { 
            return $scope.premiumPlans.indexOf(item.plan) === -1 && item.IsActive === $scope.mostrarNoPremiumUsersActivos ;
        };
        
        $scope.init = function () {
            Helper.getUser().then(function(user){
                if (user.IsAdmin){
                    $scope.currentUserIsAdmin = true;
                    $scope.getAllUsers();
                }else{
                    $scope.showUnauthorized = true;
                }
            })
        };

        $scope.changeUserState = function (user) {
            CommonService.postJsonRequest('api/update_userState', {'username': user.username}).then(function (result) {
                if (result.success) {
                    user.IsActive = user.IsActive === 1 ? 0 : 1;
                    $rootScope.$broadcast('alert-event', {type: 'success', msg: result.msg});
                } else
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            });
        }
        
        $scope.deleteUser = function (user) {
            CommonService.postJsonRequest('api/deleteuser', {'idUser': user.idUser,'imagenUrl':user.imagenUrl}).then(function (result) {
                if (result.success) {
                    var length = $scope.users.length;
                    while(length--){
                        if($scope.users[length].idUser === user.idUser){
                            $scope.users.splice(length,1);
                        }
                    }
                    $rootScope.$broadcast('alert-event', {type: 'success', msg: result.msg});
                } else{
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
                }
            });
        }
        
        

        $scope.init();


    }]);

