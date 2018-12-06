(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .controller('ValidadorCecaitraController', ValidadorCecaitraController);
    

        ValidadorCecaitraController.$inject = ['$scope', '$mdDialog', '$mdPanel', '$timeout', 'remitosActasService', 'pdfDelegate', 'moment', 'ESTADOS_LOTES'];
        function ValidadorCecaitraController($scope, $mdDialog, $mdPanel, $timeout, remitosActasService, pdfDelegate, moment, ESTADOS_LOTES) {

                //var $scope = $scope;//this;

                $scope._mdPanel = $mdPanel;

                $scope.pdfUrl = './assets/10603201.pdf';
                $timeout(function() {
                    pdfDelegate
                    .$getByHandle('my-pdf-container').zoomTo(3);
                  });
                

                $scope.muestra_actas_pdf = [];

                $scope.lotes_validados = [
                    {
                        "lote": "Lote 233",
                        "fecha_procesado": "14/05/2017 05:00:24",
                        "id_estado": 1
                    },
                    {
                        "lote": "Lote 346",
                        "fecha_procesado": "23/03/2017 15:00:24",
                        "id_estado": 2
                    },
                    {
                        "lote": "Lote 255",
                        "fecha_procesado": "02/01/2017 13:45:24",
                        "id_estado": 3
                    },
                    {
                        "lote": "Lote 265",
                        "fecha_procesado": "19/01/2017 13:45:24",
                        "id_estado": 1
                    }
                  ];

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

                

                  /**************************************************************************/
                  /**************************************************************************/
                  /**************************************************************************/

                  //$scope.lotes_estados [{}]

                  $scope.showMenu = function(ev, index) {
                  var position = $scope._mdPanel.newPanelPosition()
                      .relativeTo(ev.target)
                      .addPanelPosition($scope._mdPanel.xPosition.OFFSET_END, $scope._mdPanel.yPosition.ALIGN_TOPS);

                  var config = {
                    attachTo: angular.element(document.body),
                    controller: PanelMenuCtrl,
                    controllerAs: 'ctrl',
                    templateUrl: './views/panel-lote-validado-template.html',
                    panelClass: 'demo-menu-example',
                    position: position,
                    locals: {
                        
                        'lote_seleccionado': { 
                            "lote": $scope.lotes_validados[index],
                            "lote_estado": $scope.lotes_estados[$scope.lotes_validados[index].id_estado]
                        },
                        'selected': $scope.selected,
                        'desserts': $scope.desserts
                    },
                    openFrom: ev,
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    focusOnOpen: false,
                    zIndex: 2
                  };

                  $scope._mdPanel.open(config);
                };

                function PanelDialogCtrl(mdPanelRef) {
                  this._mdPanelRef = mdPanelRef;
                }

                PanelDialogCtrl.prototype.closeDialog = function() {
                  var panelRef = this._mdPanelRef;

                  panelRef && panelRef.close().then(function() {
                    angular.element(document.querySelector('.demo-dialog-open-button')).focus();
                    panelRef.destroy();
                  });
                };

                function PanelMenuCtrl(mdPanelRef, $timeout) {
                    //console.log(this.lote_seleccionado)
                   //this.lote_seleccionado
                
                  this._mdPanelRef = mdPanelRef;
                  this.favoriteDessert = this.selected.favoriteDessert;
                  this.mostrarInformacion = mostrarInformacion;

                  this.paneles = {
                    "info_datos": false,
                    "info_datos_css": '',
                    "info_err": false,
                    "info_err_css": '',
                    };

                    this.chips_err = [                            

                            {
                                "class": 'chip-error',
                                "msg": "4458"
                            },
                            {
                                "class": 'chip-error',
                                "msg": "7798"
                            },
                            {
                                "class": 'chip-error',
                                "msg": "698"
                            },
                            {
                                "class": 'chip-error',
                                "msg": "44"
                            }
                        ];


                    function mostrarInformacion( panel_name ){

                        for(var panel in this.paneles){
                            if(panel == panel_name){
                                this.paneles[panel_name] = !this.paneles[panel_name];
                            }else{
                                if(this.paneles[panel]){
                                    this.paneles[panel] = false;
                                }
                            }
                        }

                };

                  $timeout(function() {
                    var selected = document.querySelector('.demo-menu-item.selected');
                    if (selected) {
                      angular.element(selected).focus();
                    } else {
                      angular.element(document.querySelectorAll('.demo-menu-item')[0]).focus();
                    }
                  });
                }

                function indexOf(nodeList, element) {
                    for (var item, i = 0; item = nodeList[i]; i++) {
                      if (item === element) {
                        return i;
                      }
                    }
                    return -1;
                  }

                /**************************************************************************/
                /**************************************************************************/
                /**************************************************************************/

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
                var POS_FEC_CONST = 27, // FECHA CONSTATACION
                    POS_FEC_VENC = 6,   //FECHA VENCIMIENTO
                    POS_VEL_BASE = 29,  //VELOCIDAD BASE
                    POS_VEL_REG = 30,   //VELOCIDAD REGISTRADA
                    POS_COD_BARRAS = 18; //CODIGO DE BARRAS





                today();
                $scope.fec_const_calc = {};

                activate();


                $scope.leerCSV = leerCSV;
                $scope.procesarLote = procesarLote;
                $scope.calcularFechas = calcularFechas;
                $scope.mostrarDetalles = mostrarDetalles;


                //---
                //METODOS PUBLICOS
                //---


                function leerCSV( contents ){

                    console.log(contents)

                        $scope.datos_csv.CSV_filename = contents[0];
                        $scope.datos_csv.CSV_content = contents[1].split('\n');//contents[1];
                        $scope.datos_csv.registros_totales = ($scope.datos_csv.CSV_content.length)-1;//10//(aFile.length) -1;
                        
                        $scope.datos_csv.numero_acta_min = $scope.datos_csv.CSV_content[0].split(';')[0];
                        $scope.datos_csv.numero_acta_max = $scope.datos_csv.CSV_content[$scope.datos_csv.registros_totales-1].split(';')[0]

                        var tmp = $scope.datos_csv.CSV_filename.split('_');
                        $scope.datos_csv.nro_lote = parseInt(tmp[1]);

                        //var aFile = $scope.datos_csv.CSV_content.split('\n');
                        
                        //aFile = '';//dummy
                        $scope.datos_csv.mostrar_detalles = false;
                        
                        $scope.btn_procesar_disabled = false;

                        remitosActasService
                            .getArchivosDirectorio( {"dir_lote": "Lote" + $scope.datos_csv.nro_lote } )
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
                                procesarErrores();
                        //}

                        //console.log($scope.results)

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
                        templateUrl: './views/validador-cecaitra-modal-template.html',
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
                            $scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                            $scope.status = 'You cancelled the dialog.';
                        }
                    );
                };


                


                //---
                //METODOS PRIVADOS
                //-----

                function activate(){
                  return;
                }


                function generarMuestraAleatoriaActas(){

                    for (var i=0;i<3;i++){
                        var arr_rnd_index = Math.floor((Math.random() * $scope.datos_csv.registros_totales-1) + 0);//$scope.datos_csv.CSV_content[];
                        $scope.muestra_actas_pdf.push($scope.datos_csv.CSV_content[arr_rnd_index]);
                    }

                    //console.log($scope.muestra_actas_pdf);
                };
                    


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

               

                    //onsole.log(LOTE_ESTADOS[id_lote_estado])
        };//FIN CONTROLLER


})();

