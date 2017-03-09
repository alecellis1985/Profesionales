Professionals.directive('userDetails', ['$timeout','Helper','$modal',function($timeout,Helper,$modal){
    return {
        restrict: 'E',
        templateUrl: 'resources/tpl/userDetails.html',
        scope: {
            selectedUser: '=',
            elemColapsed:'='
        },
        replace: true,
        link:function($scope,element,attr){
            $scope.userMarkers = [];
            $scope.renderMap = false;
            
            $scope.tabs = [
                { title:'Servicios', content:'resources/tpl/tabServicios.html',active:true },
                { title:'Información', content:'resources/tpl/tabInformacion.html',active:false},
                { title:'Formas de pago', content:'resources/tpl/tabFormadePago.html',active:false},
                { title:'Mapa', content:'resources/tpl/tabMap.html',active:false}
              ];
              
            $scope.enviarMail = function (evt, userEmail) {
                evt.preventDefault();
                evt.stopPropagation();
                $modal.open({
                    templateUrl: 'resources/tpl/email.html',
                    controller: 'EmailController',
                    size: 'lg',
                    resolve: {
                        email: function () {
                         return userEmail;
                       }
                    }
                });
            };
            
            $scope.tabSelected = function(tab){
                if($scope.selectedUser.markers.length < 1)
                    return;
                
                if(tab.title === 'Mapa'){
                    //Helper.clearArray($scope.userMarkers);
                    $scope.userMarkers = $scope.selectedUser.markers;
                    $timeout(function(){
                        $scope.renderMap = true;
                    },100);
                }
            }
            
            $scope.$watch('elemColapsed',function(newval){
                if(newval === false){
                    $scope.tabs.map(function(elem){elem.active = false;});
                    $scope.tabs[0].active = true;
                    $scope.renderMap = false;
                }
            });
            
             $scope.$watch('selectedUser',function(newVal,oldVal){
                 if(newVal !== oldVal && newVal !== null &&  newVal !== undefined && $scope.elemColapsed === false){
                    $scope.tabs.map(function(elem){elem.active = false;});
                    $scope.tabs[0].active = true;
                    $scope.renderMap = false;
                }
             });
             $scope.$on("$destroy", function () {
                $scope.renderMap = false;
            });
        }
    };
}]);

