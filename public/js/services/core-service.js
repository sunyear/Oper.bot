(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .factory('coreService', coreService);

        coreService.$inject = ['$rootScope', '$timeout'];
        function coreService($rootScope, $timeout) {

                //var lotes = ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) || [] );

                var service = {
                    focus: focus
                };

                return ( service );



                //---
                //METODOS PUBLICOS
                //---

                function focus( elem_name ){
                    $timeout(function(){
                        $rootScope.$broadcast('focusOn', elem_name);
                        //console.log('asdasd')
                    })
                }

                //---
                //METODOS PRIVADOS
                //---

                function cargarParams(){
                    //server_config.metodo = 'cargarParams'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };

        };

})();