'use strict';

var Professionals = angular.module('Professionals', ['ngRoute', 'angularFileUpload', 'ui.bootstrap','angularjs-dropdown-multiselect','ng-fi-text','ngAnimate']);

Professionals.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {

        $routeProvider.when('/registro-usuario', {
            templateUrl: 'resources/tpl/registroUsuario.html',
            controller: 'RegisterUserController',
            resolve: {
                departamentosList: function (CommonService) {
                    return CommonService.getRequest('api/departamentos');
                },
                categoriasList: function (CommonService) {
                    return CommonService.getRequest('api/categorias');
                },
                barriosList: function (CommonService) {
                    return CommonService.getRequest('api/barrios');
                },
                planes: function (CommonService) {
                    return CommonService.getRequest('api/userPlans');
                }
            }
        });

        $routeProvider.when('/editar-usuario', {
            templateUrl: 'resources/tpl/editUser.html',
            controller: 'EditUserController',
            resolve: {
                departamentosList: function (CommonService) {
                    return CommonService.getRequest('api/departamentos');
                },
                categoriasList: function (CommonService) {
                    return CommonService.getRequest('api/categorias');
                },
                barriosList: function (CommonService) {
                    return CommonService.getRequest('api/barrios');
                },
                planes: function (CommonService) {
                    return CommonService.getRequest('api/userPlans');
                },
                userData: function (CommonService) {
                    return CommonService.getRequest('api/getCurrentUser');
                }
            }
        });

        $routeProvider.when('/ver-usuario', {
            templateUrl: 'resources/tpl/verUsuario.html',
            controller: 'VerUserController',
            resolve: {
                departamentosList: function (CommonService) {
                    return CommonService.getRequest('api/departamentos');
                },
                categoriasList: function (CommonService) {
                    return CommonService.getRequest('api/categorias');
                },
                barriosList: function (CommonService) {
                    return CommonService.getRequest('api/barrios');
                },
                planes: function (CommonService) {
                    return CommonService.getRequest('api/userPlans');
                },
                userData: function (CommonService) {
                    return CommonService.getRequest('api/getCurrentUser');
                }
            }
        });

        $routeProvider.when('/contacto', {
            templateUrl: 'resources/tpl/contacto.html',
            controller: 'ContactoController'
        });
        
        $routeProvider.when('/resetPassword/:token', {
            templateUrl: 'resources/tpl/resetPassword.html',
            controller: 'ResetPasswordController'
        });
        
        $routeProvider.when('/restaurar-password', {
            templateUrl: 'resources/tpl/restaurarContrasena.html',
            controller: 'SendResetPasswordController'
        });

        $routeProvider.when('/quienessomos', {
            templateUrl: 'resources/tpl/quienessomos.html'
        });

        $routeProvider.when('/administrar-users', {
            templateUrl: 'resources/tpl/users.html',
            controller: 'UsersController'
        });

        $routeProvider.otherwise({
            templateUrl: 'resources/tpl/busquedaProfesionales.html',
            controller: 'ProfessionalsSearchController',
            resolve: {
                departamentosList: function (CommonService) {
                    return CommonService.getRequest('api/departamentos');
                },
                categoriasList: function (CommonService) {
                    return CommonService.getRequest('api/categorias');
                },
                barriosList: function (CommonService) {
                    return CommonService.getRequest('api/barrios');
                },
                premiumUsers: function (CommonService) {
                    return CommonService.getRequest('api/getPremiumUsers');
                }
            }
        });
       /* $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });*/
    }]);

Professionals.factory('imageUrl', function () {

    var url = '';

    return {
        set: function (newUrl) {
            url = newUrl;
        },
        get: function () {
            return url;
        }
    };
});

Professionals.run(['$rootScope','$location','Helper',
    function ($rootScope,$location,Helper) {
        $('.alertsTop').removeClass('hideAll');
        Helper.getUser();
        $rootScope.$on('$routeChangeSuccess', function(){
            ga('send', 'pageview', $location.path());
        });
    }]);

function goToTop() {
    $('html,body').scrollTop(0);
}

