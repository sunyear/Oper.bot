(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QACasosPruebaModalController', QACasosPruebaModalController);
        
        QACasosPruebaModalController.$inject = ['$scope', '$state', 'moment', '$mdDialog', 'qaService', 'coreService', 'PROCESOS'];
        function QACasosPruebaModalController($scope, $state, moment, $mdDialog, qaService, coreService, PROCESOS) {

                //$scope.caso_prueba = caso_prueba;

                    
                //var casoPruebaDataPack =  angular.extend({}, caso_prueba);
                $scope.btn_modal = {};

                console.log($state)
                
                activate();
                

                //--
                // API PUBLICA
                //--
                
                //--
                // METODOS PUBLICOS
                //--

                function setCssClassDescr( ){

                    var css;

                    if($scope.componentes.descripcion.texto === cp_null_descr){
                        css = 'cp-descr-null';
                    }else{
                        css = 'cp-descr-not-null';
                    }

                    //console.log(css)

                    return ( css );
                }


                $scope.hide = function() {
                  $mdDialog.hide();
                };

                $scope.cancel = function() {
                  $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                  $mdDialog.hide(answer);
                };


                //--
                //METODOS PRIVADOS
                //--

                function activate(){
                    /*
                    $scope.ventana = {
                        titulo: casoPruebaDataPack.ID,
                        subtitulo: casoPruebaDataPack.nombre
                    };
                    */

                    $state.go('datos-caso', {id_caso_prueba: $state.params.id_caso_prueba})  
                    //$state.current.data.caso_prueba = caso_prueba;                 
                    //$state.go('datos-caso');
                }
                
               

                

        };
        //FIN CONTROLLER

})();