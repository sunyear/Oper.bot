(function() {
  'use strict';

  class QACPReproduccionesForm {

    constructor(reproduccion_form_data, $mdDialog, $state, qaService, $mdToast) {
        
        //this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$mdToast = $mdToast;

        this._qaService = qaService;
        this.reproduccion_form_data = angular.copy(reproduccion_form_data);

        this.originatorEv = null;
        //console.log(this._qaService.getCasoPrueba( reproduccion_form_data.id_caso_prueba))
        this.casoPruebaDataPack = {
          resultados_esperados: {}
        }
        //var casoPruebaDataPack =  angular.extend({}, $state.current.data.caso_prueba);

        //console.log(this._qaService.getCasoPrueba('resultados_esperados'))


        this.formulario_reproduccion = {
          modosFormulario: {
            1: 'view_mode',
            2: 'edit_mode'
          },
          modoEdicion: false,
          has_changed : false,
          data: reproduccion_form_data,
          id_estado_reproduccion: 1
        };


      
        this.widgets = {
          reproduccion_estado: {
            '0': {
            txt_estado: 'Reproduccion exitosa',
            icon_estado: 'check_circle',
            class_estado: {
                text_class: 'repro_exitosa',
                icon_class: 'green_big'
              }
            },
            '1': {
              txt_estado: 'Reproduccion pendiente',
              icon_estado: 'schedule',
              class_estado: {
                text_class: 'repro_pendiente',
                icon_class: 'toolbar-gray'
              }
            },
            '-1': {
              txt_estado: 'Reproduccion fallida',
              icon_estado: 'error',
              class_estado: {
                text_class: 'repro_fallida',
                icon_class: 'red'
              }
            },
            reproduccion_estado_sel: 1
            
          },
          reproduccion_notas : {
            data: this.formulario_reproduccion.data.notas || ''//angular.extend({}, this.formulario_reproduccion.data.notas)
          }
        };




        
        
        this.reproduccion_datos = {
          campos: {
            f_reproduccion: {
              icon: 'event',
              cmp_nombre: 'fecha/hora reproduccion',
              cmp_data: this.formulario_reproduccion.data.f_reproduccion
            },
            archivo_entrada: {
              icon: 'arrow_forward',
              cmp_nombre: 'archivo entrada',
              cmp_data: this.formulario_reproduccion.data.archivo_entrada
            },
            id_version_sijai: {
              icon: 'ondemand_video',
              cmp_nombre: 'version sijai',
              cmp_data: [this.formulario_reproduccion.data.id_version_sijai, this.formulario_reproduccion.data.version_sijai]
            }
          },
          descripcion: {
            cmp_nombre: 'Descripcion',
            cmp_data: this.formulario_reproduccion.data.archivo_salida
          },
          edit_state: false,
          id_caso_reproduccion: (this.formulario_reproduccion.data.id_caso_reproduccion != 0)?this.formulario_reproduccion.data.id_caso_reproduccion: 0

        };

        this._activate();
                          
    };

  
/*
    $on('$viewContentLoaded', function(event, args){
      console.log(''asd)
      //this.cargarDatos()
    });
*/

    


    //---
    //METODOS PRIVADOS
    //---


    _activate(  ){
      //console.log(this.formulario_reproduccion.data.hasOwnProperty('id_caso_reproduccion'))
      //console.log(this.formulario_reproduccion.data)

      let caso_prueba = this._qaService.getCasoPrueba( this.reproduccion_form_data.id_caso_prueba )

      caso_prueba.then(
            (caso_prueba) => angular.extend(this.casoPruebaDataPack.resultados_esperados, caso_prueba.resultados_esperados),//this.setViewModelData(val),//this.config_app_params.push(val),
            (err) => console.log(err)
        ); 
      
      //angular.extend({}, this._qaService.getCasoPrueba( reproduccion_form_data.id_caso_prueba ))
      //console.log(this.casoPruebaDataPack)
      if(this.formulario_reproduccion.data.id_caso_reproduccion === 0){
        //quiere decir que se esta creando una reproduccion
        this._setEditMode(true)
      }

      

      //console.log(this.widgets.reproduccion_notas.data)

    }


    _setEditMode( edit_state ){

      //const widget = 'reproduccion_notas';
      //const edit_int = false;
     // switch
       this.reproduccion_datos.edit_state = edit_state;
      //console.log(this.widgets[widget_name])

    };


    _updateFormWidgets( widget_name, widget_id ){
      this.widgets[widget_name].reproduccion_estado_sel = widget_id;
      //console.log(this.widgets[widget_name].id_widget_sel)
      //console.log(this.widgets.reproduccion_estado[this.widgets.reproduccion_estado.reproduccion_estado_sel].txt_estado)
    }

    _obtenerReproduccionNotas(){

      if(this.formulario_reproduccion.data.hasOwnProperty('id_caso_reproduccion')){
        const id_caso_reproduccion = this.formulario_reproduccion.data.id_caso_reproduccion;
        const caso_reproduccion_nota = this._qaService.obtenerNotasReproduccion( id_caso_reproduccion );
        caso_reproduccion_nota.then(
            (nota) => angular.extend(this.widgets.reproduccion_notas.data, nota),//this.setViewModelData(val),//this.config_app_params.push(val),
            (err) => console.log(err)
        ); 
      }

    };


    _actualizarVista( caso_reproduccion ){

          const edit_mode = 'VIEW_MODE';
          //const edit_mode = view_mode;

          //angular.copy(QACPReproduccionesForm.widgets.reproduccion_notas.data, nota);
          this.formulario_reproduccion.has_changed = true;

          this._setEditMode( false )

          this._$mdToast.show(
            this._$mdToast.simple()
              .textContent('Simple Toast!')
              .position('top right')
              .hideDelay(2000)
          );

      };


    //---
    //METODOS PUBLICOS
    //---

    guardarDatos(){

      //console.log(this.formulario_reproduccion.data.id_caso_reproduccion)
      //console.log(this.formulario_reproduccion.data.id_caso_reproduccion != 0)

      //const id_caso_reproduccion = (this.formulario_reproduccion.data.id_caso_reproduccion != 0)?this.formulario_reproduccion.data.id_caso_reproduccion: 0;
      //this.reproduccion_datos.id_caso_reproduccion = id_caso_reproduccion;

      let reproduccion = {
        reproduccion_encab: angular.copy(this.reproduccion_datos),
        reproduccion_nota: angular.copy(this.widgets.reproduccion_notas.data),
        resultados_obtenidos: angular.copy(this.casoPruebaDataPack.resultados_esperados)
      }



      console.log(reproduccion);

      let caso_reproduccion = this._qaService.guardarReproduccion( reproduccion );

      
      caso_reproduccion.then(
            (caso_reproduccion) => this._actualizarVista( caso_reproduccion ),//this.setViewModelData(val),//this.config_app_params.push(val),
            (err) => console.log(err)
        ); 
        
  

    };


    isLockedOpen(){
      console.log('asd')
      return false;
    }
    
    openMenu($mdMenu, ev) {
      //console.log(this._qaService.setCasoPrueba())
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };



    setReproduccionEstado( id_estado ){
      //const estado = angular.copy(this.widgets.id_sel, {})      

      this._updateFormWidgets( 'reproduccion_estado', id_estado )
    

    }


    hide() {
      console.log('HIDE',this.formulario_reproduccion.has_changed)

      this._$mdDialog.hide( this.formulario_reproduccion.has_changed );

      

    };

    cancel() {
      console.log(this.formulario_reproduccion.has_changed)
      this._$mdDialog.cancel( this.formulario_reproduccion.has_changed );
    };

    procesarForm() {
      var obj = this.obj;
      this._$mdDialog.hide(obj);
    };


    edit(){
      let edit_state = !(this.reproduccion_datos.edit_state)


      if(this.reproduccion_form_data.id_caso_reproduccion === 0){
        this.hide()
      }

      this._setEditMode(edit_state)
    };
    
  }

  QACPReproduccionesForm.$inject = ['reproduccion_form_data', '$mdDialog', '$state', 'qaService', '$mdToast'];
  angular
    .module('lotes.lote')
    .controller('QACPReproduccionesForm', QACPReproduccionesForm);
}());