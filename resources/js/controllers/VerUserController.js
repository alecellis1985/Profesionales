'use strict';

Professionals.controller('VerUserController', ['$scope', '$location','$timeout','$rootScope','CommonService', 'departamentosList', 'categoriasList', 'barriosList', '$modal',
    'planes', 'Helper', 'userData',
    function ($scope, $location,$timeout ,$rootScope,CommonService, departamentosList, categoriasList, barriosList, $modal, planes, Helper, userData) {
        $scope.showImg = true;
        $scope.planes = planes;
        $scope.newUser = false;
        $scope.isCollapsed = false;
        $scope.editMode = false;

        $scope.registro = {
            mostrarRegistro: !false,
            empresa: userData.data.user.plan > 6
        };

        $scope.barrios = barriosList.data;
        $scope.barrios.unshift({barrioNombre: "Seleccione Barrio", barrioId: -1});
        $scope.selectedBarrio = $scope.barrios[0];
        $scope.categorias = categoriasList.data;
        $scope.categorias.unshift({categoriaNombre: "Seleccione Categoria", categoriaId: -1});
        $scope.selectedCategoria = $scope.categorias[0];
        $scope.departamentosList = departamentosList.data;
        $scope.departamentosList.unshift({nombreDepartamento: "Seleccione Departamento", idDepartamento: -1});
        $scope.depSelected = $scope.departamentosList[0];

        var initHour = new Date();
        initHour.setHours(8);
        initHour.setMinutes(0);

        $scope.user = {
            horario: '',
            diasAtencion: {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            },
            formaDePago: {
                contado: false,
                debito: false,
                credito: false,
                otras: ''
            }
        };

        function selectedCategoriasText(selectedCategorias) {
            var resultText = "";
            $.each(selectedCategorias, function (index, element) {
                if (resultText !== "")
                    resultText += ", ";
                resultText += element.categoriaNombre + " ";
            });

            return resultText;
        }

        function selectedDeptosText(selectedDepartamentos) {
            var resultText = "";
            $.each(selectedDepartamentos, function (index, element) {
                if (resultText !== "")
                    resultText += ", ";
                if (parseInt(element.idDepartamento) === 1) {
                    resultText += element.barrioNombre + " (" + element.nombreDepartamento + ")";
                } else
                    resultText += element.nombreDepartamento + " ";
            });

            return resultText;
        }
        
        function printArrObjVal(obj){
            if(obj === null)
                return "";
            var resultText = "";
            $.each(obj, function (index, element) {
                if (resultText !== "")
                    resultText += ", ";
                resultText += element.val + " ";
            });
            return resultText;
        }

        $scope.fillEditUserCamps = function () {
            $scope.user = userData.data.user;
            $scope.user.direccion = printArrObjVal(userData.data.direcciones);
            $scope.user.telefonoEmp = printArrObjVal($.parseJSON(userData.data.user.telefonoEmp));
            $scope.user.passwordConfirm = userData.data.user.password;
            $scope.currentUsername = userData.data.user.username;
            $scope.user.selectedCategoriaText = selectedCategoriasText(userData.data.categorias);
            $scope.user.selectedDepartamentoText = selectedDeptosText(userData.data.departamentos);
            
            var categoria = $scope.categorias.filter(function(element){
                return element.categoriaId === $scope.user.catspecial; 
            });
            
            $scope.user.categoria = categoria.length>0?categoria[0].categoriaNombre:"";

            if ($scope.depSelected.nombreDepartamento.toLowerCase() === "montevideo") {
                var barrioId = userData.data.user.barrio;
                $scope.selectedBarrio = $scope.barrios.filter(function (elem) {
                    return elem.barrioId === barrioId;
                })[0];
                $scope.user.selectedBarrioText = $scope.selectedBarrio.barrioNombre;
            }

            var diasAtencion = {};
            diasAtencion.lunes = parseInt(userData.data.diasAtencion.lunes) === 1;
            diasAtencion.martes = parseInt(userData.data.diasAtencion.martes) === 1;
            diasAtencion.miercoles = parseInt(userData.data.diasAtencion.miercoles) === 1;
            diasAtencion.jueves = parseInt(userData.data.diasAtencion.jueves) === 1;
            diasAtencion.viernes = parseInt(userData.data.diasAtencion.viernes) === 1;
            diasAtencion.sabado = parseInt(userData.data.diasAtencion.sabado) === 1;
            diasAtencion.domingo = parseInt(userData.data.diasAtencion.domingo) === 1;

            var formasDePago = {};
            formasDePago.contado = parseInt(userData.data.formasDePago.contado) === 1;
            formasDePago.debito = parseInt(userData.data.formasDePago.debito) === 1;
            formasDePago.credito = parseInt(userData.data.formasDePago.credito) === 1;
            formasDePago.otras = userData.data.formasDePago.otras;

            $scope.user.diasAtencion = diasAtencion;
            $scope.user.formaDePago = formasDePago;

            $scope.user.formasDePagoText = Helper.getFormasDePagoText(formasDePago);
            $scope.user.diasAtencionText = Helper.getDiasAtencionText(diasAtencion);

            $scope.user.horario = userData.data.diasAtencion.horario;
            $scope.IdPlan = $scope.user.plan;
            $scope.imageUrl = '../uploaded/'+userData.data.user.imagenUrl;
            
            $scope.markers = $.parseJSON(userData.data.user.markers);
        };

        $scope.fillEditUserCamps();
        goToTop();

        $scope.editUserData = function (e) {
            e.preventDefault();
            $location.path('/editar-usuario');

        };

        $scope.editUserImg = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var modalInstance = $modal.open({
                templateUrl: 'resources/tpl/editImg.html',
                controller: 'EditImgController',
                size: 'lg'
            });
            modalInstance.result.then(function (imgUrl) {
                $scope.showImg = false;
                $timeout(function(){
                    $scope.showImg = true;
                    $scope.imageUrl = '../uploaded/'+imgUrl;    
                },100);
            }, function () {
                
            });
        };
        
        $scope.editCatPrincipal = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var modalInstance = $modal.open({
                templateUrl: 'resources/tpl/editCatPrincipalPopUp.html',
                controller: 'EditCatPrincipalController',
                size: 'md',
                resolve: {
                    categorias: function () {
                     return $scope.categorias;
                   },
                   currentCategoria:function(){
                       return $scope.user.catspecial;
                   }
                }
            });
            modalInstance.result.then(function (categoria) {
                var data = {
                    'catspecial': $scope.user.catspecial
                };
                CommonService.postJsonRequest('api/edit-user-categoria', data).then(function (result) {
                    $scope.user.catspecial = categoria.categoriaId;
                    $scope.user.categoria = categoria.categoriaNombre;
                    if (result.success) {
                        $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Categoría actualizada correctamente!'});
                    } else
                        $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.msg});
            });
                
            });
        };

        $scope.editUserPwd = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var modalInstance = $modal.open({
                templateUrl: 'resources/tpl/editPwd.html',
                controller: 'EditPwdController',
                size: 'lg'
            });
            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                //console.log('Modal dismissed at: ' + new Date());
            });
        };
    }]);