(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('MenuController', MenuController);

        

        MenuController.$inject = ['$scope', '$rootScope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdSidenav', 'loteService','PROCESOS'];
        function MenuController($scope, $rootScope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdSidenav, loteService, PROCESOS) {

                var vm_m = this;

                             
                //angular.copy(vm_m.header || {});

                //activate();
                

                //API PUBLICA


                //API PRIVADA
                
                

        };
        //FIN CONTROLLER

        

})();


