(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QAEscenariosController', QAEscenariosController);
        
        QAEscenariosController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'qaService', 'qa_escenarios'];
        function QAEscenariosController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, qaService, qa_escenarios) {
                
               
                $scope.gridOptions = {
                    data: [],
                    urlSync: true
                };           

                activate();     

                /*
                 getData().then(
                    function( dataResponse ){
                        //console.log(dataResponse)
                        $scope.gridOptions.data = dataResponse.data;
                    }
                )
                */

                 
                
                
                //---
                //API PUBLICA
                //---
                $scope.guardarCambios = guardarCambios;

                //---
                //METODOS PUBLICOS
                //---

                function getData(){
                    return $http({
                        method: 'GET',
                        url: 'https://angular-data-grid.github.io/demo/data.json'
                    });
                }

                function guardarCambios(){
                    remitosActasService
                        .guardarParams(  )
                        .then (
                            function proceso( datos ){
                                console.log(datos)
                            },
                            null,
                            function notificar( msg ){
                                console.log('asd')
                            }
                        );    
                }


                //---
                //METODOS PRIVADOS
                //---

                function activate(){
                    $scope.gridOptions.data = qa_escenarios;
                    console.log($scope.gridOptions)
                }      

        };
        //FIN CONTROLLER

})();