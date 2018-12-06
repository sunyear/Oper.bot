(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('ValidadorCecaitraModalController', ValidadorCecaitraModalController);
        
        ValidadorCecaitraModalController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'remitosActasService', 'resultados', 'PROCESOS'];
        function ValidadorCecaitraModalController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, remitosActasService, resultados, PROCESOS) {


                console.log(resultados)

                $scope.resultados = resultados

                $scope.btn_modal = {
                    txt_button: ($scope.resultados.flg_rechazo)?'RECHAZAR LOTE':'ACEPTARR',
                    css_style: ($scope.resultados.flg_rechazo)?'md-warn md-raised':'md-primary md-raised'
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