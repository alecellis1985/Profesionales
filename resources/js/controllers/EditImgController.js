'use strict';

Professionals.controller('EditImgController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', '$modalInstance', 'CommonService','imageUrl',
    function EditImgController($scope, $routeParams, $http, $rootScope, $location, $modalInstance, CommonService, imageUrl) {
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('files', function () {
            //perform img validation 
            $scope.validateImg($scope.files);
        });

        $scope.validateImg = function (files) {
            if (files && files.length) {
                var file = files[0];
                var error;
                if (file.type.indexOf('image') === -1) {
                    error = 'Image extension not allowed, please choose a JPEG or PNG file.';
                }

                if (file.size > 2097152) {
                    error = 'File size cannot exceed 2 MB';
                }

                if (error !== undefined)
                {
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: error});
                }

                return error === undefined;
            }
        };

        $scope.userLogin = {};

        $scope.editarImg = function (e)
        {
            e.preventDefault();

            if ($scope.validateImg($scope.files)) {

                var imgFile = null;
                if (!(typeof $scope.files === 'undefined') && !($scope.files === null))
                    imgFile = $scope.files[0];

                var data = {};

                CommonService.postRequestWithFile('api/editar_img', data, imgFile).then(function (result) {
                    if (result.data.success) {
                        $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Imagen actualizada!'});
                        $modalInstance.close(result.data.data.newImgUrl);
                    }
                    else
                        $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.data.msg});
                });
            }
        };

    }]);