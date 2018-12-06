(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .controller('ValidacionesTableroController', ValidacionesTableroController);
    

        ValidacionesTableroController.$inject = ['$scope', '$mdDialog', '$mdPanel', '$timeout', 'remitosActasService', 'moment', 'ESTADOS_LOTES'];
        function ValidacionesTableroController($scope, $mdDialog, $mdPanel, $timeout, remitosActasService, moment, ESTADOS_LOTES) {
                //var $scope = $scope;//this;

                $scope._mdPanel = $mdPanel;


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



               

               


                today();
                $scope.fec_const_calc = {};

                activate();

                $scope.calcularFechas = calcularFechas;

                //---
                //METODOS PUBLICOS
                //---


                function leerCSV( contents ){

                    console.log(contents)

                        
                        
                        /*remitosActasService
                            .getArchivosDirectorio( )
                            .then(
                                function procesarResult( resultados ){
                                    //console.log(resultados.length)
                                    
                                    
                                    return resultados;
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('controller', notif)
                                }
                            )

                        */




                            
                        return;
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

