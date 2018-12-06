(function() {
  'use strict';

  class QAReproduccionForm {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope, data) {

        this.id_reproduccion_actual = data.id_reproduccion;

        console.log(this.id_reproduccion_actual)
        
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;

        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];
        this.titulo_ventana = 'Cargar reproduccion';

        

        this.statuses = ['On Vacation','Terminated','Employed'];

        this.reproduccion = {
          id_reproduccion: 0,
          titulo_reproduccion: '',
          id_p_estado_reproduccion: 0,
          version_sijai:'',
          casos_prueba: []
        };


        this.ocultar_chip_tmpl = true;
        this.tags = [];

        
          
        //this.caso_reproducciones = caso_reproducciones;
         this.gridOptions1 = {
            data: this.generateJSON(100)
        };

        
        this.gridOptions = {
          data: [
            /*
            {
              id_caso_prueba: "ADASD",
              id_caso_prueba_estado: 1,
              id_reproduccion: 1,
              id_reproduccion_caso_prueba: 1,
              nombre_caso_prueba: 'adsasdsd',
            }*/
          ],
          urlSync: true
        };
        

        this.gridActions1 = {};
        this.gridActions = {};

        this.nueva_reproduccion = {
          titulo_reproduccion: '',
          etiquetas: []
        };

        //console.log(this.gridOptions)

        //this._obtenerCasosPruebasService();

        //console.log(this.gridOptions1)
        this.nueva_reproduccion;

        this.activate(  );
                        
    }; //FIN CONSTRUCTOR
 

    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    guardarReproduccion( iniciar_ejecucion ){
      
      this.reproduccion.id_reproduccion = this.id_reproduccion_actual;

      this.reproduccion.etiquetas = this.generarEtiquetas( );
      this.reproduccion.casos_prueba = angular.copy(this.gridOptions.data);
      this.reproduccion.id_p_estado_reproduccion = (iniciar_ejecucion)?1:0;

      //console.log(this.reproduccion)
      let save = this._qaService.guardarReproduccion( this.reproduccion, iniciar_ejecucion )
      //console.log(casos_prueba)
      save.then(
          (reproduccion) => null,//console.log(reproduccion),
          (err) => console.log(err)
      );

      this._$mdDialog.hide(this.reproduccion);

    };


    cancelarReproduccion(){

      let cancelar_repro_proc = this._qaService.cancelarReproduccion( this.reproduccion.id_reproduccion );
      cancelar_repro_proc.then(
          (reproduccion) => console.log(reproduccion),
          (err) => console.log(err)
      );

    };


    generarEtiquetas(){

      var etiquetas = [],
          i,
          etiqueta;

      for(i = 0; i < this.tags.length; i++){
        etiqueta = {};
        etiqueta.id = i;
        etiqueta.titulo = this.tags[i];
        etiquetas.push( etiqueta );
      }

      return etiquetas;
    };


    generateJSON(length) {
            var jsonObj = [],
                i,
                max,
                names = ['Ann', 'Ben', 'Patrick', 'Steve', 'Fillip', 'Bob'],
                item;
            for (i = 0, max = length; i < max; i++) {

                item = {};
                item.id = i;
                item.name = names[Math.round(Math.random() * (names.length - 1))];
                item.phone = '+375-29-' + Math.round(Math.random() * 1000000);
                item.date = Math.round(Math.random() * 1000000000000);
                item.status = this.statuses[Math.round(Math.random() * (this.statuses.length - 1))];
                jsonObj.push(item);

            }
            return jsonObj;
        }


    esFilaSeleccionada( list_item ){

      let list_item_index = list_item.$index;
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);

      return ( (index_find > -1)?true:false )

    };



    cancelarDialogo(){
      this._$mdDialog.hide( null );
    };



    _obtenerCasosPruebasService( ){

      let casos_prueba = this._qaService.obtenerCasosPruebaAutocompletar( )
      //console.log(casos_prueba)
      casos_prueba.then(
          (casos_prueba) => this._actualizarGrid(casos_prueba),
          (err) => console.log(err)
      );

      
    };




    _actualizarGrid( data ){

      //this.gridOptions.data = angular.extend(this.gridOptions.data, this.reproduccion.casos_prueba);
      return 1;
    };


    querySearch (query) {


       return this._qaService.obtenerCasosPrueba( 'qq' )
        .then(
          function returnData( data ){
            //console.log(query)
            return query ? data.filter( createFilterFor(query) ) : data;
          }
        );

        function createFilterFor(query) {

          var lowercaseQuery = angular.lowercase(query.replace(/\W+/g, ''));
          return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
          };
        }
      }


    selectedItemChange( item ){
      let display = (typeof(item)!== 'undefined')?item.display: '';

      if(display !== ''){
        //console.log(item)
        var obj = {
                "id_reproduccion_caso_prueba": 3,
                "id_reproduccion": 1,
                "id_caso_prueba": '',
                "nombre_caso_prueba": display,
                "id_caso_prueba_estado": 2
            }
        //this.selectedItem = null;
        this.gridOptions.data.push(obj);
        //this._actualizarGrid();

      }

      //console.log(this.gridOptions)

      return 1;
      //this.searchText = null;
      //console.log(item)
    }


    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--

    activate( ){

      this.nueva_reproduccion = (typeof(this.reproduccion_data)==='undefined');

      this.cargarDatosVista( );     

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

  QAReproduccionForm.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope', 'data'];
  angular
    .module('lotes.lote')
    .controller('QAReproduccionForm', QAReproduccionForm);
}());