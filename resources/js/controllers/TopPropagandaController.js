'use strict';

Professionals.controller('TopPropagandaController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', function ($scope, $routeParams, $http, $rootScope, $location) {
        $scope.template = {
            "topPropaganda": "resources/tpl/topPropaganda.html"
                    //        "about": "aboutus.html",
                    //        "contact": "contactus.html"
        };
        $scope.myInterval = 3000;
        var slides = $scope.slides = [];
        $scope.addSlide = function (url) {
            slides.push({
                image: url,
                text: ['More', 'Extra', 'Lots of'][slides.length % 3] + ' ' +
                        ['Cats', 'Kittys', 'Felines'][slides.length % 3]
            });
        };
//        for (var i = 0; i < 4; i++) {
            $scope.addSlide('./resources/img/dentista.jpg');
            $scope.addSlide('./resources/img/profesionales.jpg');
            $scope.addSlide('./resources/img/contador.jpg');
//        }
    }]);

