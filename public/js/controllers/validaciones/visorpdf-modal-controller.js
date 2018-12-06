(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('VisorPDFModalController', VisorPDFModalController);
        
        VisorPDFModalController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'pdfDelegate', 'remitosActasService', 'acta_pdf', 'PROCESOS'];
        function VisorPDFModalController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, pdfDelegate, remitosActasService, acta_pdf, PROCESOS) {


                $scope.acta_pdf = acta_pdf;
                var archivo_acta_pdf = $scope.acta_pdf.nombre_archivo;

                $scope.pdfUrl = './assets/'+archivo_acta_pdf;

                $timeout(
                    function() {
                        pdfDelegate.$getByHandle('my-pdf-container').zoomTo(2);
                    }
                );

                $scope.respuestaValidacion = function(respuesta) {
                  $mdDialog.hide(respuesta);
                };
                
        };
        //FIN CONTROLLER

})();