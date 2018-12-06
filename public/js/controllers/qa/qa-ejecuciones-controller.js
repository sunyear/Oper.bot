(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QACPEjecucionesController', QACPEjecucionesController);
        
        QACPEjecucionesController.$inject = ['$mdLiveAnnouncer', '$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog',  '$mdToast', 'qaService', 'coreService', 'caso_reproducciones', 'PROCESOS'];
        function QACPEjecucionesController($mdLiveAnnouncer, $scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, $mdToast, qaService, coreService, caso_reproducciones, PROCESOS) {

                var notasEjecucionesDataPack = {};//angular.extend({}, $state.current.data.caso_prueba);
                var nota_ejecucion_texto_default = 'no existen notas para la ejecucion seleccionada'
                var id_caso_reproduccion_sel = 0;
                
                $scope.gridOptions = {
                    data: [],
                    urlSync: true
                };

                $scope.mostrar_reproduccion_nota = false;
                $scope.mostrar_crear_nota = false;
            
                $scope.componentes = {
                    "reproduccion_notas": {
                        "titulo": setTituloComponente(0),
                        "texto": '',//casoPruebaDataPack.nota_ejecucion || nota_ejecucion_texto_default,
                        "max_char": 150,
                        "left_chars": 0,
                        "json_data": JSON.parse('{}'),//
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "visible": false,
                        "id_caso_reproduccion_sel": 0
                    }

                }


                activate();
                

                //--
                // API PUBLICA
                //--

                $scope.crearCasoReproduccion = crearCasoReproduccion;

                $scope.seleccionarReproduccion = seleccionarReproduccion;
                $scope.editarNota = editarNota;
                $scope.cancelarEdicion = cancelarEdicion;
                $scope.mostrarReproduccionNota = mostrarReproduccionNota;
                $scope.mostrarCrearNota = mostrarCrearNota;
                $scope.guardarNota = guardarNota;
                $scope.agregarNota = agregarNota;
                $scope.borrarNota = borrarNota;
                
               
                //--
                // METODOS PUBLICOS
                //--


                function crearCasoReproduccion(){

                };


                function seleccionarReproduccion( reproduccion ){                    
                    
                    if($scope.componentes.reproduccion_notas.editar){
                        return;
                    }

                    setIDCasoReproduccion(reproduccion.item.id_caso_reproduccion);
                    setTituloComponente(reproduccion.item.id_caso_reproduccion);

                    qaService
                        .obtenerNotasReproduccion( reproduccion.item.id_caso_reproduccion )
                        .then(
                            function procesarResultados( json_data ){
                                 $scope.componentes.reproduccion_notas.json_data = json_data[0];
                                if( json_data.length > 0){//encontrado
                                    mostrarReproduccionNota();
                                }else{
                                    mostrarCrearNota();
                                }
                            },
                            function errorProceso( error ){

                            }
                        );

                };


                function setIDCasoReproduccion( id_caso_reproduccion ){
                    id_caso_reproduccion_sel = id_caso_reproduccion;
                    $scope.componentes.reproduccion_notas.id_caso_reproduccion_sel = id_caso_reproduccion_sel;
                    return ( id_caso_reproduccion_sel );
                };


                function editarNota( event ){
                    var error_code = 1;
                        if(id_caso_reproduccion_sel == 0){
                            return ( error(1, event) );
                        }else{
                            $scope.componentes.reproduccion_notas.editar = true;
                            $scope.componentes.reproduccion_notas.titulo = "(editando) " + $scope.componentes.reproduccion_notas.titulo;
                        }         
                };


                function cancelarEdicion(){
                    $scope.componentes.reproduccion_notas.editar = false;
                    $scope.componentes.reproduccion_notas.titulo = $scope.componentes.reproduccion_notas.titulo.replace('(editando) ','');
                };


                function guardarNota(){
                    
                    cancelarEdicion();

                    var registro = {
                        "id_reproduccion": id_caso_reproduccion_sel,
                        "id_reproduccion_nota": $scope.componentes.reproduccion_notas.json_data.id_reproduccion_nota,
                        "reproduccion_nota_texto": $scope.componentes.reproduccion_notas.json_data.reproduccion_nota_texto
                    };

                    qaService
                        .guardarReproduccionNota( registro )
                        .then(
                            function procesarExito ( datos ){
                                $scope.componentes.reproduccion_notas.editar = false;
                                mostrarReproduccionNota();
                            },
                            function procesarError( error ){
                                console.log(error)
                            }
                        );

                };


                function agregarNota(){

                    mostrarReproduccionNota();
                    $scope.componentes.reproduccion_notas.editar = true;

                };


                function borrarNota(){

                    qaService
                        .eliminarReproduccionNota( $scope.componentes.reproduccion_notas.json_data.id_reproduccion_nota )
                        .then(
                            function procesarExito ( datos ){
                                $scope.componentes.reproduccion_notas.editar = false;
                                mostrarCrearNota();
                            },
                            function procesarError( error ){
                                console.log(error)
                            }
                        );

                };

                
                //-- FIN METODOS PUBLICOS

                //--
                //METODOS PRIVADOS
                //--

                function activate(){
                    console.log(caso_reproducciones);
                    $scope.gridOptions.data = caso_reproducciones;
                    //$scope.componentes.notas_ejecuciones.items = [{'qweqwqweqweqw asd asd as dasd sa'}];
                    //console.log(caso_ejecuciones)

                }


                function setIDCasoReproduccion( id_caso_reproduccion ){
                    id_caso_reproduccion_sel = id_caso_reproduccion;
                };


                function setTituloComponente( id_caso_reproduccion ){
                    var str_titulo = 'Notas de reproduccion:';
                    if(id_caso_reproduccion == 0){
                        str_titulo += ' (no hay reproduccion seleccionada)';
                    }else{
                        str_titulo += id_caso_reproduccion;
                        $scope.componentes.reproduccion_notas.titulo = str_titulo;
                    }                    

                    return ( str_titulo );
                };


                function error(codigo_error, event){
                  //var pinTo = $scope.getToastPosition();

                    $mdToast.show(
                      $mdToast.simple()
                        .textContent('¡Debe seleccionar una reproduccion para editar notas')
                        .position('right')
                        .hideDelay(200)
                    );
                  };


                function mostrarCrearNota(  ){
                    $scope.mostrar_crear_nota = true;
                    $scope.mostrar_reproduccion_nota = false;
                };


                function mostrarReproduccionNota( ){
                   
                    $scope.mostrar_reproduccion_nota = true;
                    $scope.mostrar_crear_nota = false;

                };

        };
        //FIN CONTROLLER

})();