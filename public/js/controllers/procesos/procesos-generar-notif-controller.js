(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('CargaMasivaGenNotif', CargaMasivaGenNotif);
        
        CargaMasivaGenNotif.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'pdfDelegate', 'remitosActasService', 'acta_pdf', 'PROCESOS'];
        function CargaMasivaGenNotif($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, pdfDelegate, remitosActasService, acta_pdf, PROCESOS) {


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

                $scope.respuestaValidacion = function(respuesta) {
                  $mdDialog.hide(respuesta);
                };
                
        };
        //FIN CONTROLLER

})();