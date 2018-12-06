(function() {
  'use strict';

  class QAReproducciones {

    constructor($state, qaService, caso_reproducciones, $mdToast, $mdMenu, $mdDialog, $scope) {
        
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;

        this._$scope = $scope;


        this.panel = true;
        this.paneles = [true, true, true];

        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];

        this.label_menu_borrar = 'Borrar reproduccion';

        this.fInicio = new Date().getTime();


        this.tags = [];

        this.reproducciones = {
          disponibles: [],
          ejecucion: []
        };


        this.reproduccion = {
          id_reproduccion: 0,
          titulo_reproduccion: '',
          etiquetas: []
        }

/*
        this._$mdDialog.show({
          multiple: true
        });



      
*/
        
        var obj_fecha_hora = new Date( );

        var fecha_actual = obj_fecha_hora.toLocaleDateString() + ' ' + obj_fecha_hora.toLocaleTimeString()
       // console.log(fecha_actual)
        
        this.caso_reproducciones = caso_reproducciones;

        this.originatorEv = null;

        this.id_caso_reproduccion_sel = 0;

        this.gridOptions = {
          data: null,
          urlSync: true
        };


        this.gridOptions2 = {
          data: null,
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
            txt_estado: '',
            icon_estado: '',
            class_estado: {
                text_class: 'repro_pendiente',
                icon_class: 'toolbar-gray'
              }
            },
            1: {
              txt_estado: 'en ejecucion',
              icon_estado: 'play_arrow',
              class_estado: {
                text_class: 'repro_exitosa',
                icon_class: 'green_big'
              }
            },
            reproduccion_estado_sel: 0
            
          }
        };

        //console.log(this.widgets.reproduccion_estado[1].icon_class)

        
        this.activate();
     
                        
    }; //FIN CONSTRUCTOR
 
    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    expandirPanel( id_panel ){

      //console.log(this.panel)

      this.paneles[id_panel] = !this.paneles[id_panel];

      //return ( this.panel )

    };


    abrirReproduccion( id_reproduccion_abrir ){
            
       // this.reproduccion.id_reproduccion = reproduccion.id_reproduccion;

       console.log(id_reproduccion_abrir)

        let reproduccion_obj = {
          id_reproduccion: id_reproduccion_abrir
        };

        //reproduccion_obj.id_caso_reproduccion = (typeof(reproduccion.item) !== 'undefined')?reproduccion.item.id_caso_reproduccion:1523027100087;

        this._$state.go('reproduccion', reproduccion_obj)
        //this._cargarFormularioReproduccion( reproduccion.item );
    };


    editarReproduccion( id_reproduccion, event ){



      const plantilla_url = './views/qa/reproducciones/qa-reproducciones-modal-template.html',
            controlador_plantilla = 'QAReproduccionForm as vm';

      this._abrirDialogo( plantilla_url,controlador_plantilla,id_reproduccion, this );

      //this._abrirDialogo('editar_reproduccion', id_reproduccion, this );

    };


    crearReproduccion( event ){
      
      const form_data = {id_reproduccion: 0};

           const plantilla_url = './views/qa/reproducciones/qa-reproducciones-modal-template.html',
            controlador_plantilla = 'QAReproduccionForm as vm';

      this._abrirDialogo( plantilla_url,controlador_plantilla,form_data, this );

      //this._abrirDialogo('nueva_reproduccion', form_data, this );

    };


    ejecutarReproduccion( id_reproduccion, event ){


      event.stopPropagation();

      const plantilla_url = './views/qa/reproducciones/qa-reproduccion-ejecutar-template.html',
            controlador_plantilla = 'QAReproduccionForm as vm';

      this._abrirDialogo( plantilla_url,controlador_plantilla,id_reproduccion, this );

      //console.log(reproduccion)
      //this._abrirDialogo('ejecutar_reproduccion', id_reproduccion, this );

    }


    finalizarReproduccion( id_reproduccion, event ){


      event.stopPropagation();

      const plantilla_url = './views/qa/reproducciones/qa-reproduccion-finalizar-template.html',
            controlador_plantilla = 'QAReproduccionForm as vm';

      this._abrirDialogo( plantilla_url,controlador_plantilla,id_reproduccion, this );

      //console.log(reproduccion)
      //this._abrirDialogo('ejecutar_reproduccion', id_reproduccion, this );

    }


    cancelarReproduccion( id_reproduccion, event ){

      let controller = this;
      
        var confirm = controller._$mdDialog.confirm()
          .title('¿Desea cancelar la reproduccion en curso?')
          .textContent('La reproduccion en curso se cancelara')
          .ariaLabel('Lucky day')
          .targetEvent(event)
          .ok('Si. Cancelar reproduccion')
          .cancel('No');

          controller._$mdDialog.show(confirm).then(function() {

            //console.log(id_reproduccion)

            //$scope.status = 'You decided to get rid of your debt.';
            let cancelar_repro_proc = controller._qaService.cancelarReproduccion( id_reproduccion );
            cancelar_repro_proc.then(
                (reproduccion) => controller._cargarReproducciones(),
                (err) => console.log(err)
            );

          }, function() {
            //$scope.status = 'You decided to keep your debt.';
          });
            

    };


    eliminarEscenario( id_reproduccion, event ){

      let controller = this;
      
        var confirm = controller._$mdDialog.confirm()
          .title('Esta a punto eliminar permanentemente un escenario. ¿Desea eliminar el escenario seleccionado?')
          .textContent('El escenario seleccionado se eliminara permanetemente')
          .ariaLabel('Lucky day')
          .targetEvent(event)
          .ok('Si. Eliminar escenario seleccionado')
          .cancel('No');

          controller._$mdDialog.show(confirm).then(function() {

            //console.log(id_reproduccion)

            //$scope.status = 'You decided to get rid of your debt.';
            let oper_borrar_reproducciones = controller._qaService.borrarReproduccion( id_reproduccion );
            oper_borrar_reproducciones.then(
              (caso_reproducciones_borradas) => controller._actualizarListadoCasoReproducciones(controller),
              (err) => console.log(err)
            );

          }, function() {
            //$scope.status = 'You decided to keep your debt.';
          });
            

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

    activate(){

      let controller_obj = this;

      
      this._cargarReproducciones( controller_obj );

     //console.log(this.reproducciones);

     // console.log(this.reproducciones)
    };


    _cargarReproducciones(  ){

      let controlador = this;

        this._qaService.obtenerReproducciones(  )
          .then(
            function cargaDatos( reproducciones ){

              //console.log(reproducciones)

              controlador.reproducciones.disponibles = [];
              controlador.reproducciones.ejecucion = [];

              console.log(reproducciones)




              controlador.reproducciones.disponibles = angular.copy(
                //reproducciones.filter(reproduccion => reproduccion.id_p_estado_reproduccion === 0)
                 reproducciones
              );


              controlador.gridOptions2.data = angular.copy(
                //reproducciones.filter(reproduccion => reproduccion.id_p_estado_reproduccion === 0)
                 reproducciones
              );


              controlador.gridOptions.data = angular.copy(
                reproducciones.filter(reproduccion => reproduccion.id_p_estado_reproduccion === 1)
              );            

              controlador.reproducciones.ejecucion = angular.copy(
                reproducciones.filter(reproduccion => reproduccion.id_p_estado_reproduccion === 1)
              );             

            },
            function error( error ){
              console.log(error);
            }
        );
    }


    _cargarFormularioReproduccion( form_data ){

      //const id_caso_reproduccion = form.id_caso_reproduccion

      //this.form_


      this._abrirDialogo( form_data, this );

    };



    //metodo que encapsula el uso del cuadro de dialogo.
    //lo invoca _cargarFormularioReproduccion
    _abrirDialogo( plantilla_url, controlador_plantilla, form_data, QAReproducciones ){

        

      console.log(form_data)
     
      //form_data = angular.extend(form_data, id_caso_prueba)

      this._$mdDialog.show({
            templateUrl: plantilla_url,//'./views/qa/qa-cp-reproduccion-template.html',
            controller: controlador_plantilla,//'QACPReproduccionesForm as vm',
            //parent: angular.element(document.body),
            targetEvent: this.originatorEv,
            hasBackdrop: true,
            clickOutsideToClose:false,
            escapeToClose: true,
            fullscreen: false, // Only for -xs, -sm breakpoints.
            multiple: true,
            bindToController: true,
            locals: {data: form_data}//{reproduccion_data: form_data}
        })
        .then(onFinally)
        //.finally(onFinally)
        
        function onFinally( callback_data ){

          QAReproducciones._cargarReproducciones();
          /*
            let arr = [];
            if(callback_data != null){
              //console.log(callback_data)
              switch (carga_dialogo){
                case 'nueva_reproduccion': 
                  QAReproducciones.reproducciones.disponibles.push( callback_data )
                break;
                case 'ejecutar_reproduccion':
                  QAReproducciones._cargarReproducciones();
                  //QAReproducciones.reproducciones.disponibles.splice( form_data.indice_array,1 );
                  //QAReproducciones.reproducciones.ejecucion.push( callback_data );
                break;
                case 'editar_reproduccion':

                  for (var i in QAReproducciones.reproducciones.disponibles){
                      
                      var id_reproduccion = QAReproducciones.reproducciones.disponibles[i].id_reproduccion;
                      //console.log(id_reproduccion, callback_data.id_reproduccion)
                      if(id_reproduccion == callback_data.id_reproduccion){
                          QAReproducciones.reproducciones.disponibles[i] = angular.copy(callback_data);
                          i = -1;
                      }
                        
                        
                    }

                  //QAReproducciones.reproducciones.disponibles.splice( form_data.indice_array,1 );
                  
                break;
              }
            }
            */

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


    reportarProblemaCasoPrueba( id_caso_prueba ){

      event.stopPropagation();
      
      const plantilla_url = './views/qa/reproducciones/qa-reproduccion-reportar-template.html',
            controlador_plantilla = 'QACasoPruebaReporte as vm';



      this._abrirDialogo( plantilla_url,controlador_plantilla,{id_reproduccion: 3, id_reproduccon_caso_prueba: 2}, this );


    };

    
  }; //FIN CLASE



  QAReproducciones.$inject = ['$state', 'qaService', 'caso_reproducciones', '$mdToast', '$mdMenu', '$mdDialog', '$scope'];
  angular
    .module('lotes.lote')
    .controller('QAReproducciones', QAReproducciones);
}());