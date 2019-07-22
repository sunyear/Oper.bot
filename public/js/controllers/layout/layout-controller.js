(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('LayoutController', LayoutController);

        

        LayoutController.$inject = ['$scope', '$rootScope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdSidenav', '$urlRouter', 'loteService','PROCESOS'];
        function LayoutController($scope, $rootScope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdSidenav, $urlRouter, loteService, PROCESOS) {

                var vm = this;
                $scope.$state = $state;

                vm.header = {
                    "titulo": '',
                    "subtitulo": ''
                }                

                $scope.$on('$viewContentLoaded', 
                    function(event){ 
                        actualizarHeaderBar( $state.current.name ); 
                    }
                );

                $scope.menu_activo = function( ruta_activada ){
                    let ruta_actual = $state.current.name;
                    return ( (ruta_actual.indexOf(ruta_activada)) > -1 )
                }



                //angular.copy($scope.dt, $scope.fec_const_calc);

                //activate();
                

                //API PUBLICA

                
                //---
                //METODOS PRIVADOS
                //---


                function actualizarHeaderBar( objState ){
                    var arr = objState.split('.');

                    vm.header.subtitulo = arr[arr.length-1];
                    vm.header.titulo = (arr.length > 1)?arr[arr.length-2]:'';
                    
                }

        };
        //FIN CONTROLLER

        

})();


