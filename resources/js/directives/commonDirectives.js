Professionals.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
});

Professionals.directive('stopAllEvents', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        }
    };
});


Professionals.directive('scrollOnClick', function () {
    var directive = {
        restrict: 'A',
        scope: {
            container: '@',
            reverse:'='
        },
        link: function (scope, element, attrs) {
            element.on('click', function () {
                $(scope.container).animate({ scrollTop: scope.reverse ? 0 : element.offset().top }, "slow");
            });
        }
    };
    return directive;
});

Professionals.directive('disableBtn', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if (attr.disableBtn === 'true')
            {
                element.addClass('notAvailable');
                element.attr('title', 'No Disponible');
                element.bind('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
        }
    };
});

Professionals.directive('profACustom', function () {
    return {
        restrict: 'E',
        scope:
                {
                    hrefLink: '=',
                    icon: '@',
                    iconTitle: '@'
                },
        template: '<a href="{{hrefLink}}" target="_blank" title="{{profATitle}}" stop-Event><i class="{{icon}}"></i></a>',
        link: function ($scope, element, attr) {
            $scope.profATitle = 'No Disponible';
            $scope.checkHref = function (element, val)
            {
                if (!val || val === '')
                {
                    element.addClass('notAvailable');
                    $scope.profATitle = 'No Disponible';
                    element.bind('click', function (e) {
                        e.preventDefault();
                    });
                }
                else
                {
                    element.off('click');
                    $scope.profATitle = $scope.iconTitle;
                    element.removeClass('notAvailable');
                    element.attr('title', 'No Disponible');
                }
            };

            $scope.checkHref(element.find('a'), $scope.hrefLink);
            $scope.$watch('hrefLink', function (newValue, oldValue) {
                $scope.checkHref(element.find('a'), newValue);
            }, true);
        }
    };
});



Professionals.directive('scrollToTop',['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            elm.css('display', 'none');
            elm.bind("click", function () {
                //TODO FIX IN IE AND FF
                function scrollToTop(element, to, duration) {
                    if (duration < 0)
                        return;
                    var difference = to - element.scrollTop;
                    var perTick = difference / duration * 10;

                    setTimeout(function () {
                        element.scrollTop = element.scrollTop + perTick;
                        scrollToTop(element, to, duration - 10);
                    }, 10);
                }

                // then just add dependency and call it
                scrollToTop($document[0].body, 0, 400);
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() < 200)
                {
//                        if(!elm.hasClass('ng-hide'))
//                        elm.addClass('ng-hide');
                    elm.fadeOut('slow');
                }
                else
                {
                    elm.fadeIn('slow');
                    //elm.removeClass('ng-hide');
                }
            });
        }
    };
}]);

Professionals.directive('dropdownFilter', function () {
    return {
        restrict: 'E',
        templateUrl: 'resources/tpl/dropdownDirective.html',
        scope: {
            selectedElem: '=',
            placeholderFilter: '@',
            nameProp: '@',
            idProp: '@',
            elementsArr: '=',
            selectedElementFn: '='
        },
        replace: true,
        link: function ($scope, elem, attr) {
            $scope.clearModel = function (evt)
            {
                $scope.dropdownFilter = '';
                evt.preventDefault();
                evt.stopPropagation();
            };

            $scope.selectedElement = $scope.selectedElementFn || function (e, elem)
            {
                e.preventDefault();
                $scope.selectedElem = elem;
            };

            function removeAccents(value) {
                return value
                        .replace(/á/g, 'a')
                        .replace(/é/g, 'e')
                        .replace(/í/g, 'i')
                        .replace(/ó/g, 'o')
                        .replace(/ú/g, 'u');
            }

            $scope.ignoreAccents = function (item) {
                if (!$scope.dropdownFilter)
                    return true;
                var text = removeAccents(item[$scope.nameProp].toLowerCase());
                var search = removeAccents($scope.dropdownFilter.toLowerCase());
                return text.indexOf(search) > -1;
            };
        }
    };
});

Professionals.directive('dropdownWValidation',['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'resources/tpl/dropdownWValidation.html',
        scope: {
            selectedElem: '=',
            placeholderFilter: '@',
            nameProp: '@',
            elementsArr: '=',
            selectedElementFn: '=',
            checkFn: '&',
            errorMsg: '@',
            postSelectionFn: '&'
        },
        replace: true,
        link: function ($scope, elem, attr) {
            $scope.dropdownError = false;
            $scope.clearModel = function (evt)
            {
                $scope.dropdownFilter = '';
                evt.preventDefault();
                evt.stopPropagation();
            };

            $scope.selectedElement = $scope.selectedElementFn || function (e, elem)
            {
                e.preventDefault();
                $scope.selectedElem = elem;
                $scope.dropdownError = $scope.checkFn({elem: $scope.selectedElem});
                $timeout(function () {
                    $scope.postSelectionFn();
                }, 100);
            };

            function removeAccents(value) {
                return value
                        .replace(/á/g, 'a')
                        .replace(/é/g, 'e')
                        .replace(/í/g, 'i')
                        .replace(/ó/g, 'o')
                        .replace(/ú/g, 'u');
            }

            $scope.ignoreAccents = function (item) {
                if (!$scope.dropdownFilter)
                    return true;
                var text = removeAccents(item[$scope.nameProp].toLowerCase());
                var search = removeAccents($scope.dropdownFilter.toLowerCase());
                return text.indexOf(search) > -1;
            };
        }
    };
}]);

Professionals.directive('resize', ['$window',function ($window) {
    return function (scope, element, attrs) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {'h': w.height(), 'w': w.width()};
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            scope.style = function () {
                //Added but this should't be inside directive
                var footerHeight = $('.footer').height();
                //
                return {
                    'min-height': (newValue.h - attrs.resizeHeight - footerHeight) + 'px'
                    //'width': (newValue.w - 100) + 'px'
                    //width could work if you ant responsive width
                };
            };
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}]);

Professionals.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

Professionals.directive('triggerClick', ['$timeout',function ($timeout) {
    return {
        restrict: 'E',
        template: '<span ng-click="clickAction()">{{text}}</span>',
        scope: {
            selector:'@',
            text:'@'
        },
        replace:true,
        link: function ($scope, elem, attr) {
            $scope.clickAction = function(){
                $timeout(function() {
                    angular.element($scope.selector).trigger('click');
                 }, 100);
            }
        }
    };
}]);

Professionals.directive('fancyImg', ['$timeout',function ($timeout) {
    return {
        restrict: 'E',
        template: '<div class="backgroundImg"></div>',
        scope: {
            backgroundUrl:'@'
        },
        replace:true,
        link: function ($scope, elem, attr) {
            $scope.Url = 'url(\'uploaded/'+  $scope.backgroundUrl+'\')';
            elem.css('background-image',$scope.Url);
            $scope.$watch('backgroundUrl',function(newval,oldval){
                if(newval !== oldval){
                    $scope.Url = 'url(\'uploaded/'+  $scope.backgroundUrl+'\')';
                    elem.css('background-image',$scope.Url);
                }
            });
        }
    };
}]);

Professionals.directive('scrollToElemOnClick', ['$timeout',function($timeout) {
  return {
    restrict: 'A',
    scope:{
        isDivCollapsed:'='
    },
    link: function(scope, $elm,attrs) {
      $elm.on('click', function() {
          $timeout(function(){
            if(!scope.isDivCollapsed){
                var topPos = $(attrs.scrollToElemOnClick).offset().top - 45;
                $("body").animate({scrollTop: topPos}, "slow");
            }
          },100);
      });
    }
  }
}]);