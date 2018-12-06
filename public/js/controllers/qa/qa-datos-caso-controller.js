(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('QACPDatosController', QACPDatosController);
        
        QACPDatosController.$inject = ['$mdLiveAnnouncer', '$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'qaService', 'coreService', 'PROCESOS'];
        function QACPDatosController($mdLiveAnnouncer, $scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, qaService, coreService, PROCESOS) {

                //$scope.caso_prueba = caso_prueba;


                if($state.params.id_caso_prueba === null){
                    $state.go('qa.casos-prueba')
                }

                $scope.caso_prueba_dialog = this.caso_prueba;

                //
                let casoPruebaDataPack =  {};
                //console.log(casoPruebaDataPack)
                var cp_null_descr = 'click aqui para insertar una descripcion';

                $scope.lstPrecondicion = {};

                $scope.ventana = {
                    titulo: '',//casoPruebaDataPack.ID,
                    subtitulo: '',//casoPruebaDataPack.nombre
                };

                $scope.componentes = {
                    "titulo": '',
                    "id_estado_caso": 2,
                    "precondiciones": {
                        "items": '',//JSON.parse(JSON.stringify(casoPruebaDataPack.precondiciones)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    },
                    "pasos": {
                        "items": '',//JSON.parse(JSON.stringify(casoPruebaDataPack.pasos)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    },
                    "resultados_esperados": {
                        "items": '',//JSON.parse(JSON.stringify(casoPruebaDataPack.resultados_esperados)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    },
                    descripcion: {
                        texto: casoPruebaDataPack.descripcion || cp_null_descr,
                        editar: false,
                        max_char: 150,
                        left_chars: 0
                    }

                }

                $scope.precondiciones_tmp = {
                    //'precondicion': null
                };

                $scope.edicion = {
                    'precondicion': false,
                    'escenario': false,
                    'resultado_esperado': false
                }


                $scope.gridOptions = {
                    data: [],
                    urlSync: true
                };  


                


                activate(QACPDatosController);
                

                //--
                // API PUBLICA
                //--

                $scope.agregarRequisito = agregarRequisito;
                $scope.soapTest = soapTest;
                $scope.aceptarEdicion = aceptarEdicionItem;
                $scope.nuevaPrecondicion = nuevaPrecondicion;
                $scope.nuevoResultado = nuevoResultado;
                $scope.setCssClassDescr = setCssClassDescr;
                $scope.setAlignDescr = setAlignDescr;
                $scope.editarDescripcion = editarDescripcion;
                $scope.calcularCaracteresDisponibles = calcularCaracteresDisponibles;
                
                //-- API COMPONENTES (listas)
                $scope.crearItem = crearItem;
                $scope.editarItem = editarItem;
                $scope.actualizarItem = actualizarItem;
                $scope.obtenerItem = obtenerItem;
                $scope.borrarItem = borrarItem;
                $scope.cancelarEdicionItem = cancelarEdicionItem;
                //-- fin api


                $scope.borrarPrecondicion = borrarPrecondicion;
                $scope.borrarResultado = borrarResultado;
                $scope.esCuadroDialogo = esCuadroDialogo;
                //$scope.formPrecondiciones.precondicionValue = precondicionValue;

                //--
                // METODOS PUBLICOS
                //--

                function calcularCaracteresDisponibles( event ){
                    //console.log('ads')
                   // if($scope.componentes.descripcion.hasOwnProperty('texto')){
                        //console.log($scope.componentes.descripcion)
                        var c_caracteres = $scope.componentes.descripcion.texto.length;
                        var disponible = parseInt($scope.componentes.descripcion.max_char) - parseInt(c_caracteres);
                        $scope.componentes.descripcion.left_chars = disponible;

                    //}
                    

                    //console.log(c_caracteres)
                }

                function editarDescripcion(){

                    $scope.componentes.descripcion.editar = true;
                    if($scope.componentes.descripcion.texto === cp_null_descr){
                        $scope.componentes.descripcion.texto = '';
                    }
                    calcularCaracteresDisponibles();
                    coreService.focus('focusMe');

                }

                function setAlignDescr( ){
                    var layout_align = '';

                    if($scope.componentes.descripcion.texto === cp_null_descr){
                        layout_align = 'center center';
                    }

                    return ( layout_align );
                }


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


                function precondicionValue(  ){
                    console.log('qeqs')
                }


                function soapTest(){
                    qaService.soapTest();
                }
                


                function borrarPrecondicion( id_precondicion ){
                    //$scope.listas.lst_precondicion.item[id_precondicion]
                    $scope.listas.lst_precondicion["editar"] = false;
                    $scope.listas.lst_precondicion["editar_item_nuevo"] = false;
                    $scope.listas.lst_precondicion.item[$scope.listas.lst_precondicion["editar_item"]].editar = false;

                    $scope.caso_prueba.precondiciones.splice(id_precondicion, 1);

                    $scope.listas.lst_precondicion.item[id_precondicion] = undefined;
                    $scope.listas.lst_precondicion = JSON.parse(JSON.stringify($scope.listas.lst_precondicion));
                }


                function borrarResultado( id_resultado ){
                    //$scope.listas.lst_precondicion.item[id_precondicion]
                    $scope.listas.lst_resultado_esperado["editar"] = false;
                    $scope.listas.lst_resultado_esperado.item[$scope.listas.lst_resultado_esperado["editar_item"]].editar = false;
                    $scope.caso_prueba.resultado_esperado.splice(id_resultado, 1);

                    $scope.listas.lst_resultado_esperado.item[id_resultado] = undefined;
                    $scope.listas.lst_resultado_esperado = JSON.parse(JSON.stringify($scope.listas.lst_resultado_esperado));
                }


                function crearItem( componente ){

                    //console.log($scope.componentes)

                    var txt_nuevo = '';
                    
                    //$scope.componentes[componente].items.push(txt_nuevo);
                    $scope.componentes[componente].items.push(txt_nuevo);
                    //console.log($scope.componentes);
                    //console.log($scope.caso_prueba.precondiciones.length)
                    var index =  $scope.componentes[componente].items.length-1;
                    editarItem(componente, index, true)
                    
                }

                function editarItem( componente, item, nuevo ){
                    console.log($scope.componentes[componente])
                    
                    //$scope.componentes[componente].items[item]["editar"] = true;
                    $scope.componentes[componente].editar = true;
                    $scope.componentes[componente].editar_index = item;
                    
                    if(nuevo){
                        $scope.componentes[componente].editar_item_nuevo = true;
                    }else{
                        $scope.componentes[componente].editar_item_nuevo = false;
                    }
                    
                    coreService.focus('focusPrecondicion');
                    //console.log($scope.componentes)

                    /*
                    $scope.listas[tabla].item[id_registro]["editar"] = true;
                    if(nuevo){
                        $scope.listas[tabla]["editar_item_nuevo"] = true;
                    }else{
                        $scope.listas[tabla]["editar_item_nuevo"] = false;
                    }
                    */
                }



                function actualizarItem( componente, item ){
                    //console.log($scope.caso_prueba.precondiciones[$scope.componentes[componente].editar_index])
                    //$scope.caso_prueba.precondiciones[$scope.componentes[componente].editar_index] = $scope.componentes[componente].items[$scope.componentes[componente].editar_index];
                    
                    //casoPruebaDataPack[componente] = angular.copy($scope.componentes[componente].items);
                    casoPruebaDataPack[componente][$scope.componentes[componente].editar_index] = $scope.componentes[componente].items[$scope.componentes[componente].editar_index];
                    $scope.componentes[componente].editar_item_nuevo = false;
                    cancelarEdicionItem(componente, false)
                }


                function obtenerItem(){

                }


                function borrarItem( componente, nuevo){


                    
                    
                    //$scope.componentes[componente].items[$scope.componentes[componente].editar_index] = undefined;
                    //delete $scope.componentes[componente].items[$scope.componentes[componente].editar_index];
                    
                    //casoPruebaDataPack[componente][$scope.componentes[componente].editar_index] = undefined;
                    casoPruebaDataPack[componente].splice($scope.componentes[componente].editar_index, 1);
                    //console.log($scope.componentes[componente].editar_index)
                    $scope.componentes[componente].items.splice($scope.componentes[componente].editar_index, 1);
                    //casoPruebaDataPack[componente][$scope.componentes[componente].editar_index] = undefined;
                    //$scope.componentes[componente].items[$scope.componentes[componente].editar_index] = undefined;
                    

                   

                    

                    //$scope.componentes[componente].items = [];//casoPruebaDataPack[componente];
                        
                    
                    //console.log(casoPruebaDataPack)
                    //console.log($scope.componentes[componente])
                    if(!nuevo) cancelarEdicionItem( componente, false);
                    //$scope.listas.lst_precondicion.item[id_precondicion] = undefined;
                    

                }


                function aceptarEdicionItem( lista ){
                    $scope.listas[lista]["editar"] = false;
                    $scope.listas[lista].item[$scope.listas[lista]["editar_item"]].editar = false;
                    if($scope.listas[lista]["editar_item_nuevo"]){
                        $scope.listas[lista]["editar_item_nuevo"] = false;
                    }
                }


                function cancelarEdicionItem( componente, borrar_item){

                    //$scope.componentes[componente].items[$scope.componentes[componente].editar_index] = casoPruebaDataPack.precondiciones[$scope.componentes[componente].editar_index];
                    

                    if($scope.componentes[componente].editar_item_nuevo){
                        borrarItem(componente, true);
                    }else if(borrar_item){
                        $scope.componentes[componente].items[$scope.componentes[componente].editar_index] = casoPruebaDataPack[componente][$scope.componentes[componente].editar_index];
                    }


                    
                    $scope.componentes[componente].editar_item_nuevo = false;
                    $scope.componentes[componente].editar_index = null;
                    $scope.componentes[componente].editar = false;
                    

                    

                    
                }



                function nuevaPrecondicion(  ){
                    
                    //console.log($scope.listas.lst_precondicion)
                    var index = 0;// ($scope.listas.lst_precondicion.item === undefined) ? 0 :Object.keys($scope.listas.lst_precondicion.item).length;
                    //console.log(Object.keys($scope.listas.lst_precondicion.item).length)   
                    /* Se crean nuevos indices en los arrays de datos y de flags */
                    //console.log(Object.keys($scope.listas.lst_precondicion.item).length)

                    //console.log($scope.listas.lst_precondicion)

                    
                    console.log($scope.listas.lst_precondicion)
                    //console.log($scope.listas.lst_precondicion.item)
                    
                    if($scope.listas.lst_precondicion.item === undefined){
                        //quiere decir que no habia precondiciones en la DB y se esta creando la primera
                        $scope.listas.lst_precondicion['item'] = {};
                        $scope.listas.lst_precondicion.item[index] = {};
                    }else{
                        index = Object.keys($scope.listas.lst_precondicion.item).length;
                        console.log($scope.listas.lst_precondicion.item)
                        console.log(Object.keys($scope.listas.lst_precondicion.item).length)
                        $scope.listas.lst_precondicion.item[index] = {};
                        //index_new --;
                    }

                    $scope.caso_prueba.precondiciones.push('');
                    //console.log(typeof($scope.listas.lst_precondicion))

                    //$scope.listas.lst_precondicion.item[index]["editar"] = true;
                    //$scope.listas.lst_precondicion.item[index]["visible"] = true;
                    //index;

                    /* Se setean los nuevos indices */
                    //$scope.listas.lst_precondicion["editar"] = true;
                    //$scope.listas.lst_precondicion["editar_item"] = index;

                    /* Se edita la nueva entrada en la lista de Precondiciones */
                    
                    editarRegistro('lst_precondicion', index, true)

                }


                function nuevoResultado(  ){

                    /* Se crean nuevos indices en los arrays de datos y de flags */
                    $scope.caso_prueba.resultado_esperado.push('');
                    $scope.listas.lst_resultado_esperado.item[Object.keys($scope.listas.lst_resultado_esperado.item).length] = {};
                    
                    /* Se setean los nuevos indices */
                    $scope.listas.lst_resultado_esperado["editar"] = true;
                    $scope.listas.lst_resultado_esperado["editar_item"] = Object.keys($scope.listas.lst_resultado_esperado.item).length -1;

                    /* Se edita la nueva entrada en la lista de resultado esperado */
                    editarRegistro( 'lst_resultado_esperado', (Object.keys($scope.listas.lst_resultado_esperado.item).length -1) )

                }

                function agregarRequisito(){

                }

                $scope.btn_modal = {
                    aceptar:{
                                txt_button: 'ACEPTAR',
                                css_style: 'md-primary md-raised'
                            },
                    cancelar:{
                                txt_button: 'CANCELAR',
                                css_style: 'md-warn md-raised'
                            }
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


                //--
                //METODOS PRIVADOS
                //--

                function activate(QACPDatosController){
                    calcularCaracteresDisponibles();
                    //console.log(typeof(casoPruebaDataPack))
                   
                    getCasoPrueba(QACPDatosController);
                    
                    //console.log(casoPruebaDataPack.precondiciones)

                    console.log(casoPruebaDataPack)
                     //$scope.gridOptions.data = JSON.parse(JSON.stringify(casoPruebaDataPack.precondiciones));

                    //$state.go('datos-caso');

                }
                
                $scope.$watch('componentes.descripcion.texto', function(newValue, oldValue) {
                    calcularCaracteresDisponibles();
                    if($scope.componentes.descripcion.left_chars === -1){
                        $scope.componentes.descripcion.texto = oldValue;
                        return oldValue;
                    }
                });


                function getCasoPrueba( QACPDatosController ){

                    var id = null;

                    /*console.log(esCuadroDialogo())

                    if((typeof($scope.caso_prueba_dialog) !== 'undefined')){
                        id =  $scope.caso_prueba_dialog.id_caso_prueba;
                        $scope.componentes.id_estado_caso =  $scope.caso_prueba_dialog.id_estado_caso_prueba; //se le pasa el estado del caso desde el cuadro de dialogo; no se informa estado desde el abm de casos de prueba
                    }else{
                        id = $state.params.id_caso_prueba;
                    }
                    */

                    id = (esCuadroDialogo())?$scope.caso_prueba_dialog.id_caso_prueba:$state.params.id_caso_prueba;
                    $scope.componentes.id_estado_caso = (esCuadroDialogo())?$scope.caso_prueba_dialog.id_estado_caso_prueba:null;

                    let caso_prueba = qaService.getCasoPrueba( id )
                    
                    caso_prueba.then(
                        (datos_caso) => setCasoPruebaComponents(datos_caso),//angular.copy(datos_caso, casoPruebaDataPack),//this.setViewModelData(val),//this.config_app_params.push(val),
                        (err) => console.log(err)
                    ); 
                };


                function setCasoPruebaComponents( datos_caso ){
                    console.log(datos_caso)

                    angular.extend(casoPruebaDataPack, datos_caso);

                    //angular.extend($scope.casoPruebaDataPack.precondiciones, datos_caso.precondiciones)
                    //angular.extend($scope.casoPruebaDataPack.pasos, datos_caso.pasos)
                    //angular.extend($scope.casoPruebaDataPack.resultados_esperados, datos_caso.resultados_esperados)
                    
                    $scope.componentes.titulo = JSON.parse(JSON.stringify(casoPruebaDataPack.nombre))

                    $scope.componentes.precondiciones.items = JSON.parse(JSON.stringify(casoPruebaDataPack.precondiciones))
                    $scope.componentes.pasos.items = JSON.parse(JSON.stringify(casoPruebaDataPack.pasos))
                    $scope.componentes.resultados_esperados.items = JSON.parse(JSON.stringify(casoPruebaDataPack.resultados_esperados))
                };


                function esCuadroDialogo(){

                    const esDialogo = (typeof($scope.caso_prueba_dialog) !== 'undefined');

                    return esDialogo;

                };

                

        };
        //FIN CONTROLLER

})();