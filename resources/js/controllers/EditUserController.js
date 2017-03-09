'use strict';

Professionals.controller('EditUserController', ['$scope', '$rootScope', '$location','$timeout',
    'CommonService', 'departamentosList', 'categoriasList', 'barriosList', 'planes', 'userData',
    function ($scope, $rootScope, $location, $timeout, CommonService, departamentosList, categoriasList,
            barriosList, planes, userData) {
        
        //FOR UPLOAD FILE (IMG)
        $scope.$watch('files', function (newval,oldval) {
            //perform img validation 
            if(newval !== undefined && newval !== null && newval.length>0){
                $scope.validateImg($scope.files);
                $scope.user.cardcolor = undefined;
            }
        });
        
        $scope.$watch('user.cardcolor',function(newval){
            if(newval !== undefined && newval !== null){
                $scope.files = [];
            }
        });

        $scope.planes = planes;
        $scope.renderMap = false;
        $scope.direcciones = [];

        $scope.addDireccion = function () {
            $scope.direcciones.push(new Direccion());
        }
        
        $scope.removeDireccionesVacias = function(){
            var length = $scope.direcciones.length;
            while(length--){
                if($scope.direcciones[length].val == '')
                    $scope.direcciones.pop();
            }
        }
        
        function Direccion() {
            this.val = '';
        }

        $scope.removeDireccion = function (direccion) {
            var direccionesLength = $scope.direcciones.length;
            while (direccionesLength--) {
                if ($scope.direcciones[direccionesLength].$$hashKey === direccion.$$hashKey) {
                    $scope.direcciones.splice(direccionesLength, 1);
                    direccionesLength = 0;
                }
            }
        }
        
        $scope.telefonosEmp = [];

        $scope.addTelefonoEmp = function () {
            $scope.telefonosEmp.push(new TelefonoEmp());
        }
        
        $scope.removeTelefonoEmpVacias = function(){
            var length = $scope.telefonosEmp.length;
            while(length--){
                if($scope.telefonosEmp[length].val == '')
                    $scope.telefonosEmp.pop();
            }
        }
        
        function TelefonoEmp() {
            this.val = '';
        }

        $scope.removeTelefonoEmp = function (telefono) {
            var telefonosLength = $scope.telefonosEmp.length;
            while (telefonosLength--) {
                if ($scope.telefonosEmp[telefonosLength].$$hashKey === telefono.$$hashKey) {
                    $scope.telefonosEmp.splice(telefonosLength, 1);
                    telefonosLength = 0;
                }
            }
        }

        $scope.profesionalesAvailablePlans = {
            0: {//Profesional
                Basico: {
                    Mensual: 490,
                    Semestral: 2352,
                    Anual: 3528
                },
                Premium: {
                    Mensual: 890,
                    Semestral: 4272,
                    Anual: 6408
                }
            },
            1: {//Empresarial
                Basico: {
                    Mensual: 790,
                    Semestral: 3792,
                    Anual: 5688
                },
                Premium: {
                    Mensual: 1190,
                    Semestral: 5712,
                    Anual: 8568
                }
            }
        };
        $scope.convertIntToPlanType = function (num) {
            return num === 0 ? 'Profesional' : 'Empresarial';
        };

        $scope.getPlan = function (tipo, categoria, duracionPlan) {
            return $scope.planes.data.filter(function (elem) {
                return elem.Tipo === tipo && elem.Categoria === categoria && elem.DuracionPlan === duracionPlan;
            });
        };

        $scope.getPlanCash = function (tipo, categoria, duracionPlan) {
            var plan = $scope.getPlan(tipo, categoria, duracionPlan);
            return plan.length > 0 ? plan.Precio : 0;
        };

        $scope.selectedPlan = {};

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
            }
        };

        $scope.registro = {
            mostrarRegistro: true,
            empresa: userData.plan > 6
        };

        $scope.goBackRegistration = function (e) {
            e.preventDefault();
            $location.path('/ver-usuario');
        };

        /**************** PARA EL REGISTRO MIRAR ESTO **********************************/
        //Con $scope.selectedPlan.categoria tengo que valor de plan eligio
        //Con $scope.selectedPlan.tipo se si es 0 o 1 o sea profesional o empresa
        $scope.showRegistration = function (e, tipo, duracion, categoria) {
            goToTop();
            e.preventDefault();
            $scope.userPlan = $scope.getPlan($scope.convertIntToPlanType(tipo), categoria, duracion);
            if ($scope.userPlan.length > 0)
            {
                $scope.IdPlan = $scope.userPlan[0].IdPlan;
            }
            $scope.registro.mostrarRegistro = true;
            $scope.registro.empresa = $scope.selectedPlan.tipo === 1;
        };

        $scope.$watch('registro.mostrarRegistro', function (newVal) {
            if (newVal !== null && newVal !== undefined && newVal) {
                $timeout(function () {                    
                    $scope.renderMap = true;
                }, 1000);
            }
            else {
                $scope.renderMap = false;
            }
        });

        $scope.defaultDropdownTexts = {
            checkAll: 'Seleccionar Todos',
            uncheckAll: 'Remover Todos',
            dynamicButtonTextSuffix: 'Seleccionados'
        }

        $scope.showBarrios = false;
        $scope.montevideoSelected = function (elem) {
            if (elem.id === 1) {
                $scope.showBarrios = true;
            }
            $scope.dropdownsValid = $scope.dropDownCheck();
        }
        $scope.montevideoDeSelected = function (elem) {
            if (elem.id === 1) {
                $scope.showBarrios = false;
                $scope.selectedBarrios = [];
            }
            $scope.dropdownsValid = $scope.dropDownCheck();
        }

        $scope.selectAllDeps = function () {
            $scope.showBarrios = true;
            $scope.dropdownsValid = $scope.dropDownCheck();
        }

        $scope.removeAllDeps = function () {
            $scope.showBarrios = false;
            $scope.dropdownsValid = $scope.dropDownCheck();
        }

        $scope.DepartamentosEvents = {
            onItemSelect: $scope.montevideoSelected,
            onItemDeselect: $scope.montevideoDeSelected,
            onSelectAll: $scope.selectAllDeps
        }

        //Hack to remove barrios dropdown because 'onDeselectAll  event is not working
        $scope.$watch('selectedDepartamentos.length', function (newVal) {
            if (newVal === 0) {
                $scope.showBarrios = false;
            }
            $scope.dropdownsValid = $scope.dropDownCheck();
        });

        $scope.categoriasTexts = $.extend({}, $scope.defaultDropdownTexts, {buttonDefaultText: 'Seleccione Categorias'});
        $scope.categoriaSettings = {displayProp: 'categoriaNombre', idProp: 'categoriaId'};
        $scope.categorias = categoriasList.data;
        $scope.selectedCategorias = [];
        //$scope.selectedCategoria = $scope.categorias[0];

        $scope.barriosTexts = $.extend({}, $scope.defaultDropdownTexts, {buttonDefaultText: 'Seleccione Barrios'});
        $scope.barriosSettings = {displayProp: 'barrioNombre', idProp: 'barrioId'};
        $scope.barrios = $.grep(barriosList.data,function(elem){return elem.barrioId < 82;});;
        $scope.selectedBarrios = [];
        //$scope.selectedBarrio = $scope.barrios[0];

        $scope.departamentosTexts = $.extend({}, $scope.defaultDropdownTexts, {buttonDefaultText: 'Seleccione Departamentos'});
        $scope.departamentosSettings = {displayProp: 'nombreDepartamento', idProp: 'idDepartamento'};
        $scope.departamentosList = departamentosList.data;
        $scope.selectedDepartamentos = [];
        //$scope.depSelected = $scope.departamentosList[0];

        $scope.user = {
            cardcolor:undefined,
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


        //TODO NEED THIS VALIDATION, PUT DROPDWON VALID IN FALSE AND VALIDATE
        $scope.dropdownsValid = false;
        $scope.dropDownCheck = function () {
            return ($scope.selectedDepartamentos.length > 0 && $scope.selectedCategorias.length > 0);
        };

        $scope.fillEditUserCamps = function () {
            var telsEmp = $.parseJSON(userData.data.user.telefonoEmp);
            var firstTel = telsEmp.shift();
            userData.data.user.telefonoEmp = firstTel.val;
            $scope.telefonosEmp = telsEmp;
            $scope.user = userData.data.user;
            if(userData.data.direcciones === null){
                $scope.addDireccion();
            }
            else{
                $scope.direcciones = userData.data.direcciones;
            }
            $.each(userData.data.categorias, function (index, element) {
                $scope.selectedCategorias.push({id: element.categoriaId});
            });

            var mvdeoSelected = false;
            $.each(userData.data.departamentos, function (index, element) {
                if ($.inArray({id: element.idDepartamento}, $scope.depSelected) === -1){
                    if(element.idDepartamento === 1){
                        var mdeoItems = $scope.selectedDepartamentos.filter(function(e){return e.id === 1;});
                        if(mdeoItems.length<1){
                            $scope.selectedDepartamentos.push({id: element.idDepartamento});
                        }
                    }
                    else{
                        $scope.selectedDepartamentos.push({id: element.idDepartamento});
                    }
                }
                    

                if (element.nombreDepartamento.toLowerCase() === "montevideo")
                    mvdeoSelected = true;
            });

            if (mvdeoSelected) {
                $scope.showBarrios = true;
                $.each(userData.data.departamentos, function (index, element) {
                    if (element.barrioNombre.toLowerCase() !== "default"){
                        if(element.barrioId === -1){
                            delete element.barrioId;
                            delete element.barrioNombre;
                        }
                        else{
                            $scope.selectedBarrios.push({id: element.barrioId});
                        }                        
                    }
                        
                });

            }
            if($scope.user.cardcolor !== undefined && $scope.user.cardcolor !== null && $scope.user.cardcolor !== ''){
                $scope.myStyle={'background-color':$scope.user.cardcolor};
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

            $scope.user.horario = userData.data.diasAtencion.horario;
            $scope.IdPlan = $scope.user.plan;

            $scope.markers = $.parseJSON(userData.data.user.markers);
            $scope.dropdownsValid = true;
            $scope.registro.empresa = userData.data.user.plan> 6;
            
            $timeout(function () {                    
                    $scope.renderMap = true;
            }, 1000);
        };
        
        $scope.init = function(){
            $scope.fillEditUserCamps();
            goToTop();
        }
        
        

        $scope.checkCategoria = function (elem) {
            return parseInt(elem.categoriaId) < 0;
        };

        $scope.checkDepto = function (elem) {
            return parseInt(elem.idDepartamento) < 0;
        };

        $scope.checkBarrio = function (elem) {
            return $scope.depSelected.nombreDepartamento === 'Montevideo' && parseInt(elem.barrioId) < 0;
        };

        $scope.registrarUsuario = function ()
        {
            $scope.dropdownsValid = $scope.dropDownCheck();
            if (!$scope.registerUser.$valid || !$scope.dropdownsValid) {
                $rootScope.$broadcast('alert-event', {type: 'danger', msg: "Verifique que todos los campos esten correctamente completados!"});
                return;
            }
            //Need to map the marker position to latitude longitude to save in the db
            var markersArr = $scope.markers.map(function (obj) {
                return {
                    'latitude': obj.getPosition().lat().toString(),
                    'longitude': obj.getPosition().lng().toString()
                };
            });
            var markers = JSON.stringify(markersArr);
            
            var categorias = {};
            var i;
            for (i = 0; i < $scope.selectedCategorias.length; i++) {
                $.extend(categorias, {id: $scope.selectedCategorias[i]});
            }

            $scope.removeDireccionesVacias();
            $scope.removeTelefonoEmpVacias();
            
            
            
            $scope.telefonosEmp.unshift(new TelefonoEmp());
            $scope.telefonosEmp[0].val = $scope.user.telefonoEmp;
            var data = {
                'nombre': $scope.user.nombre,
                'apellido': $scope.user.apellido,
                'username': $scope.user.username,
                'password': $scope.user.password,
                'email': $scope.user.email,
                'telefono': $scope.user.telefono,
                'celular': $scope.user.celular,
                'direccion': $scope.direcciones.length>0?JSON.stringify($scope.direcciones):null,
                'telefonoEmp': JSON.stringify($scope.telefonosEmp),
                'departamento': $scope.selectedDepartamentos,
                'categoria': $scope.selectedCategorias,
                'barrio': $scope.selectedBarrios,
                'sitioWeb': $scope.user.sitioWeb,
                'plan': parseInt($scope.IdPlan),
                'facebookUrl': $scope.user.facebookUrl,
                'twitterUrl': $scope.user.twitterUrl,
                'linkedinUrl': $scope.user.linkedinUrl,
                'descService': $scope.user.descService,
                'cardcolor':$scope.user.cardcolor,
                'servicioOfrecido1': $scope.user.servicioOfrecido1,
                'servicioOfrecido2': $scope.user.servicioOfrecido2,
                'servicioOfrecido3': $scope.user.servicioOfrecido3,
                'servicioOfrecido4': $scope.user.servicioOfrecido4,
                'servicioOfrecido5': $scope.user.servicioOfrecido5,
                'servicioOfrecido6': $scope.user.servicioOfrecido6,
                'descServiceLong': $scope.user.descServiceLong,
                'formaDePago': $scope.user.formaDePago,
                'diasAtencion': $scope.user.diasAtencion,
                'horario': $scope.user.horario,
                'markers': markers
            };

            var imgFile = null;
            if (!(typeof $scope.files === 'undefined') && !($scope.files === null))
                imgFile = $scope.files[0];

            CommonService.postRequestWithFile('api/editar_usuario', data, imgFile).then(function (result) {
                if (result.data.success) {
                    $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Datos actualizados!'});
                    $location.path('/ver-usuario');
                }
                else
                    $rootScope.$broadcast('alert-event', {type: 'danger', msg: result.data.msg});
            });
        };
        
        $scope.init();
        
        $scope.$on("$destroy", function () {
            $scope.renderMap = false;
        });
}]);