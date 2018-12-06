(function() {
  'use strict';

  class QACasosReproducciones {

    constructor($state, qaService, caso_reproducciones, $mdToast, $mdMenu, $mdDialog, $scope) {
        
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;

        this.scope = 'jajajaaj';

        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];

        this.label_menu_borrar = 'Borrar reproduccion';

/*
        this._$mdDialog.show({
          multiple: true
        });
      
*/

        console.log(caso_reproducciones)
        this.caso_reproducciones = caso_reproducciones;

        this.originatorEv = null;

        this.id_caso_reproduccion_sel = 0;

        this.gridOptions = {
          data: this.caso_reproducciones,
          urlSync: true
        };

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
            
          }
        };


        console.log(this.widgets.reproduccion_estado[1].icon_class)

        
     
                        
    }; //FIN CONSTRUCTOR
 

    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


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

        //this._$state.go('reproduccion', {id_caso_reproduccion: reproduccion.item.id_caso_reproduccion})
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


    openMenu($mdMenu, ev) {
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };


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



    //--
    // METODOS PRIVADOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--

    _cargarFormularioReproduccion( form_data ){

      //const id_caso_reproduccion = form.id_caso_reproduccion

      //this.form_


      this._abrirDialogo( form_data, this );

    };



    //metodo que encapsula el uso del cuadro de dialogo.
    //lo invoca _cargarFormularioReproduccion
    _abrirDialogo( form_data, QACasosReproducciones ){

      //console.log(this.id_caso_reproduccion_sel);
      //form_data = angular.extend(form_data, this.id_caso_reproduccion_sel);
      //console.log(form_data);

      const id_caso_prueba = {
        id_caso_prueba: this._$state.params.id_caso_prueba
      }

      form_data = angular.extend(form_data, id_caso_prueba)

      this._$mdDialog.show({
            controller: 'QACPReproduccionesForm as vm',
            templateUrl: './views/qa/qa-cp-reproduccion-template.html',
            //parent: angular.element(document.body),
            targetEvent: this.originatorEv,
            hasBackdrop: true,
            clickOutsideToClose:false,
            escapeToClose: false,
            fullscreen: false, // Only for -xs, -sm breakpoints.
            multiple: true,
            locals: {
                reproduccion_form_data: form_data
            }
        })
        .then(onFinally)
        .finally(onFinally)
        
        function onFinally(has_changed){
             QACasosReproducciones._actualizarListadoCasoReproducciones(QACasosReproducciones)
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
      console.log(oper_borrar_reproducciones)
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

  QACasosReproducciones.$inject = ['$state', 'qaService', 'caso_reproducciones', '$mdToast', '$mdMenu', '$mdDialog', '$scope'];
  angular
    .module('lotes.lote')
    .controller('QACasosReproducciones', QACasosReproducciones);
}());