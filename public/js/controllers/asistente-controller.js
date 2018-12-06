(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .controller('AsistenteController', AsistenteController);
    

        AsistenteController.$inject = ['$scope', '$uibModalInstance', 'items', 'loteService', 'moment', 'ESTADOS_LOTES'];
        function AsistenteController($scope, $uibModalInstance, items, loteService, moment, ESTADOS_LOTES) {

                var $aCtrl = this;

                $aCtrl.result_template_url = "./views/resultados_validacion_template.html";

                $aCtrl.CSV_content = $aCtrl.CSV_filename = '';

                $aCtrl.registros_totales = 0;

                $aCtrl.info, $aCtrl.fecha_lote, $aCtrl.fecha_const_calc, $aCtrl.fecha_venc_calc;
                $aCtrl.form_carga_visible = true;
                $aCtrl.result_visible = false;



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


                //---
                //METODOS PUBLICOS
                //---


                function leerCSV( contents ){

                        $aCtrl.CSV_filename = contents[0];
                        $aCtrl.CSV_content = contents[1];

                        var tmp = $aCtrl.CSV_filename.split('_');
                        $aCtrl.nro_lote = parseInt(tmp[1]);

                        var aFile = $aCtrl.CSV_content.split('\n');
                        $aCtrl.registros_totales = (aFile.length) -1;
                        aFile = '';//dummy

                        $aCtrl.btn_procesar_disabled = false;
                        return ( $aCtrl.CSV_content );
                };


                function procesarLote(){

                        var cRegistros = 10;
                        var aFile = [];
                        
                        //Genero un array; cada elemento corresponde a un registro del archivo CSV
                        aFile = $aCtrl.CSV_content.split('\n');
                        cRegistros = (aFile.length) -1;
                        $aCtrl.registros_totales = cRegistros;
                        for(var i=0; i<cRegistros; i++){
                                $aCtrl.exito = validarRegistro(aFile[i]);
                        };


                        var arr = {
                                'err_tol_vel':$aCtrl.cant_err_tol_vel,
                                'err_fec_venc': $aCtrl.cant_err_fec_venc,
                                'err_fec_const': $aCtrl.cant_err_fec_const,
                                'cant_err_cod_bar': $aCtrl.cant_err_cod_bar
                        }

                        //console.log(arr);

                        var cant_err = $aCtrl.cant_err_tol_vel + $aCtrl.cant_err_fec_venc + $aCtrl.cant_err_fec_const + $aCtrl.cant_err_cod_bar;

                        if(cant_err > 0){
                                procesarErrores();
                        }

                        
                        formCargaVisible(false);

                        resultVisible(true);
                        //vm.mostrar_resultados = true;

                        //vm.open();

                };


                function calcularFechas(){

                        $aCtrl.fecha_lote = new Date($scope.dt)

                        $aCtrl.fecha_const_calc = moment($aCtrl.fecha_lote).subtract(60, 'days').toDate();
                        $aCtrl.fecha_venc_calc = moment($aCtrl.fecha_lote).add(45, 'days').toDate();

                };


                //---------------------------------------------------------------------------------------------
                //---------------------------------------------------------------------------------------------
                ////////////////////////////M E T O D O S   P U B L I C O S  BOOTSTRAP/////////////////////////
                //---------------------------------------------------------------------------------------------


                $aCtrl.open = function (size, parentSelector) {

                        var parentElem = parentSelector ? 
                        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                        var modalInstance = $uibModal.open({
                                animation: true,
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                templateUrl: './views/resultados_validacion_template.html',
                                controller: 'ModalInstanceCtrl',
                                controllerAs: '$aCtrl2',
                                size: size,
                                appendTo: parentElem,
                                resolve: {
                                        items: function () {


                                                var obj = {
                                                        //propiedades generales
                                                        'fec_const_calc': $aCtrl.fec_const_calc,
                                                        'fecha_venc_calc': $aCtrl.fecha_venc_calc,
                                                        //fecha imposicion
                                                        'err_fec_const': $aCtrl.err_fec_const,
                                                        'cant_err_fec_const': $aCtrl.cant_err_fec_const,
                                                        'porc_err_fec_const': $aCtrl.porc_err_fec_const,
                                                        'arr_const': $aCtrl.err_fec_const_arr,
                                                        //fecha vencimiento
                                                        'err_fec_venc': $aCtrl.err_fec_venc,
                                                        'cant_err_fec_venc': $aCtrl.cant_err_fec_venc,
                                                        'porc_err_fec_venc': $aCtrl.porc_err_fec_venc,
                                                        'arr_venc': $aCtrl.err_fec_venc_arr,
                                                        //codigo barras
                                                        'err_cod_bar': $aCtrl.err_cod_bar,
                                                        'cant_err_cod_bar': $aCtrl.cant_err_cod_bar,
                                                        'porc_err_cod_bar': $aCtrl.porc_err_cod_bar,
                                                        'arr_cod_bar': $aCtrl.err_cod_bar_arr,
                                                        //tolerancia velocidad
                                                        'err_tol_vel': $aCtrl.err_tol_vel,
                                                        'cant_err_tol_vel': $aCtrl.cant_err_tol_vel,
                                                        'porc_err_tol_vel': $aCtrl.porc_err_tol_vel,
                                                        'arr_tol_vel': $aCtrl.err_tol_vel_arr,
                                                        //
                                                        'nro_lote': $aCtrl.nro_lote,
                                                        'nom_csv': $aCtrl.CSVFilename,
                                                        'fecha_lote': $scope.dt,
                                                        'registros': $aCtrl.registrosTotales,
                                                        'err_tot': $aCtrl.cant_err_tol_vel + $aCtrl.cant_err_fec_venc + $aCtrl.cant_err_fec_const + $aCtrl.cant_err_cod_bar,
                                                        'fecha_proc': new Date()
                                                }

                                                return ( obj );
                                        }
                                }
                        });

                        modalInstance.result.then(function (selectedItem) {
                                $aCtrl.selected = selectedItem;
                                console.log(selectedItem)
                                $aCtrl.arr_hist.push(selectedItem);
                                //publicarHistoricoLotes([selectedItem]);
                                //activate();

                        }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                        });
                };
                

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

                    //vm.fecha_lote = $scope.dt;

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



                //---
                //METODOS PRIVADOS
                //-----

                function activate(){
                  return;
                }



                function validarRegistro( registro ){

                        var aRegistro = registro.split(';');

                        var id_acta = aRegistro[0];
                        var fec_venc = aRegistro[POS_FEC_VENC];
                        var fec_const = aRegistro[POS_FEC_CONST];
                        var vel_base = aRegistro[POS_VEL_BASE];
                        var vel_reg = aRegistro[POS_VEL_REG];
                        var cod_barras = aRegistro[POS_COD_BARRAS];

                        $aCtrl.reg_actual = id_acta;

                        //console.log(vm.reg_actual)

                        $aCtrl.exito = validarFechaConstatacion( fec_const );

                        //if(vm.exito){
                        $aCtrl.exito = validarFechaVencimiento( fec_venc );
                        //}

                        //if(vm.exito){
                        $aCtrl.exito = validarToleranciaVelocidad( vel_base, vel_reg );
                        //}

                        //if(vm.exito){
                        $aCtrl.exito = validarCodBarras( cod_barras, fec_venc );
                        //}

                        return ( $aCtrl.exito );
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
                        var m_fec_const = moment(fec_const, 'YYYYMMDD');
                        //var fecha_calculada = moment(vm.fecha_lote, 'YYYYMMDD').subtract(60, 'days').toDate();
                        //isAfter() -> devuelve TRUE si m_fec_const > vm.proc
                        fec_const_valida = m_fec_const.isAfter($aCtrl.fecha_const_calc);

                        if(!fec_const_valida){
                                var reg = {
                                        'nroActa': $aCtrl.reg_actual,
                                        'fec_const': m_fec_const
                                }
                                $aCtrl.err_fec_const_arr.push(reg);
                                $aCtrl.cant_err_fec_const++;
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

                        m_fec_venc = moment(fec_venc, 'YYYYMMDD');

                        fec_venc_valida = m_fec_venc.isAfter($aCtrl.fecha_venc_calc);

                        if(!fec_venc_valida){

                                var reg = {
                                        'nroActa': $aCtrl.reg_actual,
                                        'fec_venc': m_fec_venc,
                                }
                                $aCtrl.err_fec_venc_arr.push(reg);
                                $aCtrl.cant_err_fec_venc++
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
                                        'nroActa': $aCtrl.reg_actual,
                                        'vel_reg': vel_reg,
                                        'vel_base': vel_base
                                }
                                $aCtrl.err_vel_tol_arr.push(reg);
                                $aCtrl.cant_err_tol_vel++;
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

                        encontrado = (cod_barras.indexOf(fec_venc) != -1)?true:false;
                        //console.log(cod_barras, fec_venc)

                        if(!encontrado){
                                var reg = {
                                        'nroActa': $aCtrl.reg_actual,
                                        'cod_barras': cod_barras,
                                        'fec_venc': fec_venc
                                }
                                $aCtrl.err_cod_bar_arr.push(reg);
                                $aCtrl.cant_err_cod_bar++;
                        }

                        return ( encontrado );

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

                        var porc_err_fec_venc = ($aCtrl.cant_err_fec_venc * 100 / $aCtrl.registrosTotales);
                        var porc_err_fec_const = ($aCtrl.cant_err_fec_const * 100 / $aCtrl.registrosTotales);
                        var porc_err_cod_bar = ($aCtrl.cant_err_cod_bar * 100 / $aCtrl.registrosTotales);
                        var porc_err_tol_vel = ($aCtrl.cant_err_tol_vel * 100 / $aCtrl.registrosTotales);


                        $aCtrl.porc_err_fec_venc = porc_err_fec_venc.toPrecision(3);
                        $aCtrl.porc_err_fec_const = porc_err_fec_const.toPrecision(3);
                        $aCtrl.porc_err_cod_bar = porc_err_cod_bar.toPrecision(3);
                        $aCtrl.porc_err_tol_vel = porc_err_tol_vel.toPrecision(3);


                        if(porc_err_fec_venc > 0){
                                $aCtrl.err_fec_venc = true;
                        }

                        if(porc_err_tol_vel > 1){
                                $aCtrl.err_tol_vel = true;
                        }

                        if(porc_err_cod_bar > 0){
                                $aCtrl.err_cod_bar = true;
                        }

                        if(porc_err_fec_const > 1){
                                $aCtrl.err_fec_const = true;
                        }


                };


                function formCargaVisible( visible ){
                  $aCtrl.form_carga_visible = visible;
                };

                function resultVisible( visible ){

                  $aCtrl.result_visible = visible;

                };




                $aCtrl.selected = {
                  //item: $aCtrl.items[0]
                };

                $aCtrl.ok = function () {
                  $uibModalInstance.close($aCtrl.selected.item);
                };

                $scope.cerrarModal = cerrarModal;

                function cerrarModal(){
                  $aCtrl.cancel();
                };

                $aCtrl.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };

                function today() {
                  $scope.dt = new Date();
                  calcularFechas();
                };

               

                    //onsole.log(LOTE_ESTADOS[id_lote_estado])
        };//FIN CONTROLLER


})();

