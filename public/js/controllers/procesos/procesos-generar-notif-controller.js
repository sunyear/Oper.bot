(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('CargaMasivaGenNotif', CargaMasivaGenNotif);
        
        CargaMasivaGenNotif.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'pdfDelegate', 'remitosActasService', 'actas_notif', 'PROCESOS'];
        function CargaMasivaGenNotif($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, pdfDelegate, remitosActasService, actas_notif, PROCESOS) {

                //console.log(acta_pdf)

                //console.log($filter('filter')(acta_pdf, {id_tipo_envio: '2'}))
                

                $scope.tipo_notificacion = actas_notif.tipo_notificacion;
                if($scope.tipo_notificacion == 2){
                    $scope.dataset_norte = $filter('filter')(actas_notif.actas, { zona: 'NORTE'});
                    $scope.dataset_sur = $filter('filter')(actas_notif.actas, {zona: 'SUR'})
                }else if($scope.tipo_notificacion == 1){
                    $scope.dataset_aceptadas = actas_notif.actas
                }

                

                //console.log($scope.tipo_notificacion)

                //this._$filter('filter')(this.dataset.detalle, {zona: 'NORTE'})

                /*
                $scope.dataset = [
                    {
                        lote: '2086',
                        remito: '12121212112',
                        cantidad: '23'
                    },
                    {
                        lote: '2086',
                        remito: '12121212112',
                        cantidad: '23'
                    },
                    {
                        lote: '2086',
                        remito: '12121212112',
                        cantidad: '23'
                    },
                    {
                        lote: '2086',
                        remito: '12121212112',
                        cantidad: '23'
                    }
                ]
                */
                $scope.respuestaValidacion = function(respuesta) {
                  $mdDialog.hide(respuesta);
                };
                
        };
        //FIN CONTROLLER

})();