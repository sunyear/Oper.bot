(function() {
  'use strict';

  class ProcesosCargaMasivaControllerForm {

    constructor($state, procesosMasivosService, $mdToast, $mdMenu, $mdDialog, $filter, $scope, $document, data) {

        this._procesosMasivosService = procesosMasivosService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;
        this._$filter = $filter;
        this._$toast = $mdToast;
        this._$document = $document;
        $scope.files = [];
        this._$scope = $scope;


        this.obj_vista_modelo = {
          cabecera: {
            uid: '',
            id_proceso_masivo: 0,
            tipo_proceso: '',
            fecha_proceso: ''
          },
          detalle: [],
          registro_edit: {
            remito_orig: null,
            lote_orig: null,
            notificada_orig: null,
            zona_orig: null
          }
        }

        this.dataset = data;
        //this.files = [];

        //this.id_carga_masiva_actual = this.dataset.idProcesoMasivo;


       // console.log(data)
        


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
        this.nuevo_proceso_masivo;


        


        this.remito_loteDataPack = [];

        this.cabecera = {
          
        }

        this.lotes_remitos = [

          {
            "items": [],
            "editar": false,
            "editar_index": null,
            "editar_item_nuevo": false,
            "item_visible": null,
          }

        ];


        this.tipos_procesos = {
            0: {
            //txt_estado: 'aceptado',
            class_estado: {
                
                fila_class: ''
              }
            },
            1: {
            //txt_estado: 'rechazado',
            class_estado: {
                
                fila_class: 'tipos_proceso_aceptar'
              }
            },
            2: {
            //txt_estado: 'pendiente',
            class_estado: {
                //text_class: 'estado_cp_string_pendiente',
                fila_class: 'tipos_proceso_calidad'
              }
            
            },
            3: {
              class_estado: {
                fila_class: 'tipos_proceso_no-notificada'
              }
            }
          };

          this.estadisticas = {
            'zona_norte': {
              total: 0,
              aceptar: 0,
              aceptado: 0,
              calidad: 0,
              en_calidad: 0,
              email: 0,
              no_notificadas: 0,
            },
            'zona_sur': {
              total: 0,
              aceptar: 0,
              aceptado: 0,
              calidad: 0,
              en_calidad: 0,
              email: 0,
              no_notificadas: 0,
            }
          }


          this.colr_rech = false; 
          this.colr_proc = false; 
          this.colr_email = false

        this.activate(  );
                        
    }; //FIN CONSTRUCTOR
 

    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    guardar(  ){
      

      if(this.obj_vista_modelo.cabecera.fecha_proceso !== '' && this.obj_vista_modelo.cabecera.id_tipo_proceso !== ''){

        this.obj_vista_modelo.cabecera.uid = (this.obj_vista_modelo.cabecera.id_proceso_masivo === 0)?'I': 'U';

        //console.log(this._$filter('date')(( new Date() ).getTime(), 'HH:mm:ss'))  

        //console.log( this._$filter('date')(this.obj_vista_modelo.cabecera.fecha_proceso, 'yyyy/MM/dd')+ ' ' + this._$filter('date')(( new Date() ).getTime(), 'HH:mm:ss'))
        this.obj_vista_modelo.cabecera.fecha_proceso = this._$filter('date')(this.obj_vista_modelo.cabecera.fecha_proceso, 'yyyy/MM/dd')+ ' ' + this._$filter('date')(( new Date() ).getTime(), 'HH:mm:ss')
        //this.obj_vista_modelo.cabecera.fecha_proceso = this._$filter('date')(this.obj_vista_modelo.cabecera.fecha_proceso, 'yyyy/MM/dd')
       
        //console.log(this.obj_vista_modelo.detalle)

        const rta = this._procesosMasivosService.guardarProcesoMasivo( this.obj_vista_modelo )

        //console.log(rta)

        rta.then(
          (proceso_masivo) => __actualizarVista( this, proceso_masivo.id_proceso_masivo ),
          (err) => console.log(err)
        );

        function __actualizarVista( CLASE, id_proceso_masivo ){

          //console.log(id_proceso_masivo.id_proceso_masivo)

          if(id_proceso_masivo > 0){

            CLASE._$toast.show({
              hideDelay   : 2000,
              position    : 'bottom right',
              parent: CLASE._$document[0].querySelector('#toastContainer'),
              //controller  : 'ToastCtrl',
              templateUrl : './views/procesos/datos_guardados_template.html'
            });

          }


          CLASE.id_carga_masiva_actual = id_proceso_masivo; 

          const carga_desde_db = true;

          CLASE._cargarDatosVista( carga_desde_db );

        };

      }

      //this.reproduccion.etiquetas = this.generarEtiquetas( );
      //this.reproduccion.casos_prueba = angular.copy(this.gridOptions.data);
      //this.reproduccion.id_p_estado_reproduccion = (iniciar_ejecucion)?1:0;

      //console.log(this.reproduccion)
      //let save = this._qaService.guardarProcesoMasivo( this.reproduccion )
      //console.log(casos_prueba)
      /*
      save.then(
          (reproduccion) => null,//console.log(reproduccion),
          (err) => console.log(err)
      );*/

      //this._$mdDialog.hide(this.reproduccion);

      

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
      //this._$mdDialog.hide( null );
      this._$state.go('procesos.carga-masiva', {})
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


    /*
      Funcion que se utiliza para cargar una fila de detalle a)leyendo un CSV / b)completando manualmente los campos
      Los datos que se recuperan desde el backend no pasan por esta funcion. En cambio, mirar el metodo privado _cargarDatosVista
    */
    crearLote( item, es_carga_manual ){

        //console.log(this.lotes_remitos)

        var txt_nuevo = '';

        let item_data = {
          remito: null,
          lote: null,
          actas: null,
          notificada: null,
          zona: null,
          id_tipo_envio: null,
          id_estado_proceso: 0, //0 es pendiente
          id_estado_email: 0, //0 es pendiente
          nota: {
            texto: '',
            editar: false
          },
          colr_rech: false,
          colr_proc: false, 
          colr_email: false,
          indice_no_notificada: 0,
        }
        //console.log(item.indice_no_notificada)
        //$scope.componentes[componente].items.push(txt_nuevo);
        //this.obj_vista_modelo.detalle.push(item_data); //SE INSERTA EL REGISTRO AL FINAL DE LA COLECCION
        this.obj_vista_modelo.detalle.splice(0,0,item_data); //SE INSERTA EL REGISTRO AL INICIO DE LA COLECCION

        var index =  this.obj_vista_modelo.detalle.length-1; // SE USA CON PUSH

        if( typeof(item) === 'object'){


          this.obj_vista_modelo.detalle[0].uid = 'I';
          this.obj_vista_modelo.detalle[0].id_proceso_masivo_detalle = 0;
          this.obj_vista_modelo.detalle[0].remito = item.remito;
          this.obj_vista_modelo.detalle[0].lote = item.lote;
          this.obj_vista_modelo.detalle[0].actas = item.actas;
          this.obj_vista_modelo.detalle[0].notificada = item.notificada;
          this.obj_vista_modelo.detalle[0].zona = item.zona;
          this.obj_vista_modelo.detalle[0].id_tipo_envio = item.id_tipo_envio;
          this.obj_vista_modelo.detalle[0].indice_no_notificada = Math.round(item.indice_no_notificada);


        }

        console.log(this.obj_vista_modelo.detalle)

      /*
        es_carga_manual TRUE/FALSE
        se utiliza para determinar si la fila se carga leyendo el CSV (FALSE) o completando manualmente los campos (TRUE)        
      */
      if(es_carga_manual){
        this.editarItem(index, true)
      }else{
        this.actualizarItem( es_carga_manual, index );
      }
    }

    editarItem( index, nuevo ){
        //console.log($scope.componentes[componente])
        
        //$scope.componentes[componente].items[item]["editar"] = true;

        //this.obj_vista_modelo.detalle[index].

        this.lotes_remitos[0].editar = true;
        this.lotes_remitos[0].editar_index = index;
        
        if(nuevo){
            this.lotes_remitos[0].editar_item_nuevo = true;
        }else{
            this.lotes_remitos[0].editar_item_nuevo = false;
        }
          
        this.obj_vista_modelo.registro_edit.remito_orig = this.obj_vista_modelo.detalle[index].remito;
        this.obj_vista_modelo.registro_edit.lote_orig = this.obj_vista_modelo.detalle[index].lote;
        this.obj_vista_modelo.registro_edit.actas_orig = this.obj_vista_modelo.detalle[index].actas;
        this.obj_vista_modelo.registro_edit.notificada_orig = this.obj_vista_modelo.detalle[index].notificada;
        this.obj_vista_modelo.registro_edit.zona_orig = this.obj_vista_modelo.detalle[index].zona;

          
          
        //this.lotes_remitos[0].items[index].nota.editar = !this.lotes_remitos[0].items[index].nota.editar;
        
        //coreService.focus('focusPrecondicion');
        //console.log(this.lotes_remitos[0])

        /*
        $scope.listas[tabla].item[id_registro]["editar"] = true;
        if(nuevo){
            $scope.listas[tabla]["editar_item_nuevo"] = true;
        }else{
            $scope.listas[tabla]["editar_item_nuevo"] = false;
        }
        */
    }


    /*
    Invocacion: 
              > desde la vista
              > desde el metodo crearLote() de este controlador.
    Input: 
          > es_carga_manual@boolean:  falso = se carga desde forumulario; verdadero = se carga desde archivo csv
          > index@numeric: es el indice correspondiente a la lista de lotes del proceso masivo (para saber que item del listado estoy modificando)
                           -1: cuando se invoca desdde la vista
                           mayor -1: cuando se invoca desde el metodo crearLote()
    */
    actualizarItem( es_carga_manual, index ){
      //console.log(this.obj_vista_modelo.detalle)
      let index_real = null;
      if(es_carga_manual){

        let obj = {
          uid: 'U',
          remito: this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].remito,
          lote: this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].lote,
          actas: this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].actas,
          notificada: this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].notificada,
          zona: this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].zona
        }      

      }

      if(index > -1){
        this.obj_vista_modelo.detalle[index].uid = 'I';
      }else{
        this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].uid = 'U';
      };

      this.lotes_remitos[0].editar_item_nuevo = false;
      this.cancelarEdicionItem(true, false)

        //console.log($scope.caso_prueba.precondiciones[$scope.componentes[componente].editar_index])
        //$scope.caso_prueba.precondiciones[$scope.componentes[componente].editar_index] = $scope.componentes[componente].items[$scope.componentes[componente].editar_index];
        
        //casoPruebaDataPack[componente] = angular.copy($scope.componentes[componente].items);
        //this.remito_loteDataPack[this.lotes_remitos[0].editar_index] = obj;
        //this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].uid = 'U';
        //this.obj_vista_modelo.detalle[index].uid = 'U';
        //console.log(this.lotes_remitos[0].editar_index, index)
        //const index_real = (typeof(index)!== 'undefined')?index:this.lotes_remitos[0].editar_index;
        //this.obj_vista_modelo.detalle[index].uid = 'U';
        
    }

     /*
    Invocacion: 
              > desde la vista
              > desde el metodo actualizarItem() de este controlador.
              > desde el metodo borrarItem() de este controlador
    Input: 
          > desde_actualizar@boolean:  true = quiere decir que es invocado desde actualizarItem; false = es invocado desde la vista o desde borrarItem()
          > borrar_item@boolean:
    */
    cancelarEdicionItem( desde_actualizar, borrar_item ){
    
        if(this.lotes_remitos[0].editar_item_nuevo){
            this.borrarItem( this.lotes_remitos[0].editar_index, true );
        }else if(borrar_item){
            //this.lotes_remitos[0].items[this.lotes_remitos[0].editar_index] = this.remito_loteDataPack[this.lotes_remitos[0].editar_index];
        }

        //Se restaura el registro original cuando se cancela la edicion desde la vista
        if(!desde_actualizar){
          this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].remito = this.obj_vista_modelo.registro_edit.remito_orig;
          this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].lote  = this.obj_vista_modelo.registro_edit.lote_orig;
          this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].actas  = this.obj_vista_modelo.registro_edit.actas_orig;
          this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].notificada  = this.obj_vista_modelo.registro_edit.notificada_orig;
          this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].zona  = this.obj_vista_modelo.registro_edit.zona_orig;
        }

        this.obj_vista_modelo.registro_edit.remito_orig = null;
        this.obj_vista_modelo.registro_edit.lote_orig = null;
        this.obj_vista_modelo.registro_edit.actas_orig = null;
        this.obj_vista_modelo.registro_edit.notificada_orig = null;
        this.obj_vista_modelo.registro_edit.zona_orig = null;

        this.lotes_remitos[0].editar_item_nuevo = false;
        this.lotes_remitos[0].editar_index = null;
        this.lotes_remitos[0].editar = false;
        this._actualizarEstadisticas();

        //if(this.obj_vista_modelo.detalle[index].nota.texto !== '')this.obj_vista_modelo.detalle[index].uid = 'U';
        //this.obj_vista_modelo.detalle[this.lotes_remitos[0].editar_index].nota.editar = false;
        //this.setearCssFila()
        //$scope.componentes[componente].items[$scope.componentes[componente].editar_index] = casoPruebaDataPack.precondiciones[$scope.componentes[componente].editar_index];
    };


    openMenu($mdMenu, ev) {
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };


    leerCSV( contents ){

        console.log(this._$scope.files)
        console.log(this._$scope)

        const es_carga_manual = false;
        const tolerancia_notificada = 80;

        let csv = {
          nombre: contents[0],
          contenido: contents[1].split('\n'),
          actas: 0,
          lote: null,
          remito: null,
          notificada: null,
          zona: null,
          id_tipo_envio: null,
          indice_no_notificada: 0,

        }

        let notificadas_no_notificadas = [];

        csv.actas = (csv.contenido.length)-1;
        csv.lote = csv.contenido[0].split(';')[3];
        csv.remito = csv.contenido[0].split(';')[25];

        for(var i=0; i < csv.contenido.length -1; i++){
          //console.log(csv.contenido[i])

          if(csv.contenido[i] !== ''){
          csv.nro_doc_cond = csv.contenido[i].split(';')[83];
          csv.nombre_cond = csv.contenido[i].split(';')[81];
          csv.nombre_tit = csv.contenido[i].split(';')[74];
          csv.nro_doc_tit = csv.contenido[i].split(';')[76];

          let notificada = ( (csv.nro_doc_tit + csv.nro_doc_cond + csv.nombre_tit + csv.nombre_cond) !== '')?true:false;

          notificadas_no_notificadas.push(notificada);


          }

        }

        //console.log(notificadas_no_notificadas)       
        var c = 0;
        for(var i = 0; i<notificadas_no_notificadas.length; i++){
          

          if(notificadas_no_notificadas[i] === false){
            c++;
          }

        }

        //console.log(((c * 100) / notificadas_no_notificadas.length))

        csv.indice_no_notificada = ((c * 100) / notificadas_no_notificadas.length);

        if(  csv.indice_no_notificada >= tolerancia_notificada  ){
           csv.notificada = 'NO'
           csv.id_tipo_envio = 3;
        }else{
          csv.notificada = 'SI'
          csv.id_tipo_envio = 0;
        }

        if( csv.remito.length === 10){
          csv.zona = (csv.remito.charAt(6) === '2')?'NORTE': 'SUR';
        }else{
          csv.zona = (csv.remito.charAt(0) === '2')?'NORTE': 'SUR';
        }

        //console.log(csv)

        this.crearLote( csv, es_carga_manual );

      return;
    };


    /*
      metodo que se dispara desde el menu de detalle > Tipo Envio
    */
    cambiarTipoEnvio(event, index, id_tipo_envio){

      
      this.obj_vista_modelo.detalle[index].uid = 'U';
      this.obj_vista_modelo.detalle[index].id_tipo_envio = id_tipo_envio;

      this._actualizarEstadisticas();

    };


    emailEnviado( index ){

      this.obj_vista_modelo.detalle[index].uid = 'U';
      this.obj_vista_modelo.detalle[index].colr_email = !this.obj_vista_modelo.detalle[index].colr_email;
      this._actualizarEstadisticas();
      /*
      if(  this.obj_vista_modelo.detalle[index].colr_email === 'norte' ){

        this.estadisticas.zona_norte.email = this.estadisticas.zona_norte.email + 1;

      }else{
        this.estadisticas.zona_sur.email = this.estadisticas.zona_sur.email + 1;
      }
      */

    }


    remitoProcesado( index ){

      this.obj_vista_modelo.detalle[index].uid = 'U';
      this.obj_vista_modelo.detalle[index].colr_rech = false;
      this.obj_vista_modelo.detalle[index].colr_proc = !this.obj_vista_modelo.detalle[index].colr_proc;
      this._actualizarEstadisticas();
      /*
      //computar estadisticas
      if(  this.obj_vista_modelo.detalle[index].zona === 'norte' ){

        if(this.lotes_remitos[0].items[index].id_tipo_proceso === 1){
          //this.estadisticas.zona_norte.aceptado = this.estadisticas.zona_norte.aceptado + 1;      

          this.estadisticas.zona_norte.aceptado = (this.lotes_remitos[0].items[index].colr_proc)?this.estadisticas.zona_norte.aceptado +1:this.estadisticas.zona_norte.aceptado -1;

        }else if(this.lotes_remitos[0].items[index].id_tipo_proceso === 2){
          //this.estadisticas.zona_norte.en_calidad = this.estadisticas.zona_norte.en_calidad + 1;          

          this.estadisticas.zona_norte.en_calidad = (this.lotes_remitos[0].items[index].colr_proc)?this.estadisticas.zona_norte.en_calidad +1:this.estadisticas.zona_norte.en_calidad -1;
        }

      }else{
        
        if(this.lotes_remitos[0].items[index].id_tipo_proceso === 1){
          //this.estadisticas.zona_sur.aceptado = this.estadisticas.zona_sur.aceptado + 1; 


          this.estadisticas.zona_sur.aceptado = (this.lotes_remitos[0].items[index].colr_proc)?this.estadisticas.zona_sur.aceptado +1: this.estadisticas.zona_sur.aceptado -1;         
        }else if(this.lotes_remitos[0].items[index].id_tipo_proceso === 2){
          //this.estadisticas.zona_sur.en_calidad = this.estadisticas.zona_sur.en_calidad + 1;          
          this.estadisticas.zona_sur.en_calidad = (this.lotes_remitos[0].items[index].colr_proc)?this.estadisticas.zona_sur.en_calidad +1: this.estadisticas.zona_sur.en_calidad -1;         
        }

      }*/
    };



    rechazoProcesado( index ){


       this.obj_vista_modelo.detalle[index].colr_proc = false;
       this.obj_vista_modelo.detalle[index].uid = 'U';
       this.obj_vista_modelo.detalle[index].colr_rech = !this.obj_vista_modelo.detalle[index].colr_rech;
       this._actualizarEstadisticas();
       /*
      //computar estadisticas
      if( this.lotes_remitos[0].items[index].zona === 'norte' ){

        if(this.lotes_remitos[0].items[index].id_tipo_proceso === 1){
          //this.estadisticas.zona_norte.aceptado = this.estadisticas.zona_norte.aceptado + 1;          

            this.estadisticas.zona_norte.aceptado = (this.lotes_remitos[0].items[index].colr_proc)?this.estadisticas.zona_norte.aceptado +1: this.estadisticas.zona_norte.aceptado -1;

        }else if(this.lotes_remitos[0].items[index].id_tipo_proceso === 2){
          this.estadisticas.zona_norte.en_calidad = this.estadisticas.zona_norte.en_calidad + 1;          
        }

      }else{
        
        if(this.lotes_remitos[0].items[index].id_tipo_proceso === 1){
          //this.estadisticas.zona_sur.aceptado = this.estadisticas.zona_sur.aceptado + 1;          

          this.estadisticas.zona_sur.aceptado = (this.lotes_remitos[0].items[index].colr_proc)? +1: -1;

        }else if(this.lotes_remitos[0].items[index].id_tipo_proceso === 2){
          this.estadisticas.zona_sur.en_calidad = this.estadisticas.zona_sur.en_calidad + 1;          
        }

      }*/
    };


    editarNota( index ){
      //console.log(this.lotes_remitos[0].items[index])

      //this.lotes_remitos[0].editar = true;
      //this.lotes_remitos[0].editar_index = index;

      //this.setearCssFila( index )

      if(this.obj_vista_modelo.detalle[index].nota.texto !== '')this.obj_vista_modelo.detalle[index].uid = 'U';
      this.obj_vista_modelo.detalle[index].nota.editar = !this.obj_vista_modelo.detalle[index].nota.editar;

    };


    setearCssFila( index ){

      let css_fila = {
        'md_list_item_c_nota': ( this.obj_vista_modelo.detalle[index].nota.texto.length > 0 ),
        'md_list_item_s_nota': ( this.obj_vista_modelo.detalle[index].nota.texto.length <= 0 ),
        'fila_nueva_edicion': ( this.lotes_remitos[0].editar_index !== null && index === this.lotes_remitos[0].editar_index),
        'tipos_proceso_aceptar': ( this.obj_vista_modelo.detalle[index].id_tipo_envio === 1 ),
        'tipos_proceso_calidad': ( this.obj_vista_modelo.detalle[index].id_tipo_envio === 2 ),
        'tipos_proceso_no-notificada': ( this.obj_vista_modelo.detalle[index].id_tipo_envio === 3 )
      };

      return ( css_fila );

    };


    borrarItem( index, nuevo ){

      //console.log(this.lotes_remitos[0].editar_index)

      //this.obj_vista_modelo.detalle.splice(index, 1);

      this.obj_vista_modelo.detalle[index].uid = 'D'
    
      if(!nuevo) this.cancelarEdicionItem(false, false );

    }

    filtrarDetalle( tipo_filtro ){

      this.obj_vista_modelo.detalle = angular.copy(this.dataset.detalle)

      switch ( tipo_filtro ){
        case 1: //NORTE
            
            this.obj_vista_modelo.detalle = this._$filter('filter')(this.obj_vista_modelo.detalle, {zona: 'NORTE'})
          break;
        case 2: //SUR
            this.obj_vista_modelo.detalle = this._$filter('filter')(this.obj_vista_modelo.detalle, {zona: 'SUR'})
          break;
        case 3: //TODOS
            this.obj_vista_modelo.detalle = this.dataset.detalle
          break;

      };

    };


    generarNotificacion (tipo_notificacion, ev) {

        let envio_actas = {}, templateUrl = '';

        //console.log(this.dataset.cabecera)


        switch (this.dataset.cabecera.tipo_proceso){
          case 'REPROCESO': templateUrl = './views/procesos/proc-masivo-gen-notif-reproc-template.html';
            break;
          case 'CARGA MASIVA': templateUrl = './views/procesos/proc-masivo-gen-notif-template.html';
            break;
        };

        switch (tipo_notificacion){
          case 1: envio_actas = this._$filter('filter')(this.dataset.detalle, {id_tipo_envio: '1'}) //<-- ACEPTADAS
            break;
          case 2: envio_actas = this._$filter('filter')(this.dataset.detalle, {id_tipo_envio: '2'}) //<-- CALIDAD
            break;
        };
        

        this._$mdDialog.show({
            controller: 'CargaMasivaGenNotif',
            templateUrl: templateUrl,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: false, // Only for -xs, -sm breakpoints.
            locals: {
                actas_notif: {'tipo_notificacion': tipo_notificacion, 'actas': envio_actas}
            }
        })
        .then(
            function(respuesta_validacion) {
                //console.log($scope.muestra_actas_pdf[index_acta_pdf])
                if(respuesta_validacion === true){
                    //console.log(index_acta_pdf)
                    //$scope.actas_pdf.actas_pdf[index_acta_pdf].estado_validacion = 'aceptada';
                }else{
                    //$scope.actas_pdf.actas_pdf[index_acta_pdf].estado_validacion = 'rechazada';
                }
                //console.log($scope.muestra_actas_pdf);
                //$scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                //$scope.status = 'You cancelled the dialog.';
            }
        );
    };


    //--
    // METODOS PRIVADOS
    //--
    // COMPONENTE: DETALLE DE PROCESO MASIVO
    //--

    activate( ){

      //this.nueva_reproduccion = (typeof(this.reproduccion_data)==='undefined');

      this._cargarDatosVista( false );

    }


    _cargarDatosVista( desde_db ){

      let id_carga_masiva;
      let carga_masiva_db = [];
      
      //if( this.id_carga_masiva_actual !== 0) {
      if(desde_db){

        /*
        const ProcesoCargaMasiva = this;
        let carga_masiva_db = this._procesosMasivosService.obtenerProcesosMasivosLotes( this.dataset.cabecera.id_proceso_masivo )
        //console.log(carga_masiva_db)
        carga_masiva_db.then(
            (carga_masiva_lotes) => _actualizarVista(carga_masiva_lotes, ProcesoCargaMasiva),
            (err) => console.log(err)
        );
        */

        this._$state.go(this._$state.current, {idProcesoMasivo: this.id_carga_masiva_actual }, {reload: true});

      }else if(this.dataset.cabecera.id_proceso_masivo > 0){
        _actualizarVista(this.dataset, this)
      }
        
       //funcion interna 
      function _actualizarVista( carga_masiva_lotes, ProcesoCargaMasiva ){

        //console.log(carga_masiva_lotes.detalle)
        //levanto la informacion en la cabecera
        ProcesoCargaMasiva.obj_vista_modelo.cabecera = carga_masiva_lotes.cabecera;
        //levanto la informacion en el detalle
        ProcesoCargaMasiva.obj_vista_modelo.detalle = carga_masiva_lotes.detalle;
        //actualizo los calculos de la estadistica
        ProcesoCargaMasiva._actualizarEstadisticas();
        //console.log(ProcesoCargaMasiva.estadisticas)
      }

      //$filter('filter')($scope.results.subjects, {grade: 'C'})[0];
      //console.log(this._$filter('filter')(this.dataset.detalle, {zona: 'NORTE'}));

    };


    _actualizarEstadisticas(){

      let c_no_notificadas_norte = 0,
          c_no_notificadas_sur = 0,
          c_zona_sur = 0,
          c_zona_norte = 0,
          c_aceptar_norte = 0,
          c_aceptar_sur = 0,
          c_calidad_norte = 0,
          c_calidad_sur = 0,
          c_email_norte = 0,
          c_email_sur = 0,
          c_en_calidad_norte = 0,
          c_en_calidad_sur = 0,
          c_aceptada_sur = 0,
          c_aceptada_norte = 0;


      for (var i = 0; i < (this.obj_vista_modelo.detalle.length); i++){
        //se calculan las estadisticas para los remitos de zona norte/sur
        if(this.obj_vista_modelo.detalle[i].zona === 'NORTE'){
            c_zona_norte++;
          if(this.obj_vista_modelo.detalle[i].notificada === 'NO'){
            c_no_notificadas_norte++;
          }
          if(this.obj_vista_modelo.detalle[i].colr_email){
            c_email_norte++;
          }
        }else{ //zona sur
          c_zona_sur++;
          if(this.obj_vista_modelo.detalle[i].notificada === 'NO'){
            c_no_notificadas_sur++;           
          }
          
          if(this.obj_vista_modelo.detalle[i].colr_email){
            c_email_sur++;
          }
        }

        //dentro de cada zona, se calculan la cantidad de envios segun tipo: aceptar, calidad
        switch( this.obj_vista_modelo.detalle[i].id_tipo_envio ){
          case 1: //ACEPTAR
            if(this.obj_vista_modelo.detalle[i].zona === 'NORTE'){
              c_aceptar_norte++;
              if(this.obj_vista_modelo.detalle[i].colr_proc || this.obj_vista_modelo.detalle[i].colr_rech){
               c_aceptada_norte++;
              }
            }else{
              c_aceptar_sur++;
              //console.log('aceptar_norte:',this.obj_vista_modelo.detalle[i].colr_proc)
              if(this.obj_vista_modelo.detalle[i].colr_proc || this.obj_vista_modelo.detalle[i].colr_rech){
                c_aceptada_sur++;
              }
            }     
            break;
          case 2: //CALIDAD
            if(this.obj_vista_modelo.detalle[i].zona === 'NORTE'){
              c_calidad_norte++;
              if(this.obj_vista_modelo.detalle[i].colr_proc || this.obj_vista_modelo.detalle[i].colr_rech){
               c_en_calidad_norte++;
              }
            }else{
              c_calidad_sur++;
              if(this.obj_vista_modelo.detalle[i].colr_proc || this.obj_vista_modelo.detalle[i].colr_rech){
               c_en_calidad_sur++;
              }
            }
            break;
        }

      };//FIN FOR

      this.estadisticas.zona_norte.total = c_zona_norte;
      this.estadisticas.zona_sur.total = c_zona_sur;
      this.estadisticas.zona_norte.no_notificadas = c_no_notificadas_norte;
      this.estadisticas.zona_sur.no_notificadas = c_no_notificadas_sur;
      this.estadisticas.zona_norte.aceptar = c_aceptar_norte;
      this.estadisticas.zona_sur.aceptar = c_aceptar_sur;
      this.estadisticas.zona_norte.calidad = c_calidad_norte;
      this.estadisticas.zona_sur.calidad = c_calidad_sur;
      this.estadisticas.zona_norte.email = c_email_norte;
      this.estadisticas.zona_sur.email = c_email_sur;
      this.estadisticas.zona_norte.aceptado = c_aceptada_norte;
      this.estadisticas.zona_sur.aceptado = c_aceptada_sur;
      this.estadisticas.zona_norte.en_calidad = c_en_calidad_norte;
      this.estadisticas.zona_sur.en_calidad = c_en_calidad_sur;
      
    }


    
  }; //FIN CLASE

  ProcesosCargaMasivaControllerForm.$inject = ['$state', 'procesosMasivosService', '$mdToast', '$mdMenu', '$mdDialog', '$filter', '$scope', '$document', 'data'];
  angular
    .module('lotes.lote')
    .controller('ProcesosCargaMasivaControllerForm', ProcesosCargaMasivaControllerForm);
}());