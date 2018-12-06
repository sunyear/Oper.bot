(function() {
  'use strict';

  class QACasosUsosFormController {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope, caso_uso, $log, $q, $timeout, coreService) {

        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;
        this._$log = $log;
        this._$q = $q;
        this._$timeout = $timeout;
        this._coreService = coreService;


        this.mostrar_btn_agregar_cp = true;



        /*
        this.casos_prueba_asociados = {
          
          data: [],
          obtenerCasosPrueba: function(){},
          obtenerCasoPrueba: function(){},
          agregarCasoPrueba: function(){},
          elimninarCasoPrueba: function(){},
        };
        */

        this.caso_uso = caso_uso;
        this.casos_pruebas = this.obtenerCasosPrueba;

        console.log(this.caso_uso)


        this.componentes = {
                    "precondiciones": {
                        "items": [],//JSON.parse(JSON.stringify(casoPruebaDataPack.precondiciones)),
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
                        "items": [],//JSON.parse(JSON.stringify(casoPruebaDataPack.resultados_esperados)),
                        "editar": false,
                        "editar_index": null,
                        "editar_item_nuevo": false,
                        "item_visible": null,
                    }

                }

                this.precondiciones_tmp = {
                    //'precondicion': null
                };



         this.gridOptions = {
          data: JSON.parse(JSON.stringify(this.caso_uso[0].casos_prueba)),//this.caso_reproducciones,
          urlSync: true
        };


        this.simulateQuery = true;
    this.isDisabled    = false;

    // list of `state` value/display objects
    this.states        = this.loadAll;
    this.querySearch   = this.querySearch;
    this.selectedItemChange = this.selectedItemChange;
    this.searchTextChange   = this.searchTextChange;

    this.newState = this.newState;



//    console.log(this.casos_prueba_asociados.obtenerCaso())

    }; //FIN CONSTRUCTOR


    //---
    //METODOS PUBLICOS
    //---


    //-- API COMPONENTES (listas)
    crearItem( componente ){

      let txt_nuevo = '';
                    

      console.log(this.componentes, componente)
      //$scope.componentes[componente].items.push(txt_nuevo);
      this.componentes[componente].items.push(txt_nuevo);
      //console.log($scope.componentes);
      //console.log($scope.caso_prueba.precondiciones.length)
      let index =  this.componentes[componente].items.length-1;
      this.editarItem(componente, index, true)

    };


    editarItem( componente, item, nuevo ){

      console.log(this.componentes[componente])
                    
                    //$scope.componentes[componente].items[item]["editar"] = true;
                    this.componentes[componente].editar = true;
                    this.componentes[componente].editar_index = item;
                    
                    if(nuevo){
                        this.componentes[componente].editar_item_nuevo = true;
                    }else{
                        this.componentes[componente].editar_item_nuevo = false;
                    }
                    
                    this._coreService.focus('focusPrecondicion');

    };


    actualizarItem( componente, item ){

      //casoPruebaDataPack[componente][$scope.componentes[componente].editar_index] = $scope.componentes[componente].items[$scope.componentes[componente].editar_index];
      this.componentes[componente].editar_item_nuevo = false;
      this.cancelarEdicionItem(componente, false)

    };


    obtenerItem(){

    };


    nuevaPrecondicion(  ){
                    
                    //console.log($scope.listas.lst_precondicion)
                    var index = 0;// ($scope.listas.lst_precondicion.item === undefined) ? 0 :Object.keys($scope.listas.lst_precondicion.item).length;
                    //console.log(Object.keys($scope.listas.lst_precondicion.item).length)   
                    /* Se crean nuevos indices en los arrays de datos y de flags */
                    //console.log(Object.keys($scope.listas.lst_precondicion.item).length)

                    //console.log($scope.listas.lst_precondicion)

                    
                    console.log(this.listas.lst_precondicion)
                    //console.log($scope.listas.lst_precondicion.item)
                    
                    if(this.listas.lst_precondicion.item === undefined){
                        //quiere decir que no habia precondiciones en la DB y se esta creando la primera
                        this.listas.lst_precondicion['item'] = {};
                        this.listas.lst_precondicion.item[index] = {};
                    }else{
                        index = Object.keys(this.listas.lst_precondicion.item).length;
                        //console.log($scope.listas.lst_precondicion.item)
                        //console.log(Object.keys($scope.listas.lst_precondicion.item).length)
                        this.listas.lst_precondicion.item[index] = {};
                        //index_new --;
                    }

                    this.caso_prueba.precondiciones.push('');
                    //console.log(typeof($scope.listas.lst_precondicion))

                    //$scope.listas.lst_precondicion.item[index]["editar"] = true;
                    //$scope.listas.lst_precondicion.item[index]["visible"] = true;
                    //index;

                    /* Se setean los nuevos indices */
                    //$scope.listas.lst_precondicion["editar"] = true;
                    //$scope.listas.lst_precondicion["editar_item"] = index;

                    /* Se edita la nueva entrada en la lista de Precondiciones */
                    
                    this.editarRegistro('lst_precondicion', index, true)

                }


    borrarItem( componente, nuevo ){
      //casoPruebaDataPack[componente].splice($scope.componentes[componente].editar_index, 1);
                    //console.log($scope.componentes[componente].editar_index)
                  this.componentes[componente].items.splice(this.componentes[componente].editar_index, 1);
                    //casoPruebaDataPack[componente][$scope.componentes[componente].editar_index] = undefined;
                    //$scope.componentes[componente].items[$scope.componentes[componente].editar_index] = undefined;
                    

                   

                    

                    //$scope.componentes[componente].items = [];//casoPruebaDataPack[componente];
                        
                    
                    //console.log(casoPruebaDataPack)
                    //console.log($scope.componentes[componente])
                    if(!nuevo) this.cancelarEdicionItem( componente, false);
    };


    aceptarEdicionItem( lista ){
                    this.listas[lista]["editar"] = false;
                    this.listas[lista].item[this.listas[lista]["editar_item"]].editar = false;
                    if(this.listas[lista]["editar_item_nuevo"]){
                        this.listas[lista]["editar_item_nuevo"] = false;
                    }
                }


    cancelarEdicionItem( componente, borrar_item ){
      if(this.componentes[componente].editar_item_nuevo){
                        this.borrarItem(componente, true);
                    }else if(borrar_item){
                        this.componentes[componente].items[this.componentes[componente].editar_index] = []
                    }


                    
                    this.componentes[componente].editar_item_nuevo = false;
                    this.componentes[componente].editar_index = null;
                    this.componentes[componente].editar = false;
    };


    agregarCasoPrueba(){

    };


    mostrarTblCasosPrueba(  ){
        //let mostrar = false;

        return ( false )
    };

    newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    querySearch (query) {
      var results = query ? this.states.filter( this.createFilterFor(query) ) : this.states,
          deferred;
      if (this.simulateQuery) {
        deferred = this._$q.defer();
        deferred.resolve( results );
        //this._$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    searchTextChange(text) {
      this._$log.info('Text changed to ' + text);
    }

    selectedItemChange(item) {
      this._$log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    loadAll() {
      /*
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
      */

        let b = this._qaService.obtenerCasosPrueba();
        //console.log(b)

        var arr = [];

        b.then(
            function sucess( casos_prueba ){
                //console.log(casos_prueba)

                angular.forEach(casos_prueba, function(value, index){
                    //console.log(value, index)
                    var id_caso_prueba = casos_prueba[index].ID;
                    var nombre = casos_prueba[index].nombre;
                    arr.push({
                        value: nombre.toLowerCase(),
                        display: nombre
                    })
                });
            },
            function error( err){
                console.log(err)
            }
        )

        //console.log(arr)
        return ( arr )

    }

    /**
     * Create filter function for a query string
     */
    createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) !== -1);
      };

    }


    //---
    //METODOS PRIVADOS
    //---


}; //FIN CLASE

QACasosUsosFormController.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope', 'caso_uso', '$log', '$q', '$timeout', 'coreService'];
  angular
    .module('lotes.lote')
    .controller('QACasosUsosFormController', QACasosUsosFormController);
}());