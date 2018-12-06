(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QATicketsController', QATicketsController);
        
        QATicketsController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'qaService', 'qa_tickets'];
        function QATicketsController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, qaService, qa_tickets) {
                
               
                $scope.form_data = {};

                $scope.gridOptions = {
                    data: [],
                    urlSync: true
                };

                $scope.gridActions = {};           

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
                $scope.agregarTicket = agregarTicket;

                //---
                //METODOS PUBLICOS
                //---

                function getData(){
                    return $http({
                        method: 'GET',
                        url: 'https://10.30.1.160/mantis/view.php?id=33096'
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

                function agregarTicket( $event ){
                    var obj ={
                            "numero_ticket": '9999',
                            "fuente_ticket": 'MANTIS',
                            "titulo_ticket": 'Ticket ' + $scope.gridOptions.data.length,
                            "fecha_ticket": '22/02/2017'
                        };

                    $scope.showAdvanced(event);
                    //$scope.gridOptions.data.push(obj)
                }


                //---
                //METODOS PRIVADOS
                //---

                function activate(){
                    $scope.gridOptions.data = qa_tickets;


                    //console.log(getData())
                } 



                /**************************************************************************/
                  /**************************************************************************/
                  /**************************************************************************/

                  //$scope.lotes_estados [{}]

                 $scope.showAdvanced = function(ev) {
                    $mdDialog.show({
                        controller: 'QATicketsModalController',
                        templateUrl: './views/qa/qa-tickets-modal-form-template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:false,
                        fullscreen: false, // Only for -xs, -sm breakpoints.
                        locals: {
                            resultados: $scope.form_data
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

        };
        //FIN CONTROLLER

})();