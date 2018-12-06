(function() {
  'use strict';

  class QAReproduccionDetalles {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope, $q, $timeout, reproduccion) {
        
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;
        this._$q = $q;
        this._$timeout = $timeout;
        this.tags = [];

        this.scope = 'jajajaaj';

        this.fila_seleccionada = null;
        //this.vm.selectedItem = null;
        //this.searchTextChange   = searchTextChange;

        this.filas_seleccionadas = [];

        this.label_menu_borrar = 'Borrar reproduccion';


        this.menu_estado = {

        }


/*
        this._$mdDialog.show({
          multiple: true
        });
      
*/
        this.id_reproduccion_actual = 0;
        this.reproduccion = reproduccion;
        

        //console.log(this.reproduccion.casos_prueba)
        this.originatorEv = null;

        this.id_caso_reproduccion_sel = 0;

        
        //this.menu_estado = this.armarMenuEstado();


        this.gridOptions = {
          data: [],
          urlSync: true
        };

        //console.log(this.gridOptions)
        
        this.componentes = {
            "reproduccion_notas": {
                "titulo": '',//this._setTituloComponente(0),
                "texto": '',//casoPruebaDataPack.nota_ejecucion || nota_ejecucion_texto_default,
                "max_char": 150,
                "left_chars": 0,
                "json_data": JSON.parse('{}'),//
                "editar": false,
                "editar_index": null,
                "editar_item_nuevo": false,
                "visible": false,
                "id_caso_reproduccion_sel": this.id_caso_reproduccion_sel
            }

        }


        this.widgets = {
          reproduccion_estado: {
            0: {
            txt_estado: 'Reproduccion exitosa',
            icon_estado: 'done',
            class_estado: {
                text_class: 'repro_exitosa',
                icon_class: 'green_big'
              }
            },
            2: {
              txt_estado: 'Reproduccion pendiente',
              icon_estado: 'schedule',
              class_estado: {
                text_class: 'repro_pendiente',
                icon_class: 'toolbar-gray'
              }
            },
            1: {
              txt_estado: 'Reproduccion fallida',
              icon_estado: 'close',
              class_estado: {
                text_class: 'repro_fallida',
                icon_class: 'red'
              }
            },
            reproduccion_estado_sel: 1
            
          },
          caso_prueba_estado: {
            0: {
            txt_estado: 'aceptado',
            class_estado: {
                text_class: 'estado-cp-string-exito',
                fila_class: 'estado-cp-fondo-exito'
              }
            },
            1: {
            txt_estado: 'rechazado',
            class_estado: {
                text_class: 'estado_cp_string_error',
                fila_class: 'estado_cp_fondo_error'
              }
            },
            2: {
            txt_estado: 'pendiente',
            class_estado: {
                text_class: 'estado_cp_string_pendiente',
                fila_class: 'estado_cp_fondo_pendiente'
              }
            },
          }
        };


        //console.log(this.gridOptions)



       // this._cargarCasosPrueba( this );

       this._activate();
     
                        
    }; //FIN CONSTRUCTOR
 

    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    mapF(){



      /*
      this.reproduccion.casos_prueba.map( function (state) {
        //console.log(state)

        return {
          value: state.nombre_caso_prueba.toLowerCase(),
          display: state.id_caso_prueba + ' ' + state.nombre_caso_prueba
        }
      });
      */

      console.log(this.querySearch('qqqq'))
        

        /*return {
          value: state.toLowerCase(),
          display: state
        };
        */
    }


    querySearch (query) {


      var states = [
        {
          value: 'santa fe',
          display: 'Santa Fe',
        },
        {
          value: 'buenos aires',
          display: 'Buenos Aires',
        },
        {
          value: 'cordoba',
          display: 'Coroco',
        }
      ];


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

        /*
      var results = query ? states.filter( this.createFilterFor(query) ) : states,
          deferred;
      //if (self.simulateQuery) {
        deferred = this._$q.defer();
        this._$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      //} else {
        //return results;
      //}
      */
    }


    selectedItemChange( item ){

      //console.log(item)
      var obj = {
              "id_reproduccion_caso_prueba": 3,
              "id_reproduccion": 1,
              "id_caso_prueba": '',
              "nombre_caso_prueba": item.display || '',
              "id_caso_prueba_estado": 2
          }
      //this.selectedItem = null;
      
      //console.log(this.gridOptions);
      return ( this.reproduccion.casos_prueba.push(obj) );
      
      //this.searchText = null;
      //console.log(item)
    }


    


    abrirReproduccion( reproduccion ){
            
     /*
      if(this.componentes.reproduccion_notas.editar){
          return;
      }

      this._setIDCasoReproduccion(reproduccion.item.id_caso_reproduccion);
      this._setTituloComponente(reproduccion.item.id_caso_reproduccion);

      this._qaService
          .obtenerNotasReproduccion( reproduccion.item.id_caso_reproduccion )
          .then(
            (json_data) => this._setNotasReproduccion(json_data),//angular.extend(this.componentes.reproduccion_notas.json_data, json_data[0]),//this.setViewModelData(val),//this.config_app_params.push(val),
            (err) => console.log(err)
          );

        */

        this._setIDCasoReproduccion(reproduccion.item.id_caso_reproduccion);
        const form_data = reproduccion.item;
        this._cargarFormularioReproduccion( reproduccion.item );
    };


    filaSeleccionada( check ){

      let check_int = typeof(check === 'undefined')?false:check;

      return check_int;
    };


    


    todosSeleccionados(){

      //console.log(this.caso_reproducciones.length)

      let b = false;

      if(this.filas_seleccionadas.length === 0){
        return b;
      }else{

        if(this.filas_seleccionadas.length === this.caso_reproducciones.length){
          b = true;
        }
      }

      return b;
    };


    isIndeterminate(){

      return ( (this.filas_seleccionadas.length > 0 && !this.todosSeleccionados()) )

    };


    seleccionarTodo(){

      let filas_tmp = [];
      
      if(this.filas_seleccionadas.length === 0 || this.isIndeterminate()){

        angular.forEach(this.caso_reproducciones, function(value, index){
          filas_tmp.push(index)
        })
        this.filas_seleccionadas = angular.extend(filas_tmp);

      }else{
        this.filas_seleccionadas = [];
      }

      //console.log(ll)

    };


    crearReproduccion( event ){
      const new_id_caso_reproduccion = 0;
      this._setIDCasoReproduccion(new_id_caso_reproduccion);
      this._guardarCasoReproduccion(new_id_caso_reproduccion);
      //this._test(new_id_caso_reproduccion);
    };


    habilitarBorrarReproduccion( event ){

      let c_filas_seleccionadas = this.filas_seleccionadas.length;
      this.label_menu_borrar = (c_filas_seleccionadas > 1)?'Borrar reproducciones':'Borrar reproduccion';
      let habilita_menu_borrar = (c_filas_seleccionadas > 0)?false:true;

      return ( habilita_menu_borrar )

    };


    openMenu($mdMenu, ev, item, i_fila) {
      
      //this.gridOptions.data[fila].id_caso_prueba_estado
      
      //if(typeof(item.id_caso_prueba_estado) != 'undefined'){
        this.armarMenuEstado( item.id_caso_prueba_estado, i_fila );
      //};


      this.originatorEv = ev;
      $mdMenu.open(ev);
    };


    armarMenuEstado( id_caso_prueba_estado, i_fila ){

     return this.menu_estado = [
        {
          display: 'aceptado',
          id_caso_prueba_estado: 0,
          icon: (id_caso_prueba_estado == 0)? 'done': '',
          fila: i_fila
        },
        {
          display: 'rechazado',
          id_caso_prueba_estado: 1,
          icon: (id_caso_prueba_estado == 1)? 'done': '',
          fila: i_fila
        },
        {
          display: 'pendiente',
          id_caso_prueba_estado: 2,
         icon: (id_caso_prueba_estado == 2)? 'done': '',
         fila: i_fila
        }
      ];
    
    }


    seleccionarReproduccion( list_item, event ){

      let list_item_index = list_item.$index;
     
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);
      if(index_find === -1){
        this.filas_seleccionadas.push(list_item_index);  
      }else{
        this.filas_seleccionadas.splice(index_find, 1);
      }
      
      event.stopPropagation();

    }


    esFilaSeleccionada( list_item ){

      let list_item_index = list_item.$index;
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);

      return ( (index_find > -1)?true:false )

    };


    borrarReproducciones(){
      //let filas_a_borrar = this.filas_seleccionadas;

      let obj_fila = {id_caso_reproduccion: null}

      let filas_a_borrar = [];

      for(var i=0; i< this.filas_seleccionadas.length; i++){
                
        filas_a_borrar.push(this.caso_reproducciones[this.filas_seleccionadas[i]].id_caso_reproduccion);

      }

      if(filas_a_borrar.length > 0){

        let oper_borrar_reproducciones = this._qaService.borrarReproduccion( filas_a_borrar );
        oper_borrar_reproducciones.then(
          (caso_reproducciones_borradas) => this._actualizarListadoCasoReproducciones(this),
          (err) => console.log(err)
        );

      }

      

    };


    cambiarEstadoCasoPrueba(event, i_fila, id_p_estado){

      this.gridOptions.data[i_fila.fila].id_caso_prueba_estado = id_p_estado;

    };


    devolverEstadoCasoPrueba( id_p_estado ){

      if(typeof(id_p_estado) != 'undefined'){
        //console.log(typeof(id_p_estado))

        return this.widgets.caso_prueba_estado[id_p_estado].class_estado.fila_class;
      }

    };


    abrirDetallesCasoPrueba(fila, fila_seleccionada, event){

      
      event.stopPropagation();

      const plantilla_url = './views/qa/qa-datos-caso-template.html',
            controlador_plantilla = 'QACPDatosController';

      this._abrirDialogo( plantilla_url,controlador_plantilla,[fila_seleccionada.id_caso_prueba,fila_seleccionada.id_caso_prueba_estado], this );

    };


    finalizarReproduccion(event){

      //event.stopPropagation();
      this._abrirDialogoFinalizarReproduccion(this);

    };


    reportarProblemaCasoPrueba( data_caso_prueba ){

      event.stopPropagation();
      
      const plantilla_url = './views/qa/reproducciones/qa-reproduccion-reportar-template.html',
            controlador_plantilla = 'QACasoPruebaReporte as vm';

      

      this._abrirDialogo( plantilla_url,controlador_plantilla,data_caso_prueba, this );


    };



    //--
    // METODOS PRIVADOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    _activate(){

      console.log( this.reproduccion)

      this.id_reproduccion_actual = this._$state.params.id_reproduccion;


      this._cargarDatosVista();



    };


    _cargarDatosVista(){

      let id_reproduccion_caso_prueba,
          id_reproduccion,
          es_caso_prueba_reportado,
          obj = this;

          console.log(this.reproduccion.casos_prueba)

      angular.forEach( this.reproduccion.casos_prueba, function( caso_prueba, clave ){

        

        id_reproduccion = caso_prueba.id_reproduccion;
        id_reproduccion_caso_prueba = caso_prueba.id_reproduccion_caso_prueba;
        
        obj.reproduccion.casos_prueba[clave].es_caso_prueba_reportado = obj._qaService.esCasoPruebaReportado( id_reproduccion, id_reproduccion_caso_prueba );

      });

      console.log(this.reproduccion)

      //expect(log).toEqual(['name: misko', 'gender: male']);

      this.gridOptions.data = angular.copy( this.reproduccion.casos_prueba );
      this.tags = angular.copy(
                                  this.reproduccion.etiquetas.map(
                                    function ( etiqueta ) {
                                      return  (etiqueta.titulo)
                                    })
                                );




    };


    _cargarCasosPrueba( QAReproduccion ){

      //console.log(this.reproduccion)

     
    };


    _cargarFormularioReproduccion( form_data ){

      //const id_caso_reproduccion = form.id_caso_reproduccion

      //this.form_


      this._abrirDialogo( form_data, this );




    };



    //metodo que encapsula el uso del cuadro de dialogo.
    //lo invoca _cargarFormularioReproduccion
    _abrirDialogo( plantilla_url, controlador_plantilla, form_data, QAReproduccionDetalles ){

      //console.log(this.id_caso_reproduccion_sel);
      //form_data = angular.extend(form_data, this.id_caso_reproduccion_sel);
      console.log(form_data);

      const id_caso_prueba = {
        id_caso_prueba: this._$state.params.id_caso_prueba
      }

      //form_data = angular.extend(form_data, id_caso_prueba)

      this._$mdDialog.show({
            templateUrl: plantilla_url,
            controller: controlador_plantilla,
            //parent: angular.element(document.body),
            targetEvent: this.originatorEv,
            hasBackdrop: true,
            clickOutsideToClose:true,
            escapeToClose: true,
            fullscreen: false, // Only for -xs, -sm breakpoints.
            multiple: true,
            bindToController: true,
            locals: { data: form_data }
        })
        .then(onFinally)
        .finally(onFinally)
        
        function onFinally( callback_data ){

            QAReproduccionDetalles._cargarDatosVista();

             //QACasosReproducciones._actualizarListadoCasoReproducciones(QACasosReproducciones)
        };

    }



    //metodo que encapsula el uso del cuadro de dialogo.
    //lo invoca _cargarFormularioReproduccion
    _abrirDialogoFinalizarReproduccion( QAReproduccionDetalles ){

      //console.log(this.id_caso_reproduccion_sel);
      //form_data = angular.extend(form_data, this.id_caso_reproduccion_sel);
      console.log(form_data);

      const id_caso_prueba = {
        id_caso_prueba: this._$state.params.id_caso_prueba
      }

      //form_data = angular.extend(form_data, id_caso_prueba)

      this._$mdDialog.show({
            templateUrl: './views/qa/qa-datos-caso-template.html',
            controller: 'QACPDatosController',
            //parent: angular.element(document.body),
            targetEvent: this.originatorEv,
            hasBackdrop: true,
            clickOutsideToClose:true,
            escapeToClose: false,
            fullscreen: false, // Only for -xs, -sm breakpoints.
            multiple: true,
            bindToController: false,
            locals: {
                caso_prueba: {id_caso_prueba:form_data[0], id_estado_caso_prueba: form_data[1]} /*--->id_caso_prueba*/
            }
        })
        .then(onFinally)
        .finally(onFinally)
        
        function onFinally(has_changed){
             //QACasosReproducciones._actualizarListadoCasoReproducciones(QACasosReproducciones)
        };

    }

    _getName(){
      console.log(this.scope)
    }

    
    _test(thing){
      const _$mdDialog_ = this._$mdDialog;
      this._$mdDialog.show({
          controllerAs: 'dialogCtrl',
          clickOutsideToClose: true,
          bindToController: true,
          controller: function(_$mdDialog_){
            this.click = function click(){
              _$mdDialog_.show({
                controllerAs: 'dialogCtrl',
                controller: function(_$mdDialog_){
                  this.click = function(){
                    _$mdDialog_.hide();
                  }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                template: '<md-dialog class="confirm"><md-conent><md-button ng-click="dialogCtrl.click()">I am in a 2nd dialog!</md-button></md-conent></md-dialog>'
              })
            }
          },
          autoWrap: false,
          template: '<md-dialog class="stickyDialog" data-type="{{::dialogCtrl.thing.title}}"><md-conent><md-button ng-click="dialogCtrl.click()">I am in a dialog!</md-button></md-conent></md-dialog>',
          locals: {
            thing: thing
          }
        })
    }

    _guardarCasoReproduccion( new_id_caso_reproduccion ){

      /*
      /* no me decido si sera un valor dinamico (let) o un valor estatico (const)
      /* uso ^let^ porque implica que el valor podria cambiar (aunque no se puede reasignar, es decir, no puede ser un nuevo array u objeto)
      /* 
      */
      
      //let max_index = (this.caso_reproducciones.length);
      
      var reproduccion_form_data = {
        //modoEdicion: true,
        //primary_key: {id_reproduccion: 0},
        
          id_caso_reproduccion: this.id_caso_reproduccion_sel
        

      };
      

      this._cargarFormularioReproduccion( reproduccion_form_data );
    };


    _borrarCasoReproduccionService( casos_reproducciones ){

      let oper_borrar_reproducciones = this._qaService.borrarReproduccion( casos_reproducciones )
      //console.log(oper_borrar_reproducciones)
      oper_borrar_reproducciones.then(
          (caso_reproducciones_borradas) => this._actualizarListadoCasoReproducciones(this),
          (err) => console.log(err)
      );
    };


    _borrarItemsDataGrid( reproducciones_borradas ){

      //console.log(this.filas_seleccionadas)




      //this.

    };

    
  }; //FIN CLASE

  QAReproduccionDetalles.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope', '$q', '$timeout', 'reproduccion'];
  angular
    .module('lotes.lote')
    .controller('QAReproduccionDetalles', QAReproduccionDetalles);
}());