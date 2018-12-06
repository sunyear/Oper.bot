(function() {
  'use strict';

  
  class ParamsConfigService {

    constructor(basedatosservice) {

      this._basedatosservice = basedatosservice;


      this.server_config = {
          api: 'fs/',
          metodo: ''
      };



      this.params = this._cargarParams();// this._cargarParams();

      

    }


    //--
    // API PUBLICA 
    //--
    
    loadData() {
      this.data.items = ['one', 'two', 'three'];
    };

    obtenerParams(){
      return ( this.params );
    }

    //-- FIN API PUBLICA


    //--
    // API PRIVADA 
    //--

    _cargarParams( server_config ){

      this.server_config.metodo = 'cargarParams'
      var consulta = `${this.server_config.api}${this.server_config.metodo}`;
      var url_conn_completa = false; 
     return ( this._basedatosservice.crudRead( consulta, url_conn_completa ) )
        /*
        .then(
          function( params_promisse ){
                        //return this._config_app_params = params_promisse.params;
                        BaseService.params = params_promisse.params;
                    },
                    function(){},
                    function(){}
        )
        */

    };

    //-- FIN API PRIVADA

    
  }
  
  /* SE REGISTRA LA CLASE Y EL MODULO */
  ParamsConfigService.$inject = ['basedatosservice'];
  angular.module('lotes.lote').service('ParamsConfigService', ParamsConfigService);
}());