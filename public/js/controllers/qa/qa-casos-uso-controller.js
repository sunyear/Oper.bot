(function() {
  'use strict';

  class QACasosUsoController {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope, casos_uso) {

        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;

        
        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];

        this.label_menu_borrar = 'Borrar reproduccion';


        this.caso_reproducciones = casos_uso;

        this.originatorEv = null;

        this.id_caso_reproduccion_sel = 0;

        this.gridOptions = {
          data: this.caso_reproducciones,
          urlSync: true
        };



    }; //FIN CONSTRUCTOR



    abrirDetallesCasoUso( fila_caso_uso, e ){
      this._$state.go('detalles', {id_caso_uso: 1});
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


    openMenu($mdMenu, ev) {
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };

}; //FIN CLASE

QACasosUsoController.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope', 'casos_uso'];
  angular
    .module('lotes.lote')
    .controller('QACasosUsoController', QACasosUsoController);
}());