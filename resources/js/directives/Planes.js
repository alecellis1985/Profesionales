Professionals.directive('planesDetails', function(){
    return {
        restrict: 'E',
        templateUrl: 'resources/tpl/planes.html',
        scope: {
            selectedPlan: '=',
            elemColapsed:'=',
            selectedPlanFn:'&',
            availablePlans:'='
        },
        replace: true,
        link:function($scope,element,attr){
            $scope.clearSelectedPlan = function(){
                $scope.elemColapsed = true;
                $scope.selectedPlan = {};
            }
        }
    };
});

/*
 * <mark>Save {{parseInt(availablePlans[selectedPlan.tipo].Basico.Mensual*3/availablePlans[selectedPlan.tipo].Basico.Semestral*100)}}</mark>
 */
Professionals.directive('discountDirective', function(){
    return {
        restrict: 'E',
        templateUrl: 'resources/tpl/discountDirective.html',
        scope: {
            dividendo :'=',
            divisor:'=',
            meses:'='
        },
        link:function($scope,element,attr){
            $scope.cociente = 0;
            $scope.$watch('divisor',function(newVal){
                if(newVal !== undefined){
                    $scope.cociente = parseInt(100-($scope.divisor*100)/($scope.dividendo*$scope.meses));
                }
            });
        }
    };
});