(function() {
  'use strict';

  class QACasoPruebaReporte {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope, coreService, data) {
        
        //this.reproduccion_caso_prueba = reproduccion_caso_prueba;
        this._coreService = coreService;
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;
        this._$scope = $scope;

        this.caso_prueba = data;


        this.reporte = {

          id_reporte: 0,
          id_caso_prueba: 0,
          id_reproduccion: 0,
          titulo: '',
          descripcion: '',
          casos_uso: [],
          palabras_clave: [],
          archivos_adjuntos: []

        }





        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];

        this.tipos_archivos = {

          captura_pantalla: [          'JPG',          'PNG',          'GIF',          'JPEG'          ],
          datos: ['CSV']

        };


        
        this.cp_null_descr = '';

        this.archivos_adjuntos = [];


        this.archivo_modelo = {
              nombre: '',
              nombre_completo: '',
              tipo: '',
              contenido: ''
            };

        this.componentes = {
                    "titulo": '',
                    "id_estado_caso": 2,
                    "precondiciones": {
                        "items": '',//JSON.parse(JSON.stringify(casoPruebaDataPack.precondiciones)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    },
                    "pasos": {
                        "items": '',//JSON.parse(JSON.stringify(casoPruebaDataPack.pasos)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    },
                    "resultados_esperados": {
                        "items": '',//JSON.parse(JSON.stringify(casoPruebaDataPack.resultados_esperados)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    },
                    descripcion: {
                        texto: null || this.cp_null_descr,
                        editar: false,
                        max_char: 150,
                        left_chars: 0
                    }

                }

        this.tags = {
          "casos_uso": [],
          "palabras_clave": []
        };
    
        this.originatorEv = null;

        this.id_caso_reproduccion_sel = 0;
        this.id_caso_prueba_reportar = null;

        this.gridOptions = {
          data: [],
          urlSync: true
        };

        //console.log(this.gridOptions)

        

       


       
       $scope.$watch('componentes.descripcion.texto', function(newValue, oldValue) {
                    this._calcularCaracteresDisponibles();
                    if(this.componentes.descripcion.left_chars === -1){
                        this.componentes.descripcion.texto = oldValue;
                        return oldValue;
                    }
                }.bind(this));
        

        //console.log(this.widgets.reproduccion_estado[1].icon_class)

        
        this.activate();
     
                        
    }; //FIN CONSTRUCTOR
 
    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    guardarReporte(  ){

      console.log(this.caso_prueba)

      let  reporte = {

                id_reporte: 0,
                id_reproduccion: this.caso_prueba.id_reproduccion,
                id_reproduccion_caso_prueba: this.caso_prueba.id_reproduccion_caso_prueba,
                titulo: this.reporte.titulo,
                descripcion: this.reporte.descripcion,
                casos_uso: [],
                palabras_clave: [],
                archivos_adjuntos: []
            };


      let save = this._qaService.guardarReporte( reporte )
      //console.log(casos_prueba)
      save.then(
          (reporte) => null,
          (err) => console.log(err)
      );


    };


    leerArchivo( contenido ){
      console.log(contenido)

      if( contenido.length > 0 ){
        this.archivo_modelo.nombre = contenido[0];
        this.archivo_modelo.contenido = contenido[1];
        this.archivo_modelo.tipo = this._determinarTipoArchivo( this.archivo_modelo );
        this.archivos_adjuntos.push( angular.copy( this.archivo_modelo ) );
      }

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



    editarDescripcion(){

                    this.componentes.descripcion.editar = true;
                    if(this.componentes.descripcion.texto === this.cp_null_descr){
                        this.componentes.descripcion.texto = '';
                    }
                    this._calcularCaracteresDisponibles();
                    this._coreService.focus('focusMe');

                }

    setAlignDescr( ){
        var layout_align = '';

        if(this.componentes.descripcion.texto === this.cp_null_descr){
            layout_align = 'center center';
        }

        return ( layout_align );
    }


    setCssClassDescr( ){

        var css;

        if(this.componentes.descripcion.texto === this.cp_null_descr){
            css = 'cp-descr-null';
        }else{
            css = 'cp-descr-not-null';
        }

        //console.log(css)

        return ( css );
    }


    _calcularCaracteresDisponibles( event ){
                    
                   // if($scope.componentes.descripcion.hasOwnProperty('texto')){
                        //console.log($scope.componentes.descripcion)
                        var c_caracteres = this.componentes.descripcion.texto.length;
                        var disponible = parseInt(this.componentes.descripcion.max_char) - parseInt(c_caracteres);
                        this.componentes.descripcion.left_chars = disponible;

                    //}
                    

                    //console.log(c_caracteres)
                }



      _determinarTipoArchivo( archivo ){

        //let archivo_local = archivo;

        let es_tipo_imagen = false,
            es_tipo_dato = false;


        //archivo.nombre_completo = archivo.nombre.slice(0, archivo.nombre.indexOf('.') );
        //archivo.tipo = archivo.nombre.substr( archivo.nombre.indexOf('.')+1 ).toUpperCase();

        console.log(

          this.tipos_archivos.captura_pantalla.findIndex( 
            function ( tipo_archivo ){
             return (tipo_archivo === archivo.tipo);
            }
          ),
          this.tipos_archivos.datos.findIndex( 
            function ( tipo_archivo ){
             return (tipo_archivo === archivo.tipo);
            }
          )

        );

        console.log(archivo)

        return ( archivo.nombre.substr( archivo.nombre.indexOf('.')+1 ).toUpperCase() );


      };


      cancelarDialogo(){
        this._$mdDialog.hide('asd');
      };

    
    //--
    // METODOS PRIVADOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--

    activate(){

      let controller_obj = this;
      let reproduccion = {etiquetas: []};


      this.tags.palabras_clave = angular.copy(
                                  reproduccion.etiquetas.map(
                                    function ( etiqueta ) {
                                      return  (etiqueta.titulo)
                                    })
                                );

      
     // this._cargarReproducciones( controller_obj );

     //console.log(this.reproducciones);

     // console.log(this.reproducciones)
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





    
  }; //FIN CLASE



  QACasoPruebaReporte.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope','coreService', 'data'];
  angular
    .module('lotes.lote')
    .controller('QACasoPruebaReporte', QACasoPruebaReporte);
}());