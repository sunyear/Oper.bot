(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QACasosPruebaController', QACasosPruebaController);
        
        QACasosPruebaController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'qaService', 'qa_casos_prueba'];
        function QACasosPruebaController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, qaService, qa_casos_prueba) {
                
               
                $scope.gridOptions = {
                    data: [],
                    urlSync: true
                };

                $scope.user = {
                    biography: 'adasdsadsad'
                }

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
                $scope.verDetalles = verDetalles;

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

                function verDetalles( caso_prueba ){
                    //console.log(caso_prueba.ID)
                    //qaService.setCasoPrueba( caso_prueba );
                   $state.go('datos-caso', {id_caso_prueba: caso_prueba.ID})  
                    //console.log($state.go('qa.tablero', {id_caso_prueba: 1}))
                    // $scope.showAdvanced(event, caso_prueba);
                };


                /**************************************************************************/
                  /**************************************************************************/
                  /**************************************************************************/

                  //$scope.lotes_estados [{}]

                 $scope.showAdvanced = function(ev, caso_prueba) {
                    $mdDialog.show({
                        controller: 'QACasosPruebaModalController',
                        templateUrl: './views/qa/qa-casos-prueba-modal-form-template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:false,
                        fullscreen: false, // Only for -xs, -sm breakpoints.
                        locals: {
                            caso_prueba: caso_prueba
                        }
                    })
                    .then(
                        function(answer) {
                            $scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                            $scope.status = 'You cancelled the dialog.';
                        }
                    );
                };

                /**************************************************************************/
                /**************************************************************************/
                /**************************************************************************/ 


                //---
                //METODOS PRIVADOS
                //---

                function activate(){
                    $scope.gridOptions.data = qa_casos_prueba;
                    console.log($scope.gridOptions)
                }



        };
        //FIN CONTROLLER

})();