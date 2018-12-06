(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QATicketsModalController', QATicketsModalController);
        
        QATicketsModalController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'qaService', 'resultados', 'PROCESOS'];
        function QATicketsModalController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, qaService, resultados, PROCESOS) {


               // console.log(resultados)

                $scope.resultados = resultados

                $scope.btn_modal = {
                    txt_button: 'ACEPTAR',
                    css_style: 'md-primary md-raised'
                };

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