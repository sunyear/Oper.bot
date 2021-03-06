(function() {
  'use strict';

  class ProcesosCargaMasivaControllerForm {

    constructor( $state, procesosMasivosService, $mdToast, $mdMenu, $mdDialog, $filter, $scope, $document, moment, data) {

        this._procesosMasivosService = procesosMasivosService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;
        this._$filter = $filter;
        this._$toast = $mdToast;
        this._$document = $document;
        this._$scope = $scope;
        this.moment = moment;
       
        this.esta_cargando = false;
        this.contador_insercion = 0;

        this.obj_vista_modelo = {
          cabecera: {
            uid: '',
            id_proceso_masivo: 0,
            tipo_proceso: '',
            fecha_proceso: ''
          },
          detalle: [],
          filtro_aplicado: {},
        }

        this.registro_edit = {
            remito_orig: null,
            lote_orig: null,
            notificada_orig: null,
            zona_orig: null
          }

        this.dataset = data; //"data" se instancia en el enrutador (lote.js) que resuelve la promesa (prommise)

        this.fila_seleccionada = null;

        this.filas_seleccionadas = [];
        
        this.gridOptions = {
          data: [],
          urlSync: true
        };
        
        this.gridActions1 = {};
        this.gridActions = {};

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
          this.colr_email = false;

          this.mostrar = false;

          this.filtros = {
            'no_notificada': {
              texto: 'No-notificadas',
              expresion: {notificada: 'NO'},
              activo: false, 
            },
            'notificada': {
              texto: 'notificadas',
              expresion: {notificada: 'SI'},
              activo: false, 
            },
            'calidad': {
              texto: 'Calidad',
              expresion: {id_tipo_envio: 2},
              activo: false,
            },
            'aceptar': {
              texto: 'Aceptar',
              expresion: {id_tipo_envio: 1},
              activo: false,
            },
            'norte': {
              texto: 'zona norte',
              expresion: {zona: 'NORTE'},
              activo: false,
            },
            'sur': {
              texto: 'zona sur',
              expresion: {zona: 'SUR'},
              activo: false,
            }
          };

          this.tooltip_filtrar_visible = false;
                          
                        //console.log(this.filtros.no_notificada)

        this.activate(  );
                        
    }; //FIN CONSTRUCTOR
 

    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: PROCESOS_MASIVOS_DETALLE
    //--


    guardar(  ){
      
      if( (this.obj_vista_modelo.cabecera.fecha_proceso !== '' && this.obj_vista_modelo.cabecera.id_tipo_proceso !== '')){
        // || (this.obj_vista_modelo.cabecera.fecha_proceso !== '' && this.obj_vista_modelo.cabecera.id_tipo_proceso !== '' &&  this.dataset.detalle.length > 0)

       // console.log(this.obj_vista_modelo.cabecera.id_proceso_masivo == 0)

        this.obj_vista_modelo.cabecera.uid = (this.obj_vista_modelo.cabecera.id_proceso_masivo == 0)?'I': 'U';

        
        if(this.obj_vista_modelo.cabecera.id_proceso_masivo === 0){
          //this.obj_vista_modelo.cabecera.fecha_proceso = this._$filter('date')(this.obj_vista_modelo.cabecera.fecha_proceso, 'yyyy/MM/dd')+ ' ' + this._$filter('date')(( new Date() ).getTime(), 'HH:mm:ss')
        }
        
        this.obj_vista_modelo.cabecera.fecha_proceso = moment(moment(this.obj_vista_modelo.cabecera.fecha_proceso).toDate()).format('YYYY-MM-DD'); 
       
        
        console.log(this.obj_vista_modelo)
        let rta = this._procesosMasivosService.guardarProcesoMasivo( this.obj_vista_modelo )

        rta.then(
          (proceso_masivo) => __actualizarVista( this, proceso_masivo.id_proceso_masivo ),
          (err) => console.log(err)
        );

        function __actualizarVista( CLASE, id_proceso_masivo ){

          
          
          if(id_proceso_masivo > 0){
            
             CLASE._$state.go('procesos.carga-masiva-lotes',{idProcesoMasivo: id_proceso_masivo, filtro: ''},{
                // prevent the events onStart and onSuccess from firing
                notify:false,
                // prevent reload of the current state
                reload:false, 
                // replace the last record when changing the params so you don't hit the back button and get old params
                location:'replace', 
                // inherit the current params on the url
                inherit:true
            });
            CLASE.contador_insercion = 0;
            CLASE.obj_vista_modelo.cabecera.id_proceso_masivo = id_proceso_masivo;
            CLASE._$toast.show({
              hideDelay   : 2000,
              position    : 'bottom right',
              parent: CLASE._$document[0].querySelector('#toastContainer'),
              //controller  : 'ToastCtrl',
              templateUrl : './views/procesos/datos_guardados_template.html'
            });

            CLASE._cargarDatosVista( true );
          }
        };

      }//FIN IF

    };


    esFilaSeleccionada( list_item ){

      let list_item_index = list_item.$index;
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);

      return ( (index_find > -1)?true:false )

    };


    cancelarDialogo(){
      //this._$mdDialog.hide( null );
      this._$state.go('procesos.carga-masiva', {})
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
      };


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
       
        this.gridOptions.data.push(obj);
      }

      return 1;
    };


    /*
      Funcion que se utiliza para cargar una fila de detalle a)leyendo un CSV / b)completando manualmente los campos
      Los datos que se recuperan desde el backend no pasan por esta funcion. En cambio, mirar el metodo privado _cargarDatosVista
    */
    _crearLote( item, es_carga_manual ){

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
        es_item_nuevo: true
      }
      
      this.obj_vista_modelo.detalle.splice(0,0,item_data); //SE INSERTA EL REGISTRO AL INICIO DE LA COLECCION
      var index =  this.obj_vista_modelo.detalle.length-1; // SE USA CON PUSH

      if( typeof(item) === 'object'){
        console.log(this.obj_vista_modelo.detalle)
        this.obj_vista_modelo.detalle[0].uid = 'I';
        this.obj_vista_modelo.detalle[0].id_proceso_masivo_detalle = 0;
        this.obj_vista_modelo.detalle[0].remito = item.remito;
        this.obj_vista_modelo.detalle[0].lote = item.lote;
        this.obj_vista_modelo.detalle[0].actas = item.actas;
        this.obj_vista_modelo.detalle[0].notificada = item.notificada;
        this.obj_vista_modelo.detalle[0].zona = item.zona;
        this.obj_vista_modelo.detalle[0].id_tipo_envio = item.id_tipo_envio;
        this.obj_vista_modelo.detalle[0].indice_no_notificada = Math.round(item.indice_no_notificada);
        this.obj_vista_modelo.detalle[0].es_item_nuevo = item.es_item_nuevo;
      }
      
      //es_carga_manual@boolean
      //se utiliza para determinar si la fila se carga leyendo el CSV (FALSE) o completando manualmente los campos (TRUE)        
      if(es_carga_manual){
        this.editarItem(index, true)
      }else{
        console.log(this.obj_vista_modelo.detalle)
        //this.actualizarItem( es_carga_manual, index );
      }
      console.log(this.obj_vista_modelo.detalle)
    };

    /*
      Funcion que se utiliza para cargar una fila de detalle a)leyendo un CSV / b)completando manualmente los campos
      Los datos que se recuperan desde el backend no pasan por esta funcion. En cambio, mirar el metodo privado _cargarDatosVista
    */
     crearLote( item, es_carga_manual ){

      if( typeof(item) === 'object'){

        let item_data = {
          uid: 'I',
          id_proceso_masivo_detalle: 0,
          remito: item.remito,
          lote: item.lote,
          actas: item.actas,
          notificada: item.notificada,
          zona: item.zona,
          id_tipo_envio: item.id_tipo_envio,
          id_estado_proceso: 0, //0 es pendiente
          id_estado_email: 0, //0 es pendiente
          nota: {
            texto: '',
            editar: false
          },
          colr_rech: false,
          colr_proc: false, 
          colr_email: false,
          indice_no_notificada: Math.round(item.indice_no_notificada),
          es_item_nuevo: true
        }
        
        this.obj_vista_modelo.detalle.splice(0,0,item_data); //SE INSERTA EL REGISTRO AL INICIO DE LA COLECCION
        this.contador_insercion ++;

        //es_carga_manual@boolean
        //se utiliza para determinar si la fila se carga leyendo el CSV (FALSE) o completando manualmente los campos (TRUE)        
        if(es_carga_manual){
          var index =  this.obj_vista_modelo.detalle.length-1;
          this.editarItem(index, true)
        }

        console.log(this.obj_vista_modelo.detalle)

        this._actualizarEstadisticas();
      }

    };


    editarItem( index, nuevo ){

        this.lotes_remitos[0].editar = true;
        this.lotes_remitos[0].editar_index = index;
        
        if(nuevo){

            this.lotes_remitos[0].editar_item_nuevo = true;
        }else{
            this.lotes_remitos[0].editar_item_nuevo = false;
        }
          console.log(this.obj_vista_modelo)
        this.obj_vista_modelo.registro_edit.remito_orig = this.obj_vista_modelo.detalle[index].remito;
        this.obj_vista_modelo.registro_edit.lote_orig = this.obj_vista_modelo.detalle[index].lote;
        this.obj_vista_modelo.registro_edit.actas_orig = this.obj_vista_modelo.detalle[index].actas;
        this.obj_vista_modelo.registro_edit.notificada_orig = this.obj_vista_modelo.detalle[index].notificada;
        this.obj_vista_modelo.registro_edit.zona_orig = this.obj_vista_modelo.detalle[index].zona;

    };


    borrarItem( index, nuevo ){

      if(index > -1){
        this.obj_vista_modelo.detalle[index].uid = 'D'
      }else{
        this.filas_seleccionadas.forEach(
          function (fila_seleccionada){
           this.obj_vista_modelo.detalle[fila_seleccionada].uid = 'D'
          }
        ,this);
      };    

    };


    /*
    Invocacion: 
              > desde la vista
              > desde el metodo crearLote() de este controlador.
    Input: 
          > es_carga_manual@boolean:  falso = se carga desde forumulario; verdadero = se carga desde archivo csv
          > index@numeric: es el indice correspondiente a la lista de lotes del proceso masivo (para saber que item del listado estoy modificando)
                           index = -1: cuando se invoca desdde la vista
                           index > -1: cuando se invoca desde el metodo crearLote()
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

    };

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

    };


    openMenu($mdMenu, ev) {
      this.originatorEv = ev;
      $mdMenu.open(ev);
    };


    leerCSV( contents ){

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

      if(index > -1){
        this.obj_vista_modelo.detalle[index].uid = 'U';
        this.obj_vista_modelo.detalle[index].id_tipo_envio = id_tipo_envio;
      }else{
        this.filas_seleccionadas.forEach(
          function (fila_seleccionada){

          this.obj_vista_modelo.detalle[fila_seleccionada].uid = 'U';
          this.obj_vista_modelo.detalle[fila_seleccionada].id_tipo_envio = id_tipo_envio;
          //console.log(this)
          
          }
        ,this);
      };
      
      this._actualizarEstadisticas();
    };


    emailEnviado( index, event ){

      event.stopPropagation();
      
      if(index > -1){
        this.obj_vista_modelo.detalle[index].uid = 'U';
        this.obj_vista_modelo.detalle[index].colr_email = !this.obj_vista_modelo.detalle[index].colr_email;
      }else{
        this.filas_seleccionadas.forEach(
          function (fila_seleccionada){
            this.obj_vista_modelo.detalle[fila_seleccionada].uid = 'U';
            this.obj_vista_modelo.detalle[fila_seleccionada].colr_email = !this.obj_vista_modelo.detalle[fila_seleccionada].colr_email;
          }
        ,this);
      }

      this._actualizarEstadisticas();
    };


    remitoProcesado( index, event ){
      
      event.stopPropagation();

      if(index > -1){
        this.obj_vista_modelo.detalle[index].uid = 'U';
        this.obj_vista_modelo.detalle[index].colr_rech = false;
        this.obj_vista_modelo.detalle[index].colr_proc = !this.obj_vista_modelo.detalle[index].colr_proc;
      }else{
        this.filas_seleccionadas.forEach(
          function (fila_seleccionada){
            this.obj_vista_modelo.detalle[fila_seleccionada].uid = 'U';
            this.obj_vista_modelo.detalle[fila_seleccionada].colr_rech = false;
            this.obj_vista_modelo.detalle[fila_seleccionada].colr_proc = !this.obj_vista_modelo.detalle[fila_seleccionada].colr_proc;
          }
        ,this);
      }
      
      this._actualizarEstadisticas();
    };


    rechazoProcesado( index, event ){

      event.stopPropagation();

      if(index > -1){
        this.obj_vista_modelo.detalle[index].colr_proc = false;
        this.obj_vista_modelo.detalle[index].uid = 'U';
        this.obj_vista_modelo.detalle[index].colr_rech = !this.obj_vista_modelo.detalle[index].colr_rech;
      }else{
        this.filas_seleccionadas.forEach(
          function (fila_seleccionada){
            this.obj_vista_modelo.detalle[fila_seleccionada].colr_proc = false;
            this.obj_vista_modelo.detalle[fila_seleccionada].uid = 'U';
            this.obj_vista_modelo.detalle[fila_seleccionada].colr_rech = !this.obj_vista_modelo.detalle[fila_seleccionada].colr_rech;
          } 
        ,this);
      }
           
      this._actualizarEstadisticas();
    };


    editarNota( index ){
     
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
        'tipos_proceso_no-notificada': ( this.obj_vista_modelo.detalle[index].id_tipo_envio === 3 ),
        'list-item-nuevo': (this.obj_vista_modelo.detalle[index].uid === 'I')
      };

      return ( css_fila );

    };


    filtrarDetalle( tipo_filtro ){

      this.obj_vista_modelo.detalle = this._$filter('filter')(this.obj_vista_modelo.detalle,  tipo_filtro.expresion)
      this.obj_vista_modelo.filtro_aplicado =  tipo_filtro;
      this.tooltip_filtrar_visible = true;

    };


    generarNotificacion (tipo_notificacion, ev) {

        let envio_actas = {}, templateUrl = '';
        this.obj_vista_modelo.cabecera.tipo_proceso

        switch (this.obj_vista_modelo.cabecera.tipo_proceso){
          case 'REPROCESO': templateUrl = './views/procesos/proc-masivo-gen-notif-reproc-template.html';
            break;
          case 'CARGA MASIVA': templateUrl = './views/procesos/proc-masivo-gen-notif-template.html';
            break;
        };

        switch (tipo_notificacion){
          //this.dataset.detalle
          case 1: envio_actas = this._$filter('filter')(this.obj_vista_modelo.detalle, {id_tipo_envio: '1'}) //<-- ACEPTADAS
            break;
          case 2: envio_actas = this._$filter('filter')(this.obj_vista_modelo.detalle, {id_tipo_envio: '2'}) //<-- CALIDAD
            break;
          case 3: envio_actas = this._$filter('filter')(this.obj_vista_modelo.detalle, {id_tipo_envio: '3'}) //<-- NO_NOTIFICADAS
            break;
          case 4: envio_actas = this._$filter('filter')(this.obj_vista_modelo.detalle, {id_tipo_envio: '!3'}) //<-- NOTIFICADAS
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

    recargarVista(){

     this._cargarDatosVista( true );

    };

    esVisible(){
      return this.tooltip_filtrar_visible;
    }

    
    //desde_frontend@boolean > TRUE: cuando el filtro se elimina desde el frontend con el boton "quitar filtro"
    //                       > FALSE: cuando se llama desde el propio controlador (al guardar datos, al recargar la vista, etc)
    eliminarFiltro( desde_frontend = false){

      //let filtro_actual = this.obj_vista_modelo.filtro_aplicado

      this.obj_vista_modelo.filtro_aplicado = {};
      this.tooltip_filtrar_visible = false;
      if(desde_frontend){ this._cargarDatosVista( true )}

      //this.esVisible();

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

        if(this.filas_seleccionadas.length === this.obj_vista_modelo.detalle.length){
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

        angular.forEach(this.obj_vista_modelo.detalle, function(value, index){
          filas_tmp.push(index)
        })
        this.filas_seleccionadas = angular.extend(filas_tmp);

      }else{
        this.filas_seleccionadas = [];
      }

      //console.log(ll)

    };


    seleccionarLote( list_item, event ){

      let list_item_index = list_item.$index;
     
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);
      if(index_find === -1){
        this.filas_seleccionadas.push(list_item_index);  
      }else{
        this.filas_seleccionadas.splice(index_find, 1);
      }

      event.stopPropagation();

    };

    esFilaSeleccionada( list_item ){

      let list_item_index = list_item.$index;
      let index_find = this.filas_seleccionadas.indexOf(list_item_index);

      return ( (index_find > -1)?true:false )

    };


    esFilaNueva( fila ){

      let fila_nueva = false;

      console.log(fila)

      return ( fila_nueva );

    };

    //FIN METODOS PUBLICOS



    //--
    // METODOS PRIVADOS
    //--
    // COMPONENTE: DETALLE DE PROCESO MASIVO
    //--

    activate( ){


     // this.esta_cargando = true;
      this._cargarDatosVista( false );

    };


    //desde_db@boolean
    //TRUE (cuando ya se esta en la vista y se requiere recargarla): se recarga la pagina que vuelve a instanciar el objeto this.dataset (este objeto se instancia desde las rutas (lotes.js) que invoca a un metodo de procesos-masivos-services.js que invoca a la DB)
    //FALSE (cuando se selecciona un proceso masivo desde procesos-carga-masiva-grid-template.html):solo lo usa el metodo activate(), ya que usa los datos que invoco el metodo [lotes.js]procesosMasivosService.obtenerProcesosMasivosLotes( $stateParams.idProcesoMasivo )
    _cargarDatosVista( desde_db ){

      let id_carga_masiva;
      let carga_masiva_db = [];
      let CLASE = this;


      this.esta_cargando = true;
      this.filas_seleccionadas = []; //quito la seleccion de todas las filas.
      this.eliminarFiltro();

      desde_db = true;
      
      if(desde_db){
        //console.log(this._$state.params)
        let id_proceso_masivo_int = (this.obj_vista_modelo.cabecera.id_proceso_masivo > 0)?this.obj_vista_modelo.cabecera.id_proceso_masivo:this._$state.params.idProcesoMasivo;
        let proceso_masivo_lotes_promise = this._procesosMasivosService.obtenerProcesosMasivosLotes(  id_proceso_masivo_int )
        //this.obj_vista_modelo = [];
        //this.obj_vista_modelo = proceso_masivo_lotes
        proceso_masivo_lotes_promise.then(
          (proceso_masivo_lotes) => {
            
            this.obj_vista_modelo = proceso_masivo_lotes; 
            this.obj_vista_modelo.registro_edit = this.registro_edit; 
            this.esta_cargando = false;
            this._actualizarEstadisticas();
          },//_actualizarVista( proceso_masivo_lotes,  CLASE ),
          (err) => console.log(err)
        );
      }else if(this.dataset.cabecera.id_proceso_masivo > 0){
        //_actualizarVista(this.dataset, this)
        //this.obj_vista_modelo = this.dataset;
        //angular.copy(this.dataset, this.obj_vista_modelo.detalle)
        //angular.extend(this.dataset, this.obj_vista_modelo.detalle)
      }
        
       //funcion interna 
      function _actualizarVista( proceso_masivo_lotes, ProcesoCargaMasiva ){

        console.log(proceso_masivo_lotes)

        ProcesoCargaMasiva.obj_vista_modelo.detalle = [];
        //levanto la informacion en la cabecera
        ProcesoCargaMasiva.obj_vista_modelo.cabecera = proceso_masivo_lotes.cabecera;
        //levanto la informacion en el detalle
        //ProcesoCargaMasiva.obj_vista_modelo.detalle = angular.copy(carga_masiva_lotes.detalle)
        //angular.copy(proceso_masivo_lotes.detalle, ProcesoCargaMasiva.obj_vista_modelo.detalle)

        //angular.extend(proceso_masivo_lotes.detalle, ProcesoCargaMasiva.obj_vista_modelo.detalle)
      }

      //actualizo los calculos de la estadistica
      this._actualizarEstadisticas();
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

      }//FIN FOR

      this.estadisticas.zona_norte.total = c_zona_norte;
      this.estadisticas.zona_norte.aceptar = c_aceptar_norte;
      this.estadisticas.zona_norte.calidad = c_calidad_norte;
      this.estadisticas.zona_norte.no_notificadas = c_no_notificadas_norte;
      this.estadisticas.zona_norte.aceptado = c_aceptada_norte;
      this.estadisticas.zona_norte.en_calidad = c_en_calidad_norte;
      this.estadisticas.zona_norte.email = c_email_norte;

      this.estadisticas.zona_sur.total = c_zona_sur;
      this.estadisticas.zona_sur.aceptar = c_aceptar_sur;
      this.estadisticas.zona_sur.calidad = c_calidad_sur;
      this.estadisticas.zona_sur.no_notificadas = c_no_notificadas_sur;
      this.estadisticas.zona_sur.aceptado = c_aceptada_sur;
      this.estadisticas.zona_sur.en_calidad = c_en_calidad_sur;
      this.estadisticas.zona_sur.email = c_email_sur;
      
    };
    
  }; //FIN CLASE

  ProcesosCargaMasivaControllerForm.$inject = ['$state', 'procesosMasivosService', '$mdToast', '$mdMenu', '$mdDialog', '$filter', '$scope', '$document', 'moment', 'data'];
  angular
    .module('lotes.lote')
    .controller('ProcesosCargaMasivaControllerForm', ProcesosCargaMasivaControllerForm);
}());