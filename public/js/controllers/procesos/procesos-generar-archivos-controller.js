(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('ProcesosGenerarArchivosController', ProcesosGenerarArchivosController);
        
        ProcesosGenerarArchivosController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'remitosActasService','PROCESOS'];
        function ProcesosGenerarArchivosController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, remitosActasService, PROCESOS) {
                
                $scope.params = {};
                $scope.tipo_acta_sel;
                $scope.archivos_salida = {};
                $scope.items = {};
                $scope.f_actas={};
                $scope.actas = {};
                $scope.resultados_genera_remito = [];
                $scope.lst_archivos = {};
                $scope.codigos_barras = {};
                $scope.datos_csv = {};
                $scope.data = {
                    modo_carga: {},
                    id_remito: null,
                    lote: null
                };

                var pkg_actas = {
                    header: {},
                    data: {}
                }

               activate();
                
                //***
                // API PUBLICA
                //***

                $scope.selTiposActas = selTiposActas;
                $scope.generarActas = generarActas;
                $scope.selLstArchivos = selLstArchivos;
                $scope.leerCSV = leerCSV;
                //$scope.activate = activate;

                
                //METODOS PUBLICOS


                $scope.showAdvanced = function(ev) {
                    $mdDialog.show({
                        controller: 'GenDocumentosModalController',
                        templateUrl: './views/generar-documentos-modal.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:false,
                        fullscreen: false, // Only for -xs, -sm breakpoints.
                        locals: {
                            resultados: $scope.resultados_genera_remito,
                            dir_salida: $scope.params.archivos_generados_directorio +'Lote' + $scope.datos_csv.numero_lote
                        }
                    })
                    .then(
                        function(answer) {
                            $scope.status = 'You said the information was "' + answer + '".';
                            limpiarFormulario();
                        }, function() {
                            $scope.status = 'You cancelled the dialog.';
                            limpiarFormulario();
                        }
                    );
                };


                function selLstArchivos(archivo){

                    if(archivo.nombre === 'DOCUMENTACION_ADJUNTA'){
                        console.log('ads')
                    }

                }

                function selTiposActas(){
                    
                    if( $scope.items.selectedItem !== undefined){
                        return ($scope.items.selectedItem.tipo_acta)
                    }else{
                        return "Seleccionar tipos de actas";
                    }

                };

                function generarActas( event ){

                    

                    if($scope.data.modo_carga == 'form'){
                         $scope.f_actas.r_acta_desde = ($scope.items.selectedItem.id_remito) + lPad($scope.f_actas.r_acta_desde);
                        $scope.f_actas.r_acta_hasta = ($scope.items.selectedItem.id_remito) + lPad($scope.f_actas.r_acta_hasta);
                        var n_acta_desde = parseInt($scope.f_actas.r_acta_desde);
                        var n_acta_hasta = parseInt($scope.f_actas.r_acta_hasta);

                    }else{
                        
                        var n_acta_desde = parseInt($scope.datos_csv.numero_acta_min);
                        var n_acta_hasta = parseInt($scope.datos_csv.numero_acta_max);
                    }
                    console.log(pkg_actas)
                    //1 = acta automatica; 2 = acta notificada; 3 = acta no notificada 
                    $scope.codigos_barras = {
                        codigos_54: (angular.isArray(pkg_actas.data.codigo_barras))?pkg_actas.data.codigo_barras:generaCodigoBarras54(n_acta_desde, n_acta_hasta),
                        codigos_56: (angular.isArray(pkg_actas.data.codigo_barras))?pkg_actas.data.codigo_barras:generaCodigoBarras56(n_acta_desde, n_acta_hasta)
                    };

                    $scope.actas = {
                        id_remito: ($scope.data.modo_carga == 'form')?$scope.items.selectedItem.id_remito: $scope.data.id_remito,
                        lote: ($scope.data.modo_carga == 'form')?$scope.items.selectedItem.numero_lote: $scope.datos_csv.numero_lote,
                        id_tipo_acta: ($scope.data.modo_carga == 'form')?$scope.items.selectedItem.id_tipo_sijai:$scope.datos_csv.id_tipo_acta,
                        sql_remitos: generaSQLRemitosActas(),
                        codigos_barras: $scope.codigos_barras,//codigos_barras,//JSON.stringify({ "codigos_54": codigo_barras_54}),
                        rango_actas: ($scope.data.modo_carga == 'form')?[n_acta_desde, n_acta_hasta]:[$scope.datos_csv.numero_acta_min, $scope.datos_csv.numero_acta_max],
                        lst_archivos: obtenerLstArchivos(),
                        results: []
                    };
                   

                    //console.log($scope.codigos_barras);

                    //generaSQLRemitosActas();

                    //$scope.resultados_genera_remito.push('Generando archivos ...');

                    //console.log($scope.actas)

                    
                    
                    
                    remitosActasService
                        .generarArchivos( $scope.actas )
                        .then (
                            function proceso( datos ){
                                //console.log(datos)
                                $scope.resultados_genera_remito = datos;
                                //console.log(datos)
                                $scope.showAdvanced(event);
                            },
                            null,
                            function notificar( msg ){
                                console.log('asd')
                            }
                        );
                    

                };

                function blanquearCampos( obj ){
                    vmr.f_actas.r_acta_desde = '';
                    vmr.f_actas.r_acta_hasta = '';
                    vmr.actas = {};
                }


                function leerCSV( contents ){

                    

                    $scope.datos_csv.CSV_filename = contents[0];
                    $scope.datos_csv.CSV_content = contents[1].split('\n');//contents[1];
                    $scope.datos_csv.mostrar_detalles = false;
                    $scope.datos_csv.numero_remito = $scope.datos_csv.CSV_content[0].split(';')[25];

                    var tmp = $scope.datos_csv.CSV_filename.split('_');
                    $scope.datos_csv.numero_lote = parseInt(tmp[1]);

                    //var aFile = $scope.datos_csv.CSV_content.split('\n');
                    $scope.datos_csv.registros_totales = ($scope.datos_csv.CSV_content.length)-1;//10//(aFile.length) -1;

                    $scope.datos_csv.numero_acta_min = $scope.datos_csv.CSV_content[0].split(';')[0];
                    $scope.datos_csv.numero_acta_max = $scope.datos_csv.CSV_content[$scope.datos_csv.registros_totales-1].split(';')[0]
                    //aFile = '';//dummy
                    $scope.datos_csv.id_tipo_acta = ($scope.datos_csv.CSV_content[0].split(';')[47] == 'S')?3:2;
                    
                    //console.log($scope.datos_csv)

                    armarPaqueteDatos('csv');

                    return;
                };


                //---
                //METODOS PRIVADOS
                //---



                function activate(){

                    $scope.vmr = {};

                    $timeout(
                        function initApp(){
                            cargarRemitosParams( );
                        },
                        10
                    );

                };


                function armarPaqueteDatos( tipo_paquete ){

                    var data_body = [];
                    var acta = [];
                    var codigos_barras = [];
                    var numero_acta, codigo_barras, notificar;

                    for(var index in $scope.datos_csv.CSV_content){
                        acta = $scope.datos_csv.CSV_content[index].split(';');
                         //console.log(tipo_paquete, acta.length)
                        if(tipo_paquete == 'csv' && acta.length == 96){
                            numero_acta = acta[0];
                            codigo_barras = acta[18];
                            notificar = (acta[46] == 'S')?1:0;
                            //console.log(acta)
                            data_body.push(numero_acta)
                            codigos_barras.push(codigo_barras);
                            pkg_actas.header.notificar = notificar;    
                        }
                        
                    }

                    pkg_actas.data.numeros = data_body;
                    pkg_actas.data.codigo_barras = codigos_barras

                   

                };


                function cargarRemitosParams(){
                    var param_promise = remitosActasService.cargarParams()
                    param_promise.then(
                        function cargarDatos( datos ){
                             $scope.params = datos.params;
                             //console.log($scope.params)
                             $scope.tipos_actas = datos.params.tipos_actas;
                             $scope.archivos_salida = datos.params.archivos_salida;
                             return;
                        }
                    )

                    return;
                }


                function obtenerLstArchivos(){

                    return ( $scope.archivos_salida );

                };

                
                function generaSQLRemitosActas(  ){

                    var sep = ',';
                    var sql_remitos = [];
                    var sql = '';
                    var str_sql_det = '';

                    var remito_detalles = {
                        'id_remito': ($scope.data.modo_carga == 'form')?$scope.items.selectedItem.id_remito:$scope.data.id_remito,
                        'numero_remito': ($scope.data.modo_carga == 'form')?$scope.items.selectedItem.numero_remito:$scope.data.numero_remito,
                        'numero_acta': null,
                        'codigo_barras': null,
                        'notificar': ($scope.data.modo_carga == 'form')?$scope.items.selectedItem.notificar:pkg_actas.header.notificar,
                        'cantidad_fojas': 1,
                        'f_auditoria': "SYSDATE",
                        'id_usuario_auditoria': 1

                    };

                    var str_sql_head = "INSERT INTO US_SVIAL_SIJAI_OWNER.REMITOS(US_SVIAL_SIJAI_OWNER.REMITOS.ID_REMITO,US_SVIAL_SIJAI_OWNER.REMITOS.NUMERO_REMITO,US_SVIAL_SIJAI_OWNER.REMITOS.REFERENCIA,US_SVIAL_SIJAI_OWNER.REMITOS.F_EMISION,US_SVIAL_SIJAI_OWNER.REMITOS.CANTIDAD_ACTAS,US_SVIAL_SIJAI_OWNER.REMITOS.CANTIDAD_FOJAS,US_SVIAL_SIJAI_OWNER.REMITOS.ID_P_ESTADO_REMITO,US_SVIAL_SIJAI_OWNER.REMITOS.ID_LUGAR_RETIRO,US_SVIAL_SIJAI_OWNER.REMITOS.ID_ZONA,US_SVIAL_SIJAI_OWNER.REMITOS.F_DISPOSICION,US_SVIAL_SIJAI_OWNER.REMITOS.RANGO_HORARIO,US_SVIAL_SIJAI_OWNER.REMITOS.CONTACTO_ENTREGA,US_SVIAL_SIJAI_OWNER.REMITOS.F_RETIRO,US_SVIAL_SIJAI_OWNER.REMITOS.CONTACTO_RETIRO,US_SVIAL_SIJAI_OWNER.REMITOS.OBSERVACIONES,US_SVIAL_SIJAI_OWNER.REMITOS.F_AUDITORIA,US_SVIAL_SIJAI_OWNER.REMITOS.ID_USUARIO_AUDITORIA)VALUES (" + remito_detalles.id_remito + "," + remito_detalles.numero_remito + ",'Envío de actas de infracción: region 2-4',TO_DATE('25/01/2017','DD/MM/YYYY'),492,NULL,2,1,2,TO_DATE('26/01/2017','DD/MM/YYYY'),'12:00:00','Cristian Marcos',NULL,NULL,NULL,SYSDATE,1);";
                    str_sql_det = 'INSERT INTO US_SVIAL_SIJAI_OWNER.REMITOS_ACTAS(ID_REMITO_ACTA,ID_REMITO,NUMERO_ACTA,CODIGO_BARRAS,NOTIFICAR,CANTIDAD_FOJAS,F_AUDITORIA,ID_USUARIO_AUDITORIA)';
                    str_sql_det += 'VALUES(REMITOS_ACTAS_SEQ.NEXTVAL,';

                    for(var i=0; i<=$scope.codigos_barras.codigos_54.length -1; i++){

                        sql += remito_detalles.id_remito + sep;
                        sql += "'" + $scope.codigos_barras.codigos_54[i].substr(9,8) + "'" + sep;
                        sql += "'" + $scope.codigos_barras.codigos_54[i] + "'" + sep;
                        sql += "'" + remito_detalles.notificar + "'" + sep;
                        sql += remito_detalles.cantidad_fojas + sep;
                        sql += remito_detalles.f_auditoria + sep;
                        sql += remito_detalles.id_usuario_auditoria
                        sql += ');';
                        sql = str_sql_det + sql;
                        sql_remitos.push(sql);
                        sql = '';
                    }


                    sql_remitos.unshift(str_sql_head);
                    sql_remitos = sql_remitos.join("#");
                    //console.log(sql_remitos)
                    sql_remitos = sql_remitos.replace(/#/gi, '\r\n');

                    //$scope.actas.id_remito = $scope.items.selectedItem.id_remito;
                    //$scope.actas.sql_remitos = sql_remitos;
                    console.log($scope.codigos_barras.codigos_54.length)
                    return ( sql_remitos );

                };


                function generaCodigoBarras54( n_acta_desde, n_acta_hasta ){

                    
                    var cod_tmp = [];

                    var c_registros = parseInt( (n_acta_hasta +1) - (n_acta_desde) );

                    for (var i=0; i<c_registros; i++){
                        
                        var codigo_barras_53 = $scope.params.datos_cod_bar["codigo_53"];
                        codigo_barras_53.numero_acta = '00' + parseInt(n_acta_desde + (1*i));
                        var c_tmp = Object.keys(codigo_barras_53).map(
                            function(e) {
                                var tmp = codigo_barras_53[e];
                                return tmp;
                            }
                        ).join();

                        c_tmp = c_tmp.replace(/,/gi,"");

                        var digito_verificador = generaDigitoVerificador54( c_tmp );
                        var codigo_barras_54 = c_tmp + digito_verificador;

                        cod_tmp.push(codigo_barras_54)
                         
                    }
                    
                    //console.log(cod_tmp)
                    return ( cod_tmp );
                };


                function generaCodigoBarras56( n_acta_desde, n_acta_hasta ){


                    var cod_tmp = [];
                    var c_int = 0;

                    var c_registros = parseInt( (n_acta_hasta +1) - (n_acta_desde) );

                    var importes = ['00289350', '00241125', '00241125', '00144675', '00144675', '00144675', '00289350'];
                    var fecha_labrado_acta = ['20160424', '20160424', '20160426', '20160423', '20160426', '20160426', '20160426'];

                    var cod_fiscalizacion = $scope.items.selectedItem.cod_fiscalizacion + ''; //se fuerza el parse de integer a string

                    for (var i=0; i<c_registros; i++){

                        c_int = (c_int == (importes.length) )?0: c_int;

                        var codigo_barras_55 = $scope.params.datos_cod_bar["codigo_55"];
                        //console.log(codigo_barras_55)
                        
                        var importe = importes[c_int];
                        var fecha_labrado = fecha_labrado_acta[c_int];

                        codigo_barras_55.numero_acta = '00' + parseInt(n_acta_desde + (1*i));
                        codigo_barras_55.importe = importe;
                        //codigo_barras_55.fecha_labrado = fecha_labrado;

                        //se serializan los campos contenidos en codigos_barras_55
                        var c_tmp = Object.keys(codigo_barras_55).map(
                            function(e) {
                                var tmp = codigo_barras_55[e];
                                return tmp;
                            }
                        ).join();

                        //despues del serializado se elimina la coma (,)
                        c_tmp = c_tmp.replace(/,/gi,"");
                        
                        var digito_verificador_interno = generaDigitoVerificadorInterno56( cod_fiscalizacion );
                        c_tmp += cod_fiscalizacion + digito_verificador_interno +  fecha_labrado;
                        var digito_verificador = generaDigitoVerificador56( c_tmp );
                        var codigo_barras_56 = c_tmp + digito_verificador;

                        cod_tmp.push(codigo_barras_56)

                        c_int++;
                    }

                    console.log(cod_tmp)
                    //cod_tmp = cod_tmp.join();
                    //cod_tmp = cod_tmp.replace(/,/gi, '\r\n');

                    return ( cod_tmp );
                }



                function generaDigitoVerificador54( codigo_barras_53 ){

                    var tbl = [1,3,5,7,9];
                    var c_tbl = 0;

                    var digito_verificador;
                    var cod_bar_54 = '';
                    var acum = 0;
                    var tmp = codigo_barras_53.split("");//
                    
                    for(var i = 0; i< tmp.length-1;i++){
                        var dig_tmp = parseInt(tmp[i]);
                        var dig_tmp_calc = parseInt(dig_tmp) * parseInt(tbl[c_tbl]);
                        acum += parseInt(dig_tmp_calc);
                        c_tbl = (c_tbl < (tbl.length -1))?c_tbl +1:1;
                        dig_tmp_calc = 0;
                    }
                    var dv = ((parseInt(acum/2)) % 10);
                    
                    return ( dv );
                };



                function generaDigitoVerificadorInterno56 ( cod_fiscalizacion ){

                    var secuencia = [1,3,5,7];
                    var c_secuencia = 0;
                    var acum = 0;
                    var digito_verificador;
                    var arr_cod_fisc = cod_fiscalizacion.split("");

                    for(var i = 0; i< arr_cod_fisc.length;i++){
                        var dig_tmp = parseInt(arr_cod_fisc[i]);
                        var dig_tmp_calc = parseInt(dig_tmp) * parseInt(secuencia[c_secuencia]);
                        acum += parseInt(dig_tmp_calc);

                        //console.log(secuencia[c_secuencia], acum)

                        c_secuencia = (c_secuencia < (secuencia.length -1))?c_secuencia +1:1;
                        dig_tmp_calc = 0;
                    }
                    var dv = ((parseInt(acum/2)) % 10);
                    
                    return ( dv );

                };


                function generaDigitoVerificador56( codigo_barras_55 ){

                    var tbl = [3,1];
                    var c_tbl = 0;

                    var digito_verificador;
                    var cod_bar_54 = '';
                    var acum = 0;
                    
                    var tmp = codigo_barras_55.split("");
                     
                    for(var i = 0; i<= tmp.length-1;i++){
                        
                        var dig_tmp = parseInt(tmp[i]);
                        var dig_tmp_calc = parseInt(dig_tmp) * parseInt(tbl[c_tbl]);
                        acum += parseInt(dig_tmp_calc);
                        c_tbl = (c_tbl == 0)?1:0;
                        dig_tmp_calc = 0;
                            
                    }

                    var dv = (parseInt(acum) % 10);
                    dv = (dv == 0)?0:(10 - (dv));

                    return ( dv );
                };


                function generaCSV( tipo_acta, n_acta_desde, n_acta_hasta ){
                    var cod_tmp = [];

                    var c_registros = parseInt( (n_acta_hasta +1) - (n_acta_desde) );

                    for (var i=0; i<c_registros; i++){
                        
                        var codigo_barras_53 = 
                        {
                            'codigo_municipio': '000',
                            'tipo_acta': '2',
                            'codigo_grupo': '905',
                            'codigo_fiscal': '03',
                            'numero_acta': '00' + parseInt(n_acta_desde + (1*i)),
                            'numero_ponderador': '01030507',
                            'relleno': '0000000000000000000000000000'
                        };

                        var c_tmp = Object.keys(codigo_barras_53).map(
                            function(e) {
                                var tmp = codigo_barras_53[e];
                                return tmp;
                            }
                        ).join();
                    }
                };


                function lPad( str ){

                    var pad = "000";
                    var str_pad = '';
                    str_pad = (pad.substring(0, pad.length - str.length) + str);
                   
                    return ( str_pad );

                };

                function limpiarFormulario(){

                    $state.reload();

                };



                /*c_tmp = $http
                        .post(url, actas)
                        .success(
                            function continuarProceso( data ) {
                                //console.log(JSON.stringify(data))

                                c_tmp = Object.keys(data).map(
                                    function(e) {
                                        var tmp = data[e];
                                        return tmp;
                                    }
                                );

                                //console.log(c_tmp)
                                
                                //console.log(typeof( vmr.resultados_genera_remito),  vmr.resultados_genera_remito)
                                return ( c_tmp )
                            }
                        )
                        .error(
                            function( reason ) {
                                $q.reject(reason);
                            }
                        );
                */


                /*---------------------------------------------------------------------------------------------
                //---------------------------------------------------------------------------------------------
                                            M E T O D O S   P U B L I C O S  BOOTSTRAP
                //---------------------------------------------------------------------------------------------
                -----------------------------------------------------------------------------------------------*/
                

                $scope.alerts = [
                    //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
                    //{ type: 'success', msg: 'Well done! You successfully read this important alert message.' },
                    //{ type: 'info', msg: 'asdasdasd'}
                  ];

                  $scope.closeAlert = function(index) {
                    $scope.alerts.splice(index, 1);
                  };


                
                  

                  $scope.clear = function() {
                    $scope.dt = null;
                  };

                  $scope.inlineOptions = {
                    customClass: getDayClass,
                    minDate: new Date(),
                    showWeeks: true
                  };

                  $scope.dateOptions = {
                    dateDisabled: disabled,
                    formatYear: 'yyyy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                  };

                  // Disable weekend selection
                  function disabled(data) {
                    var date = data.date,
                      mode = data.mode;
                    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                  }

                  $scope.open2 = function() {
                    $scope.popup2.opened = true;
                  };

                  $scope.setDate = function(year, month, day) {

                    $scope.dt = new Date(year, month, day);

                    //angular.copy($scope.dt, $scope.fec_const_calc);

                    //vmr.fecha_lote = $scope.dt;

                    ///////////

                    //calcularFechaConstatacion();

                  };

                  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                  $scope.format = $scope.formats[1];
                  $scope.altInputFormats = ['M!/d!/yyyy'];

                  $scope.popup1 = {
                    opened: false
                  };

                  $scope.popup2 = {
                    opened: false
                  };

                  var tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  var afterTomorrow = new Date();
                  afterTomorrow.setDate(tomorrow.getDate() + 1);
                  $scope.events = [
                    {
                      date: tomorrow,
                      status: 'full'
                    },
                    {
                      date: afterTomorrow,
                      status: 'partially'
                    }
                  ];

                  function getDayClass(data) {
                    var date = data.date,
                      mode = data.mode;
                    if (mode === 'day') {
                      var dayToCheck = new Date(date).setHours(0,0,0,0);

                      for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                        if (dayToCheck === currentDay) {
                          return $scope.events[i].status;
                        }
                      }
                    }

                    return '';
                  }
                //---------------------------------------------------------------------------------------------
                ////////////////////////////FIN M E T O D O S   P U B L I C O S  BOOTSTRAP/////////////////////
                //---------------------------------------------------------------------------------------------

        };
        //FIN CONTROLLER

})();


