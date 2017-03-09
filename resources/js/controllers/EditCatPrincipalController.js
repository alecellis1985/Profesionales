'use strict';

Professionals.controller('EditCatPrincipalController', ['$scope', '$rootScope', '$modalInstance', 'CommonService','categorias','currentCategoria',
    function EditImgController($scope, $rootScope, $modalInstance, CommonService, categorias,currentCategoria) {
        $scope.categorias = categorias;
        $scope.selectedCategoria = categorias.filter(function(element){
            return element.categoriaId === currentCategoria; 
        })[0];
        
        $scope.editarCat = function () {
            $modalInstance.close($scope.selectedCategoria);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.selectCategoria = function (e, categoria)
        {
            e.preventDefault();
            $scope.selectedCategoria = categoria;
        };
        
    }]);