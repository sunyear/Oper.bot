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
                    //$scope.dataset_sur = $filter('filter')(actas_notif.actas, {zona: 'SUR'})
                }else if($scope.tipo_notificacion == 1){
                    $scope.dataset_aceptadas = actas_notif.actas
                }else{
                    $scope.dataset_no_notificadas = actas_notif.actas;
                }

                

                $scope.respuestaValidacion = function(respuesta) {
                  $mdDialog.hide(respuesta);
                };
                
        };
        //FIN CONTROLLER

})();