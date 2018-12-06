(function() {
  'use strict';

  class QACPReproduccionesForm {

    constructor(reproduccion_form_data, $mdDialog) {
        
        //this._qaService = qaService;
        this._$mdDialog = $mdDialog;

        this.originatorEv = null;

        console.log(reproduccion_form_data)


        this.widgets = {
          reproduccion_estado: {
            '0': {
            txt_estado: 'Exitosa',
            icon_estado: 'check_circle',
            class_estado: ''
            },
            '1': {
              txt_estado: 'Pendiente',
              icon_estado: 'help',
              class_estado: ''
            },
            '-1': {
              txt_estado: 'Fallida',
              icon_estado: 'warning',
              class_estado: ''
            },
            reproduccion_estado_sel: 1
          },
         
          
        }


        this.formulario_reproduccion = {
          modoEdicion: false,
          data: reproduccion_form_data,
          id_estado_reproduccion: 1
        };

        //console.log(datos_formulario)
        //this.params_data = params_data.params;
       
       // this._setDialogData( reproduccion_form_data )
                        
    };

  
/*
    $on('$viewContentLoaded', function(event, args){
      console.log(''asd)
      //this.cargarDatos()
    });
*/
    
    openMenu($mdMenu, ev) {
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };



    setReproduccionEstado( id_estado ){
      //const estado = angular.copy(this.widgets.id_sel, {})      

      this._updateFormWidgets( 'reproduccion_estado', id_estado )
    

    }


    hide() {
      this._$mdDialog.hide();
    };

    cancel() {
      this._$mdDialog.cancel();
    };

    procesarForm() {
      var obj = this.obj;
      this._$mdDialog.hide(obj);
    };


    _setWindowData( reproduccion_form_data ){

      //this._updateFormWidgets( 'reproduccion_estado', this.widgets.id_widget_sel );
      /*

      console.log(reproduccion_form_data)

      const primary_key = Object(angular.copy(reproduccion_form_data.primary_key, {id:0}));
      //const form_data = reproduccion_form_data.form_data;

      if(Object.values(primary_key) === 0){ //NUEVA REPRODUCCION

        setFormularioView('alta');

      }else{
        setFormularioView('edicion');
        //setFormularioData( form_data );
      }


        function setFormularioData(){

        }

        function setFormularioView(){

        }
        */

    }


    _updateFormWidgets( widget_name, widget_id ){
      this.widgets[widget_name].reproduccion_estado_sel = widget_id;
      console.log(this.widgets[widget_name].id_widget_sel)
      console.log(this.widgets.reproduccion_estado[this.widgets.reproduccion_estado.reproduccion_estado_sel].txt_estado)
    }
    
  }

  QACPReproduccionesForm.$inject = ['reproduccion_form_data', '$mdDialog'];
  angular
    .module('lotes.lote')
    .controller('QACPReproduccionesForm', QACPReproduccionesForm);
}());