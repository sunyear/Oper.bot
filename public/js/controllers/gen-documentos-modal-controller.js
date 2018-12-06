(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('GenDocumentosModalController', GenDocumentosModalController);
        
        GenDocumentosModalController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'remitosActasService', 'resultados', 'dir_salida', 'PROCESOS'];
        function GenDocumentosModalController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, remitosActasService, resultados, dir_salida, PROCESOS) {


                //console.log(resultados)

                $scope.resultados = resultados;
                $scope.dir_salida = dir_salida;

                $scope.hide = function() {
                  $mdDialog.hide();
                };

                $scope.cancel = function() {
                  $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                  $mdDialog.hide(answer);
                };
                

        };
        //FIN CONTROLLER

})();