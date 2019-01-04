(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .controller('ValidadorCecaitraController', ValidadorCecaitraController);
    

        ValidadorCecaitraController.$inject = ['$scope', '$state', '$mdMenu', '$mdDialog', '$mdPanel', '$timeout', 'remitosActasService', 'pdfDelegate', 'moment', 'ESTADOS_LOTES'];
        function ValidadorCecaitraController($scope, $state, $mdMenu,$mdDialog, $mdPanel, $timeout, remitosActasService, pdfDelegate, moment, ESTADOS_LOTES) {

                //var $scope = $scope;//this;

                $scope._mdPanel = $mdPanel;
                $scope.originatorEv = null;
                $scope.is_loading = false;

                $scope.pdfUrl = './assets/10603201.pdf';
                $timeout(function() {
                    pdfDelegate
                    .$getByHandle('my-pdf-container').zoomTo(3);
                  });
                

                $scope.muestra_actas_pdf = [];
                $scope.lotes_validados = [];

                var obj_lote_validado = {
                    metalote: null,
                    estado_lote: null,
                    fecha_validado: null
                };


                $scope.lotes_estados = [
                    {},
                    {
                        "estado": "ACEPTADO",
                        "css_class": "material-icons md-24 green_big",
                        "css_class_big": "material-icons md-36 green_big",
                        "css_font_big": "md-16 green_big",
                        "icon": "verified_user"
                    },
                    {
                        "estado": "RECHAZADO",
                        "css_class": "material-icons md-24 red",
                        "css_class_big": "material-icons md-36 red",
                        "css_font_big": "md-16 red",
                        "icon": "cancel",
                        "errores": {
                            "validaciones": ["ARCHIVOS ADJUNTOS", "FECHA INFRACCION", "FECHA VENCIMIENTO", "TOLERANIA VELOCIDAD"]
                        }
                    },
                    {
                        "estado": "ACEPTADO (con errores)",
                        "css_class": "material-icons md-24 orange600",
                        "css_class_big": "material-icons md-36 orange600",
                        "css_font_big": "md-16 yellow",
                        "icon": "verified_user"
                    }

                ];

                

                  

                $scope.result_template_url = "./views/validaciones/resultados_validacion_template.html";

                $scope.CSV_content = $scope.CSV_filename = '';



                

                $scope.registros_totales = 0;

                $scope.info, $scope.fecha_lote, $scope.fecha_const_calc, $scope.fecha_venc_calc;
                $scope.form_carga_visible = true;
                $scope.result_visible = false;
                $scope.flg_rechazo = false;

                $scope.datos_csv = {};
                $scope.fechas_csv = {
                    fecha_base: null,
                    fechas_validas: false
                };

                $scope.directorio_actas = '';
                $scope.muestreo_automaticas = 0;
                $scope.estado_validacion_acta_pdf = 'sin validar';

                
                $scope.actas_pdf = {
                        "actas_pdf": []
                    }


                var chips = {

                    error: {
                        msg:  'ERROR',
                        class: 'chip-error'
                    },
                    ok: {
                        msg: 'SUPERADO',
                        class: 'chip-ok'
                    },
                    warn: { 
                        msg: 'SUPERADO(con errores)',
                        class: 'chip-warn'
                    }
                }






                $scope.results = {
                   "fecha_constatacion": {
                        id_validacion: 'fecha_constatacion',
                        validacion: 'TEST -> FECHA INFRACCION',
                        indice_errores: 0,
                        tolerancia: 1,
                        errores: [],
                        chips: []

                    },
                    "fecha_vencimiento": {
                        id_validacion: 'fecha_vencimiento',
                        validacion: 'TEST -> FECHA VENCIMIENTO',
                        indice_errores: 0,
                        tolerancia: 0,
                        errores: [],
                        chips: []
                    },
                    "velocidad": {
                        id_validacion: 'velocidad',
                        validacion: 'TEST -> TOLERANCIA VELOCIDAD',
                        indice_errores: 0,
                        tolerancia: 1,
                        errores: [],
                        chips: []
                    },
                    "cod_barras": {
                        id_validacion: 'cod_barras',
                        validacion: 'TEST -> CODIGO DE BARRAS',
                        indice_errores: 0,
                        tolerancia: 0,
                        errores: [],
                        chips: []
                    },
                    "filesystem": {
                        id_validacion: 'filesystem',
                        validacion: 'TEST -> ARCHIVOS ADJUNTOS',
                        indice_errores: 0,
                        tolerancia: 0,
                        errores: [],                        
                        chips: []
                    },
                    "flg_rechazo": false
                    
                };



                //CAMPOS DEL CSV Y SUS POSICIONES
                var POS_FEC_CONST = 27, // FECHA CONSTATACION (fecha infraccion)
                    POS_FEC_VENC = 6,   //FECHA VENCIMIENTO
                    POS_VEL_BASE = 29,  //VELOCIDAD BASE
                    POS_VEL_REG = 30,   //VELOCIDAD REGISTRADA
                    POS_COD_BARRAS = 18; //CODIGO DE BARRAS


                var uf_actual = '40.8',
                    uf_vigencia = '03/10/2018'



                today();
                $scope.fec_const_calc = {};

                activate();


                //---
                //API PUBLICA
                //---

                $scope.leerCSV = leerCSV;
                $scope.procesarLote = procesarLote;
                $scope.calcularFechas = calcularFechas;
                $scope.mostrarDetalles = mostrarDetalles;
                $scope.abrirActaPDF = abrirActaPDF;
                $scope.getNombreArchivoPDF = getNombreArchivoPDF;
                $scope.refresh = refresh;
                $scope.obtenerLotesValidados = obtenerLotesValidados;
                $scope.guardarLoteValidado = guardarLoteValidado;
                $scope.openMenu = openMenu;
                $scope.cancelar = limpiarFormulario;

                //---
                //METODOS PUBLICOS
                //---


                function openMenu($mdMenu, ev) {
                  $scope.originatorEv = ev;
                  $mdMenu.open(ev);
                };
                

                function leerCSV( contents ){

                    //console.log(contents)

                        $scope.datos_csv.CSV_filename = contents[0];
                        $scope.datos_csv.CSV_content = contents[1].split('\n');//contents[1];
                        $scope.datos_csv.registros_totales = ($scope.datos_csv.CSV_content.length)-1;//10//(aFile.length) -1;
                        
                        $scope.datos_csv.numero_acta_min = $scope.datos_csv.CSV_content[0].split(';')[0];
                        $scope.datos_csv.numero_acta_max = $scope.datos_csv.CSV_content[$scope.datos_csv.registros_totales-1].split(';')[0]

                        $scope.datos_csv.fecha_emision = $scope.datos_csv.CSV_content[0].split(';')[5];
                        $scope.datos_csv.uf_emision = $scope.datos_csv.CSV_content[0].split(';')[7];


                        if( parseFloat($scope.datos_csv.uf_emision) !== parseFloat(uf_actual) ){
                            console.log('ads')
                            let event = null;
                            $scope.showAlert(event);
                        }



                        var tmp = $scope.datos_csv.CSV_filename.split('_');
                        $scope.datos_csv.nro_lote = parseInt(tmp[1]);
                        $scope.datos_csv.strLote = "Lote" + $scope.datos_csv.nro_lote;

                        //var aFile = $scope.datos_csv.CSV_content.split('\n');
                        
                        //aFile = '';//dummy
                        $scope.datos_csv.mostrar_detalles = false;
                        
                        $scope.btn_procesar_disabled = false;

                        remitosActasService
                            .getArchivosDirectorio( {"dir_lote": $scope.datos_csv.strLote } )
                            .then(
                                function procesarResult( resultados ){
                                    //console.log(resultados.length)
                                    $scope.datos_csv.archivos_fs = resultados.length-1;
                                    generarMuestraAleatoriaActas();
                                    return resultados;
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('controller', notif)
                                }
                            )






                            
                        return;
                };


                function mostrarDetalles(){
                    console.log($scope.datos_csv.mostrar_detalles)

                    $scope.datos_csv.mostrar_detalles = !$scope.datos_csv.mostrar_detalles;

                   return $scope.datos_csv.CSV_content;

                };


                function procesarLote( $event ){

                        var cRegistros = 10;
                        var aFile = [];
                        
                        //Genero un array; cada elemento corresponde a un registro del archivo CSV
                        //aFile = $scope.datos_csv.CSV_content.split('\n');
                        cRegistros = 10;//(aFile.length) -1;
                        //$scope.datos_csv.registros_totales = cRegistros;
                        for(var i=0; i<$scope.datos_csv.registros_totales; i++){
                                $scope.exito = validarRegistro($scope.datos_csv.CSV_content[i]);
                        };

                        $scope.exito = validarArchivosFileSystem( );


                        var arr = {
                                'err_tol_vel':$scope.cant_err_tol_vel,
                                'err_fec_venc': $scope.cant_err_fec_venc,
                                'err_fec_const': $scope.cant_err_fec_const,
                                'cant_err_cod_bar': $scope.cant_err_cod_bar
                        }

                        //console.log(arr);

                        //var cant_err = $scope.cant_err_tol_vel + $scope.cant_err_fec_venc + $scope.cant_err_fec_const + $scope.cant_err_cod_bar;

                        //if(cant_err > 0){
                                //procesarErrores();
                        //}

                        //console.log($scope.results)

                        procesarErrores();
                        guardarLoteValidado();
                        $scope.showAdvanced(event);

                        //formCargaVisible(false);

                        //resultVisible(true);
                        //vm.mostrar_resultados = true;

                        //vm.open();

                };


                function calcularFechas(){

                        $scope.fechas_csv.fecha_lote = moment($scope.fechas_csv.fecha_base);//new Date($scope.fechas_csv.fecha_base)

                        if($scope.fechas_csv.fecha_lote.isValid()){
                            $scope.fechas_csv.fecha_const_calc = moment(moment($scope.fechas_csv.fecha_lote, 'YYYYMMDD').subtract(60, 'days').toDate()).format('YYYY-MM-DD');
                            $scope.fechas_csv.fecha_venc_calc = moment(moment($scope.fechas_csv.fecha_lote).add(45, 'days').toDate()).format('YYYY-MM-DD');    
                        }
                        
                        //console.log($scope.fechas_csv.fecha_lote);
                        //$scope.fechas_csv.fechas_validas = (moment($scope.fechas_csv.fecha_const_calc).isValid() && moment($scope.fechas_csv.fecha_venc_calc).isValid());
                        //$scope.fechas_csv.fechas_validas = $scope.fechas_csv.fecha_const_calc.isValid() && $scope.fechas_csv.fecha_venc_calc.isValid();

                        

                };


                $scope.showAdvanced = function(ev) {
                    $mdDialog.show({
                        controller: 'ValidadorCecaitraModalController',
                        templateUrl: './views/validaciones/validador-cecaitra-modal-template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:false,
                        fullscreen: false, // Only for -xs, -sm breakpoints.
                        locals: {
                            resultados: $scope.results
                        }
                    })
                    .then(
                        function(answer) {
                            //$scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                            //FLUJO BOTON ACEPTAR VENTANA MODAL DE RESOLUTADOS
                            //limpio formulario y vuelvo al principio

                            limpiarFormulario();

                            //$scope.status = 'You cancelled the dialog.';
                            //console.log('qwe')
                        }
                    );
                };


                $scope.abrirValidarActaPDF = function(index_acta_pdf, ev) {
                    $mdDialog.show({
                        controller: 'VisorPDFModalController',
                        templateUrl: './views/validaciones/visorpdf-modal-template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:false,
                        fullscreen: false, // Only for -xs, -sm breakpoints.
                        locals: {
                            acta_pdf: $scope.actas_pdf.actas_pdf[index_acta_pdf]
                        }
                    })
                    .then(
                        function(respuesta_validacion) {
                            //console.log($scope.muestra_actas_pdf[index_acta_pdf])
                            if(respuesta_validacion === true){
                                //console.log(index_acta_pdf)
                                $scope.actas_pdf.actas_pdf[index_acta_pdf].estado_validacion = 'aceptada';
                            }else{
                                $scope.actas_pdf.actas_pdf[index_acta_pdf].estado_validacion = 'rechazada';
                            }
                            //console.log($scope.muestra_actas_pdf);
                            //$scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                            $scope.status = 'You cancelled the dialog.';
                        }
                    );
                };


                function abrirActaPDF( index_acta_pdf, event ){
                    
                    $scope.abrirValidarActaPDF(index_acta_pdf, event);
                };


                function getNombreArchivoPDF( acta_pdf ){
                    return ( acta_pdf.acta_pdf.substr((acta_pdf.acta_pdf.lastIndexOf('/'))+1) );
                }


                //---
                //METODOS PRIVADOS
                //-----

                function activate(){
                    $scope.is_loading = true;
                    obtenerLotesValidados();
                    return;
                }

                function obtenerLotesValidados($eventclick){
                    //console.log($eventclick)
                    remitosActasService
                        .obtenerLotesValidados(  )
                        .then(
                            function procesarResult( resultados ){
                                console.log(resultados)
                                
                                $scope.lotes_validados = resultados;
                                $scope.is_loading = false;
                                //return resultados;
                            },
                            function fail(){},
                            function notificar(notif){
                                console.log('controller', notif)
                            }
                        )
                }


                $scope.showAlert = function(ev) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application
                    // to prevent interaction outside of dialog
                    let textContent = 'El valor UF ACTUAL difiere del valor UF CSV' + '<br>';
                        textContent += 'UF vigencia: desde ' + uf_vigencia + '<br>';
                        textContent += 'UF actual: ' + uf_actual + '<br>';
                        textContent += 'UF CSV: ' + $scope.datos_csv.uf_emision;

                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('UF error!')
                        .htmlContent(textContent)
                        .ariaLabel('UF error')
                        .ok('Aceptar')
                        .targetEvent(ev)
                    );
                };


                function generarMuestraAleatoriaActas(){

                    remitosActasService
                        .getParamsActasPDF( )
                        .then(
                            function procesarResultados( params_actas_pdf ){
                                //console.log(params_actas_pdf)
                                //var url = datos+$scope.datos_csv.strLote+'/'+acta_pdf;
                                $scope.archivos_validar_automaticas = params_actas_pdf.archivos_validar_automaticas;
                                $scope.muestreo_automaticas = params_actas_pdf.muestreo_automaticas;
                                //se seleccionaran 3 actas aleatoriamente
                                //$scope.url_acta_pdf += url;
                                //console.log(params_actas_pdf)
                            },
                            function fail(){},
                            function notificar( notif ){
                                //console.log('controller', notif)
                            }
                        )



                    $timeout(
                        function generarMuestraActas() {
                            if($scope.archivos_validar_automaticas !== ''){
                                for (var i=0;i<$scope.muestreo_automaticas;i++){
                                    //calcular el indice dentro del array de actas
                                    var arr_rnd_index = Math.floor((Math.random() * $scope.datos_csv.registros_totales-1) + 0);
                                    var numero_acta = $scope.datos_csv.CSV_content[arr_rnd_index].split(';')[0];
                                    var nombre_archivo_pdf = numero_acta + '.pdf';
                                    var numero_notificacion = $scope.datos_csv.CSV_content[arr_rnd_index].split(';')[4];


                                    var acta_pdf =  {
                                        "fullpath": $scope.archivos_validar_automaticas + $scope.datos_csv.strLote + '/' + $scope.datos_csv.strLote + '/' + nombre_archivo_pdf,
                                        "nombre_archivo": nombre_archivo_pdf,
                                        "numero_acta": numero_acta,
                                        "numero_notificacion": numero_notificacion,
                                        "estado_validacion": 'sin validar'
                                    }
                                    
                                    $scope.actas_pdf.actas_pdf.push( acta_pdf );
                                    
                                }
                                
                                if($scope.actas_pdf.actas_pdf.length > 0){
                                    $timeout(function() {
                                        publicarActasPDF();
                                      },10);

                                }else{

                                }
                            }
                        }, 
                        10
                    );
                    
                    

                    //console.log($scope.muestra_actas_pdf);
                };


                function publicarActasPDF(){


                                
                    remitosActasService
                        .publicarActasPDF( $scope.actas_pdf )
                        .then(
                            function procesarResultados( datos ){
                                //console.log(datos)
                            },
                            function fail(){},
                            function notificar(){}
                        )
                };


                function refresh(){
                    $scope.actas_pdf.actas_pdf = [];
                    generarMuestraAleatoriaActas()
                }
                    


                function validarRegistro( registro ){

                        var aRegistro = registro.split(';');

                        var id_acta = aRegistro[0];
                        var fec_venc = moment(aRegistro[POS_FEC_VENC], 'YYYYMMDD');
                        var fec_const = moment(aRegistro[POS_FEC_CONST], 'YYYYMMDD');
                        var vel_base = aRegistro[POS_VEL_BASE];
                        var vel_reg = aRegistro[POS_VEL_REG];
                        var cod_barras = aRegistro[POS_COD_BARRAS];

                        $scope.reg_actual = id_acta;

                        //console.log(fec_const)

                        $scope.exito = validarFechaConstatacion( fec_const );

                        //if(vm.exito){
                        $scope.exito = validarFechaVencimiento( fec_venc );
                        //}

                        //if(vm.exito){
                        $scope.exito = validarToleranciaVelocidad( vel_base, vel_reg );
                        //}

                        //if(vm.exito){
                        $scope.exito = validarCodBarras( cod_barras, fec_venc );


                        
                        //}

                        return ( $scope.exito );
                };



                //---
                //fec_const: fecha de imposicion del correo (dia en que fueron procesadas por el Correo Argentino)
                //
                //REGLA DE NEGOCIO: FECHA CONSTATACION (fecha informada en el CSV) > FECHA CALCULADA ( (fecha del lote + 5 dias habiles) - 60 dias)  
                //---
                function validarFechaConstatacion( fec_const ){

                        var fec_const_valida = false;
                        //vm.info = $filter('date')(fec_const, 'yyyy-MM-dd');;

                        //Creo un "momento" a partir de la fecha de constatacion (VIENE DEL CSV)
                        //var m_fec_const = moment(fec_const, 'YYYY-MM-DD');
                        //var fecha_calculada = moment(vm.fecha_lote, 'YYYYMMDD').subtract(60, 'days').toDate();
                        //isAfter() -> devuelve TRUE si m_fec_const > vm.proc
                        fec_const_valida = fec_const.isAfter($scope.fechas_csv.fecha_const_calc);

                        var reg = {

                        }
                        
                        //console.log(fec_const, moment($scope.fechas_csv.fecha_const_calc))

                        if(!fec_const_valida){
                                var reg = {
                                        'nroActa': $scope.reg_actual,
                                        'fec_const': fec_const,
                                        'calc': $scope.fechas_csv.fecha_const_calc
                                }
                                //console.log(reg)
                                //$scope.err_fec_const_arr.push(reg);
                                $scope.results.fecha_constatacion.errores.push(reg);
                                //$scope.results.fecha_constatacion.chips.push({nombre: 'ERROR'});
                                //$scope.results.fecha_constatacicant_err_fec_const++;
                                //$scope.results.fecha_constatacion = $scope.err_fec_const_arr;
                        }


                        return ( fec_const_valida );
                };


                //---
                //fec_venc: fecha de vencimiento
                //
                //REGLA DE NEGOCIO: FECHA VENCIMIENTO (fecha informada en el CSV) > FECHA CALCULADA ( (fecha del lote + 1 dias habil) + 45 dias) 
                //---
                function validarFechaVencimiento( fec_venc ){

                        var fec_venc_valida = false;
                        var m_fec_venc, fecha_calculada = '';

                        //m_fec_venc = moment(fec_venc, 'YYYYMMDD');

                        fec_venc_valida = fec_venc.isAfter($scope.fechas_csv.fecha_venc_calc);

                        if(!fec_venc_valida){

                                var reg = {
                                        'nroActa': $scope.reg_actual,
                                        'fec_venc': fec_venc,
                                }
                                $scope.results.fecha_vencimiento.errores.push(reg);
                                //$scope.err_fec_venc_arr.push(reg);
                                //$scope.results.fecha_vencimiento[$scope.cant_err_fec_venc] = reg;
                                ///$scope.cant_err_fec_venc++
                                //$scope.results.fecha_vencimiento = $scope.err_fec_venc_arr;
                        }

                        return ( fec_venc_valida );
                }


                //---
                //vel_base: limite de velocidad; vel_reg: velocidad registrada
                //
                //REGLA DE NEGOCIO: CRITERIOS DE TOLERANCIA SEGUN RATIFICAION DE LA AGENCIA PROVINCIAL DE SEGURIDAD VIAL
                //---
                function validarToleranciaVelocidad( vel_base, vel_reg  ){

                        var exito = true;

                        var index = vel_base * 1; //parsear a INT

                        var vel_reg_cmp = parseFloat(vel_reg);

                        //console.log(vel_base * 1)

                        var objVelocidadesTolerancia = {
                                130:134,
                                120:124,
                                110: 114,
                                100:103,
                                90:95,
                                80:85,
                                70:74,
                                60:67
                        };

                        var tolerancia = objVelocidadesTolerancia[index];
                        //console.log(vel_reg.valueOf())

                        exito = !(vel_reg_cmp <= tolerancia);

                        if(!exito){
                                var reg = {
                                        'nroActa': $scope.reg_actual,
                                        'vel_reg': vel_reg,
                                        'vel_base': vel_base
                                }
                                $scope.results.velocidad.errores.push(reg);
                                //$scope.err_vel_tol_arr.push(reg);
                                //$scope.results.velocidad[$scope.cant_err_tol_vel] = reg;
                                //$scope.cant_err_tol_vel++;
                                //$scope.results.velocidad = $scope.err_vel_tol_arr;
                        }

                        return ( exito );

                };


                //---
                //cod_barras: el codigo de barras; fec_venc: fecha de vencimiento
                //
                //REGLA DE NEGOCIO: SE VALIDA QUE LA FECHA DE VENCIMIENTO ESTE INCLUIDA EN EL CODIGO DE BARRAS
                //---
                function validarCodBarras( cod_barras, fec_venc ){

                        var encontrado = true;

                        encontrado = (cod_barras.indexOf(fec_venc.format('YYYYMMDD')) != -1)?true:false;
                        //console.log(cod_barras, fec_venc.format('YYYYMMDD'))

                        if(!encontrado){
                                var reg = {
                                        'nroActa': $scope.reg_actual,
                                        'cod_barras': cod_barras,
                                        'fec_venc': fec_venc
                                }
                                $scope.results.cod_barras.errores.push(reg);
                                //$scope.err_cod_bar_arr.push(reg);
                                //$scope.results.cod_barras[$scope.cant_err_cod_bar] = reg;
                                //$scope.cant_err_cod_bar++;
                                //$scope.results.cod_barras = $scope.err_cod_bar_arr;
                        }

                        return ( encontrado );

                };



                function validarArchivosFileSystem( ){

                    var exito = ( parseInt(($scope.datos_csv.registros_totales * 3)) == parseInt($scope.datos_csv.archivos_fs) );

                    if(!exito){
                        $scope.results.filesystem.errores.push(false);
                    }

                    //console.log($scope.datos_csv.archivos_fs, $scope.datos_csv.registros_totales)
                    //console.log(exito)
                    return exito;
                };



                //----
                //
                //
                //
                //-----

                function guardarLoteValidado(){

                    var lote_validado = {
                        id_lote: null,
                        nro_lote: $scope.datos_csv.nro_lote,
                        nro_registros: $scope.datos_csv.registros_totales,
                        fecha_lote: $scope.datos_csv.fecha_emision,
                        fecha_validado: '20180201',
                        nombre_archivo_csv: $scope.datos_csv.CSV_filename,
                        id_proceso: 100,
                        id_estado_lote: 1
                    };

                    //console.log($scope.datos_csv)

                    remitosActasService
                        .guardarLoteValidado( lote_validado )
                        .then(
                            function procesarResultados( salida ){
                                console.log(salida)
                            },
                            function fail(){},
                            function notificar( notif ){
                                //console.log('controller', notif)
                            }
                        );

                };



                //----
                //
                // FECHA CONSTATACION: 1% tolerancia error -> porc_err_fec_const
                // FECHA VENCIMIENTO: tolerancia 0 -> porc_err_fec_venc
                // FECHA VENCIMIENTO (en codigo barras): tolerancia 0 -> porc_err_cod_bar
                // TOLERANCIA VELOCIDAD: 1% de tolerancia -> porc_err_tol_vel
                //
                //----
                function procesarErrores(){

                        /*
                        var porc_err_fec_venc = (($scope.results.fecha_vencimiento.errores.length) * 100 / $scope.datos_csv.registros_totales);
                        var porc_err_fec_const = ( ( ($scope.results.fecha_constatacion.errores.length) * 100) / $scope.datos_csv.registros_totales);
                        var porc_err_cod_bar = ($scope.results.cod_barras.length * 100 / $scope.datos_csv.registros_totales);
                        var porc_err_tol_vel = ($scope.results.velocidad.errores.length * 100 / $scope.datos_csv.registros_totales);
                        var porc_err_filesystem = ($scope.results.filesystem.errores.length * 100 / $scope.datos_csv.registros_totales).toPrecision(3);
                        */

                        for(var key in $scope.results){
                            //console.log($scope.results[key])

                            if(key != 'flg_rechazo'){
                                
                                var porc_err = (($scope.results[key].errores.length) * 100 / $scope.datos_csv.registros_totales);
                                $scope.results[key].indice_errores = porc_err; 

                                //if(key != 'filesystem'){

                                    if( (porc_err > $scope.results[key].tolerancia)){
                                        $scope.results[key].chips.push(chips.error);
                                        $scope.results.flg_rechazo = true;
                                    }else if(($scope.results[key].errores.length)>0){
                                        $scope.results[key].chips.push(chips.warn);
                                    }else{ 
                                        $scope.results[key].chips.push(chips.ok);
                                    }

                            }

                        }

                        //$scope.results.flg_rechazo = $scope.flg_rechazo;
                           // return $scope.txt_button = 'RECHAZAR LOTE';
                        

                };


                function formCargaVisible( visible ){
                  $scope.form_carga_visible = visible;
                };

                function resultVisible( visible ){

                  $scope.result_visible = visible;

                };


                $scope.selected = {
                  //item: $scope.items[0]
                };

                function today() {
                  $scope.dt = new Date();
                  calcularFechas();
                };


                function limpiarFormulario(){

                    $state.reload();

                };
               

                    //onsole.log(LOTE_ESTADOS[id_lote_estado])
        };//FIN CONTROLLER


})();

