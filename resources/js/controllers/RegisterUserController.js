'use strict';

Professionals.controller('RegisterUserController', ['$scope', '$rootScope', '$location',
    'CommonService', 'departamentosList', 'categoriasList', 'barriosList', 'planes', '$timeout',
    function ($scope, $rootScope, $location, CommonService, departamentosList, categoriasList,
            barriosList, planes,$timeout) {
        
        $scope.isCollapsed = true;
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
                    Trimestral: 450,
                    Semestral: 720,
                    Anual: 1080
                },
                Premium: {
                    Mensual: 890,
                    Trimestral: 600,
                    Semestral: 960,
                    Anual: 1440
                }
            },
            1: {//Empresarial
                Basico: {
                    Mensual: 490,
                    Trimestral: 450,
                    Semestral: 720,
                    Anual: 1080
                },
                Premium: {
                    Mensual: 890,
                    Trimestral: 600,
                    Semestral: 960,
                    Anual: 1440
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

        $scope.showPlan = function (plan)
        {
            if ($scope.selectedPlan.tipo === plan)
            {
                $scope.isCollapsed = true;
                $scope.selectedPlan = {};
            }
            else
            {
                $scope.selectedPlan.tipo = plan;
                $scope.selectedPlan.nombre = plan === 0 ? 'Planes Profesionales' : 'Planes Empresariales'
                $scope.isCollapsed = false;
            }
        };



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
            mostrarRegistro: false,
            empresa: false
        };

        $scope.goBackRegistration = function (e) {
            e.preventDefault();
            $scope.registro.mostrarRegistro = false;
            $scope.registro.empresa = false;
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
        
        $scope.init = function(){
            $scope.markers = [];
            //Add first input
            $scope.addDireccion();
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
            if($scope.user.cardcolor === undefined && ((typeof $scope.files === 'undefined') || ($scope.files === null))){
                $rootScope.$broadcast('alert-event', {type: 'danger', msg: "Debe subir un icono personal o seleccionar un color personalizado para la tarjeta!"});
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
            
            var listaTelefonosEmp = $scope.telefonosEmp.slice(0);
            listaTelefonosEmp.unshift(new TelefonoEmp());
            listaTelefonosEmp[0].val = $scope.user.telefonoEmp;
            
            var data = {
                'nombre': $scope.user.nombre,
                'apellido': $scope.user.apellido,
                'username': $scope.user.username,
                'password': $scope.user.password,
                'email': $scope.user.email,
                'telefono': $scope.user.telefono,
                'celular': $scope.user.celular,
                'direccion': $scope.direcciones.length>0?JSON.stringify($scope.direcciones):null,
                'telefonoEmp': JSON.stringify(listaTelefonosEmp),
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

            CommonService.postRequestWithFile('api/agregar_usuario', data, imgFile).then(function (result) {
                if (result.data.success) {
                    $scope.premiumPlans = [2,5,6,8,11,12,14,15];
                    if($scope.premiumPlans.indexOf(parseInt($scope.IdPlan))!== -1){
                        $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Felicitaciones, ya sos parte de profesionales.uy, en breve nos pondremos en contacto contigo para darte el alta!'});
                    }
                    else{
                        $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Felicitaciones, ya sos parte de profesionales.uy'});
                    }
                    $location.path('/index.html');
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