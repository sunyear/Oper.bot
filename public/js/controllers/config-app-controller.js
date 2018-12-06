(function() {
  'use strict';

  class ConfigAppController {

    constructor(ParamsConfigService, params_data) {
        
        this._paramsConfigService = ParamsConfigService;
        this.params_data = params_data.params;
                        
    }
    
  }

  ConfigAppController.$inject = ['ParamsConfigService', 'params_data'];
  angular
    .module('lotes.lote')
    .controller('ConfigAppController', ConfigAppController);
}());

/*
    _publicarParams( ){
        
        this._paramsConfigService.obtenerParams().then(
            (params_data) => angular.extend(this.config_params, params_data.params),//this.setViewModelData(val),//this.config_app_params.push(val),
            (err) => console.log(err)
        );

    }
    */
/*
(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('ConfigAppController', ConfigAppController);
        
        ConfigAppController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'remitosActasService', 'config_app_params'];
        function ConfigAppController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, remitosActasService, config_app_params) {
                
                console.log(config_app_params)

                

                var app_params = config_app_params;

                $scope.input_grp = {
                    "archivos_salidas": app_params.params.archivos_salida,
                    "archivos_rutas": {
                        "archivos_dir": app_params.params.archivos_dir,
                        "archivos_path": app_params.params.archivos_path,
                        "archivos_validar_automaticas": app_params.params.archivos_validar_automaticas
                    }
                }



                //---
                //API PUBLICA
                //---
                $scope.guardarCambios = guardarCambios;


                //---
                //METODOS PUBLICOS
                //---

                function guardarCambios(){
                    remitosActasService
                        .guardarParams(  )
                        .then (
                            function proceso( datos ){
                                console.log(datos)
                            },
                            null,
                            function notificar( msg ){
                                console.log('asd')
                            }
                        );    
                }                

        };
        //FIN CONTROLLER

})();
*/