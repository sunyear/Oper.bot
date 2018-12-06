(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QATableroController', QATableroController);
        
        QATableroController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'qaService'];
        function QATableroController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, qaService) {
                
               
                $scope.gridOptions = {
                    data: [],
                    urlSync: true
                };           
                console.log('asd')
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
                

                //---
                //METODOS PUBLICOS
                //---

                function getData(){
                    return $http({
                        method: 'GET',
                        url: 'https://angular-data-grid.github.io/demo/data.json'
                    });
                }

                

                /**************************************************************************/
                /**************************************************************************/
                /**************************************************************************/ 


                //---
                //METODOS PRIVADOS
                //---

                function activate(){
                    
                }



        };
        //FIN CONTROLLER

})();