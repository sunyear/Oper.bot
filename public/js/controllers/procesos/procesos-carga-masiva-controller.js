(function() {
  'use strict';

  class ProcesosCargaMasivaController {

    constructor($state, procesosMasivosService, $mdToast, $mdMenu, $mdDialog, $filter, $scope, data) {

        this._procesosMasivosService = procesosMasivosService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;
        this._$filter = $filter;
        this._$toast = $mdToast;

        this.dataset = data;

        this.dataset.texto_buscado = '';

        this.menu_visible = -1;


        
        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];

        this.label_menu_borrar = 'Borrar reproduccion';


        this.procesos_masivos = [
          {
            id_proceso_masivo: null,
            fecha_proceso: null,
            lote: null,
            remito: null,
            actas: null,
            zona: null
          }
        ];//casos_uso;

        this.originatorEv = null;

        this.id_caso_reproduccion_sel = 0;

         this.gridOptions = {
              data: [
                {
                  id_proceso_masivo: 1,
                  tipo_proceso: 'CARGA MASIVA',
                  fecha_proceso: '13/11/2018',
                  lotes_norte: 5,
                  lotes_sur: 3,
                  actas: 457
                },
                {
                  id_proceso_masivo: 1,
                  tipo_proceso: 'CARGA MASIVA',
                  fecha_proceso: '13/11/2018',
                  lotes_norte: 5,
                  lotes_sur: 3,
                  actas: 457
                },
                {
                  id_proceso_masivo: 1,
                  tipo_proceso: 'REPROCESO',
                  fecha_proceso: '13/11/2018',
                  lotes_norte: 5,
                  lotes_sur: 3,
                  actas: 457
                }
              ],
              urlSync: true
          };


          this._activate();

    }; //FIN CONSTRUCTOR



    verDetalles( fila_proceso_masivo, e ){
      

      //console.log(fila_proceso_masivo)

      
      const form_data = {idProcesoMasivo: fila_proceso_masivo.id_proceso_masivo};

            const plantilla_url = './views/procesos/procesos-carga-masiva-modal-template.html',
            controlador_plantilla = 'ProcesosCargaMasivaControllerForm as vm';

      //this._abrirDialogo( plantilla_url,controlador_plantilla,form_data, this );

        //reproduccion_obj.id_caso_reproduccion = (typeof(reproduccion.item) !== 'undefined')?reproduccion.item.id_caso_reproduccion:1523027100087;

        //this._abrirDialogo( e,controlador_plantilla,form_data, this );
        this._$state.go('procesos.carga-masiva-lotes', form_data)

    };


    crearCasoUso( nuevo_caso_uso, e ){
      this._$state.go('detalles', {id_caso_uso: 0});
    };


    hayFilaSeleccionada( deep ){

      let hay_fila_seleccionada = false

      if(deep){
        hay_fila_seleccionada = (this.filas_seleccionadas.length === 1)?false:true;
      }else{
        hay_fila_seleccionada = (this.filas_seleccionadas.length > 0)?true:false;        
      }

      return ( hay_fila_seleccionada );
    };


    todosSeleccionados(){

      //console.log(this.caso_reproducciones.length)

      let b = false;

      if(this.filas_seleccionadas.length === 0){
        return b;
      }else{
        if(this.filas_seleccionadas.length === this.gridOptions.data.length){
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

        angular.forEach(this.gridOptions.data, function(value, index){
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


    seleccionarReproduccion( list_item, event ){

      let list_item_index = list_item.$index;
     
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);
      if(index_find === -1){
        this.filas_seleccionadas.push(list_item_index);  
      }else{
        this.filas_seleccionadas.splice(index_find, 1);
      }
      

      console.log(this.caso_reproducciones)
      event.stopPropagation();

    };

    esFilaSeleccionada( list_item ){

      let list_item_index = list_item.$index;
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);

      return ( (index_find > -1)?true:false )

    };


    crearProcesoMasivo( event ){
      
      /*
      const form_data = {id_proceso_masivo: 0};

            const plantilla_url = './views/procesos/procesos-carga-masiva-modal-template.html',
            controlador_plantilla = 'ProcesosCargaMasivaControllerForm as vm';

      this._abrirDialogo( plantilla_url,controlador_plantilla,form_data, this );
    */

      this._$state.go('procesos.carga-masiva-lotes', {idProcesoMasivo: 0});

    };


    eliminarProcesoMasivo( id_proceso_masivo, indice_dataset, ev ){



      //.then(_eliminarProcesoMasivo(this))
      const controlador = this;
      this._$mdDialog.show(

        this._$mdDialog.confirm()
          .title('¿Eliminar el proceso masivo?')
          .textContent('Todos los datos relacionados al proceso masivo seran eliminados')
          .targetEvent(ev)
          .ok('Eliminar datos')
          .cancel('Cancelar')
        )
      .then(
        function (){
          //const ProcesoCargaMasiva = this;
        
          let carga_masiva_db = controlador._procesosMasivosService.eliminarProcesoMasivo( id_proceso_masivo )
          //console.log(carga_masiva_db)
          carga_masiva_db.then(
              (eliminado) => {
                console.log(eliminado)
                  //this.obj_vista_modelo.detalle.splice(0,0,item_data); 
                  controlador.dataset.splice(indice_dataset,1);
                  controlador._cargarProcesosMasivos()
                },
              (err) => console.log(err)
          );
        },
        function (){
          console.log('no borro')
        }
      );


      function _eliminarProcesoMasivo( CLASE ){
        
      
      }

    };



    openMenu($mdMenu, ev) {
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };


    buscarProcesoMasivo(){
    

    if(typeof(this.dataset.texto_buscado) !== 'undefined' && this.dataset.texto_buscado.length > 0){
      this._cargarProcesosMasivos( this.dataset.texto_buscado )
    }else{
      this._cargarProcesosMasivos(  )
    }
  

    };


    //METODOS PRIVADOS

    _activate(  ){

      //this._cargarProcesosMasivos();

    }


    _cargarProcesosMasivos( busq = '' ){

      let controlador = this;
      
        //if(typeof(this.dataset) === 'undefined'){
          //console.log('asd')

          this._procesosMasivosService.obtenerProcesosMasivos( busq )
            .then(
              function cargaDatos( procesos_masivos ){
          
               // controlador.gridOptions.data = procesos_masivos;

               controlador.dataset = angular.copy( procesos_masivos )
                
              },
              function error( error ){
                console.log(error);
              }
          );
        //}else{
          //this.gridOptions.data = angular.copy( this.dataset );
       // }

        //procesos_masivos.fech = this._$filter('date')(procesos_masivos.fecha_proceso, 'yyyy/MM/dd HH:mm:ss');
        //$filter('filter')(array, expression, comparator, anyPropertyKey)
        
        //console.log(this.dataset)
    }


    _buscarProcesoMasivo( numero_lote ){
      let carga_masiva_db = this._procesosMasivosService.obtenerProcesosMasivos( arr_busq )
        //console.log(carga_masiva_db)
        carga_masiva_db.then(
            (resultado) => {
              console.log(resultado)
                //this.obj_vista_modelo.detalle.splice(0,0,item_data); 
                //this.dataset.splice(indice_dataset,1);
                //this._cargarProcesosMasivos()
              },
            (err) => console.log(err)
        );

    };






    //metodo que encapsula el uso del cuadro de dialogo.
    //lo invoca _cargarFormularioReproduccion
    _abrirDialogo( plantilla_url, controlador_plantilla, form_data, QAReproducciones ){

        

      //console.log(form_data)
     
      //form_data = angular.extend(form_data, id_caso_prueba)

      if(typeof(plantilla_url) === 'object'){
        this._$mdDialog.show(
            {
              clickOutsideToClose:false,
              hasBackdrop: true,
               template: '<md-dialog>' +
                    '  <md-dialog-content style="padding: 10px">' +
                    '  <md-icon class="md-menu-origin material-icons md-20">hourglass_full</md-icon>' +
                    '     cargando...' +
                    '  </md-dialog-content>' +
                    '</md-dialog>'
            }
          )
            
            /*
            this._$mdDialog.alert()
            //.parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .textContent('Cargando...')
            .targetEvent(plantilla_url)
          )
          */

          .then(onFinally)  
      }else{

      

      this._$mdDialog.show(
            {
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
            }
        )
        .then(onFinally)
      }
        //.finally(onFinally)
        
        function onFinally( callback_data ){

          QAReproducciones._cargarProcesosMasivos();

          //QAReproducciones._cargarReproducciones();
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


}; //FIN CLASE

ProcesosCargaMasivaController.$inject = ['$state', 'procesosMasivosService', '$mdToast', '$mdMenu', '$mdDialog', '$filter', '$scope', 'data'];
  angular
    .module('lotes.lote')
    .controller('ProcesosCargaMasivaController', ProcesosCargaMasivaController);
}());