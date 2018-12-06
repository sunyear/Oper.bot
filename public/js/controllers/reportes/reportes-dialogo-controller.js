(function() {
  'use strict';

  class ReportesTableroDialogo {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope, data) {

        this.data = data;

        console.log(this.id_reproduccion_actual)
        
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;

        

        this.activate(  );
                        
    }; //FIN CONSTRUCTOR
 

    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--



    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--

    activate( ){

      //this.nueva_reproduccion = (typeof(this.reproduccion_data)==='undefined');

      //this.cargarDatosVista( );     

    }


    cargarDatosVista( ){

      let id_reproduccion;
      let reproduccion_db = [];
      console.log(this.id_reproduccion_actual)
      if( this.id_reproduccion_actual !== 0) {

        const QAReproduccion = this;
        let reproduccion_db = this._qaService.obtenerReproduccion( this.id_reproduccion_actual )
        //console.log(casos_prueba)
        reproduccion_db.then(
            (reproduccion) => _actualizarGrid(reproduccion, QAReproduccion),
            (err) => console.log(err)
        );


        this.titulo_ventana = 'Editando reproduccion';
        this.ocultar_chip_tmpl = false;
      }
        

      function _actualizarGrid( reproduccion, QAReproduccion){

        //console.log(reproduccion)


        QAReproduccion.reproduccion.titulo_reproduccion = reproduccion.titulo_reproduccion;
        
        QAReproduccion.tags = angular.copy(
                                  reproduccion.etiquetas.map(
                                    function ( etiqueta ) {
                                      return  (etiqueta.titulo)
                                    })
                                );

        QAReproduccion.gridOptions.data = angular.copy(reproduccion.casos_prueba);

      }

    };


    
  }; //FIN CLASE

  ReportesTableroDialogo.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope', 'data'];
  angular
    .module('lotes.lote')
    .controller('ReportesTableroDialogo', ReportesTableroDialogo);
}());