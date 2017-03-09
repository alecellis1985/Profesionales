Professionals.factory('Helper', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
        var helper = {};
        //Regular expresions used in validations along the app
        helper.onlyNumbersRegex = /^[0-9]{1,10}$/;
        helper.alphaNumericalRegex = /^[a-zA-Z0-9]+$/;
        helper.alphaNumericalSpaceAndDashRegex = /^[a-zA-Z0-9_-\s\.]+$/;
        helper.alphaNumericalDotSpaceAndDashRegex = /^[a-zA-Z0-9_-\s\.]+$/;
        helper.emptyOralphaNumericalDotSpaceAndDashRegex = /^$|[a-zA-Z0-9_-\s\.]+$/;

        //Store the current date and current year for featur useage
        helper.actualDate = new Date();
        helper.actualY = helper.actualDate.getFullYear();

        /*
         * Retrieves all information about a user
         * If a request is in progres, returns the same request
         */
        helper.getUserRequestFlag = false;
        helper.getUserPromises = [];

        //Retrieves the username
        helper.getUser = function (forceRequest) {
            var currentPromise = $q.defer();
            /*If we don't want the cached user, then force the request*/
            if (!$rootScope.user || forceRequest === true) {
                /*Add a new promise to the promises array, to be resolved once the current request is finished*/
                helper.pushUserPromise(currentPromise);
                /*If there isn't a request in progress*/
                if (helper.getUserRequestFlag === false) {
                    helper.getUserRequestFlag = true;
                    $http.get('api/users/loggedUser').success(function (user) {
                        /*Once the request is finished, turns the flag to false again*/
                        helper.getUserRequestFlag = false;
                        /*When user is in admin mode, we send an aditional parameter in the header*/
                        /*Once the request is finished, resolves the general promise.*/
                        if (user.success)
                        {
                            $rootScope.user = user;
                        }
                        else
                        {
                            delete $rootScope.user;
                        }
                        helper.resolveUserPromises(user);
                    });
                }
            }
            else {
                /*If we want the user info which is in cache*/
                currentPromise.resolve($rootScope.user);
            }
            return currentPromise.promise;
        };

        helper.pushUserPromise = function (userPromise) {
            helper.getUserPromises.push(userPromise);
        }

        /*Resolves all promises that waits for a request to finish*/
        helper.resolveUserPromises = function (userInfo) {
            var q = $q.defer();

            while (helper.getUserPromises.length) {
                var lastPromise = helper.getUserPromises.pop();
                lastPromise.resolve(userInfo);
                if (!helper.getUserPromises.length) {
                    q.resolve();
                }
            }

            return q.promise;
        };

        helper.setItem = function (configName, value, isUserConfig) {
            isUserConfig = isUserConfig || true;
            if (isUserConfig) {
                helper.getUser(false).then(function () {
                    configName += $rootScope.user.UserId;
                    localStorage.setItem(configName, value);
                });
            }
            else {
                localStorage.setItem(configName, value);
            }
            ;
        };

        helper.getItem = function (configName, isUserConfig) {
            var deferred = $q.defer();
            isUserConfig = isUserConfig || true;
            if (isUserConfig) {
                helper.getUser(false).then(function () {
                    configName += $rootScope.user.UserId;
                    deferred.resolve(localStorage.getItem(configName));
                });
            }
            else {
                deferred.resolve(localStorage.getItem(configName));
            }
            
            return deferred.promise;
        };

        helper.removeItem = function (configName, isUserConfig) {
            isUserConfig = isUserConfig || true;
            configName += (isUserConfig) ? $rootScope.user.UserId : '';
            localStorage.removeItem(configName);
        }

        helper.clearArray = function (arr) {
            while (arr.length > 0) {
                arr.pop();
            };
        };

        helper.isUndefinedOrNull = function (obj) {
            return obj === null || obj === undefined;
        }

        helper.Message = function (level, msg) {
            $rootScope.$broadcast('event:alertMessage', {'level': level, 'message': msg});
        }

        helper.randomString = function (letters)
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

            for (var i = 0; i < letters; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };

        helper.stringTime = function (dateTime) {
            var hours = dateTime.getHours();
            var minutes = dateTime.getMinutes();
            var seconds = 0;//dateTime.getSeconds();
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return hours + ":" + minutes + ":" + seconds;
        };


        helper.timeFromString = function (stringTime) {
            var pieces = stringTime.split(':')
            var hour, minute;

            if (pieces.length === 3) {
                hour = parseInt(pieces[0], 10);
                minute = parseInt(pieces[1], 10);
            }

            var initHour = new Date();
            initHour.setHours(hour);
            initHour.setMinutes(minute);

            return initHour;
        };

        helper.getHorarioAtencionText = function (comienzo, fin) {
            var horaInicio = comienzo.substring(0, comienzo.length - 3);
            var horaFin = fin.substring(0, fin.length - 3);
            var textResult = "";
            textResult = "De " + horaInicio + " hs a " + horaFin + " hs";
            return textResult;

        };

        helper.getDiasAtencionText = function (diasAtencion) {
            var textResult = "";
            if (diasAtencion.lunes)
                textResult = "Lunes";
            if (diasAtencion.martes) {
                textResult += (textResult === "" ? "Martes" : ", Martes");
            }
            if (diasAtencion.miercoles) {
                textResult += (textResult === "" ? "Miercoles" : ", Miercoles");
            }
            if (diasAtencion.jueves) {
                textResult += (textResult === "" ? "Jueves" : ", Jueves");
            }
            if (diasAtencion.viernes) {
                textResult += (textResult === "" ? "Viernes" : ", Viernes");
            }

            if (diasAtencion.sabado) {
                textResult += (textResult === "" ? "Sabado" : ", Sabado");
            }

            if (diasAtencion.domingo) {
                textResult += (textResult === "" ? "Domingo" : ", Domingo");
            }

            return textResult;
        }

        helper.getFormasDePagoText = function (formasDePago) {
            var textResult = "";
            if (formasDePago.contado)
                textResult = "Contado";
            if (formasDePago.debito) {
                textResult += (textResult === "" ? "Debito" : ", Debito");
            }
            if (formasDePago.credito) {
                textResult += (textResult === "" ? "Credito" : ", Credito");
            }
            if (formasDePago.otras !== "") {
                textResult += (textResult === "" ? formasDePago.otras : ", " + formasDePago.otras);
            }

            return textResult;
        };

        return helper;
    }]);
