(function(){
  'use strict';

  angular
    .module('lotes.main')
    .service('basedatosservice', basedatosservice);
    

        basedatosservice.$inject = ['$localForage', '$q', '$http','$timeout'];
        function basedatosservice($localForage, $q, $http,$timeout) {

                var sv_ = this;

                var server_config = {

                        host: 'http://localhost',
                        puerto: ':3090',
                        api: '/api/'

                    }


                sv_.url_server = generarUrlServer();



                var service = {

                    //metodos localForage
                    cargarDatosTabla: cargarDatosTabla,
                    obtenerItems: obtenerItems,
                    obtenerItem: obtenerItem,
                    obtenerMaxId: obtenerMaxId,
                    setearItem: setearItem,
                    eliminarItem: eliminarItem,
                    borrarDB: borrarDB,
                    //metodos CRUD (CREATE READ UPDATE DELETE)
                    crudRead: crudRead,
                    crudCreate: crudCreate,
                    crudUpdate: crudUpdate,
                    crudDelete: crudDelete,
                    crudCreateDeferred: crudCreateDeferred
                    //http://localhost:3090/api/todos/
                    



                };

                return ( service );


                //---
                // METODOS PUBLICOS
                //---
                

                function cargarDatosTabla( tabla ){

                    var datosTabla = [];

                    return $localForage
                        .iterate( 
                            function buscarTabla(value, key, iterationNumber){
                                var tablaDB = key.substr(0,key.lastIndexOf('_')+1);
                                if(tabla == tablaDB){

                                    $q.when( datosTabla.push( value ) );                                
                                }
                                //return datosTabla;
                            } 
                        )
                        .then( 
                            function devolverDatosTabla(data){
                                //console.log(datosTabla)
                                //return( angular.extend( {}, datosTabla ) );
                                return ( $q.when(datosTabla) );
                            }
                        );
                            

                    //return( angular.extend( {}, angular.fromJson( data ) ) );

                }

                function obtenerItems( clave ){

                //console.log(clave)

                var arrDatos = [];
                    var q = $q.defer();

                    $localForage
                    .iterate(
                        function(value, key, iterationNumber) {                        

                            var nombreTablaDB = key.substr(0,key.lastIndexOf('_')+1);
                            //console.log(nombreTablaDB, clave)
                            //if(typeof(clave.test)=='function'){
                                console.log(nombreTablaDB + ':' + clave)
                                if (nombreTablaDB == clave) {

                                    arrDatos.push(value);
                                }
                           // }
                        }
                    ).then(
                        function() {
                            //console.log(arrDatos)
                            q.resolve(arrDatos);
                        }, 
                        function(err) {
                            arrDatos = [];
                            q.reject(err);
                        }
                    );

                    //console.log(q.promise)

                    return ( q.promise );
                }



                function obtenerItem( clave ){

                    //console.log(clave)
                    
                    var defered = $q.defer();
                    var promise = defered.promise;

                    localforage
                    .getItem(clave)
                    .then(
                        function(value) {
                            //console.log(value)
                            defered.resolve(value);
                        }
                    ).catch(
                        function(err) {
                            defered.reject(err);
                        }
                    );

                    return ( promise );
                }

                function obtenerMaxId( params ){

                    var defered = $q.defer(),
                        promise = defered.promise,
                        tabla = params.tabla,
                        id = params.id,
                        regex = new RegExp( tabla + id, "i"),
                        id_base = 1;

                        console.log(params)

                    //var q = $q.defer();
                    $localForage
                        .iterate(
                            function(value, key, iterationNumber) {

                                if (regex.test(key) && (key.indexOf('NaN') == -1 ) ) {

                                    id_base = parseInt( key.substr(key.lastIndexOf('_')+1) ) + 1;
                                   
                                } 
                            
                            }
                        )
                        .then(
                            function exito() {
                                var idRegistro = 'hist_' + id + '_' + id_base;
                                console.log(idRegistro)
                                defered.resolve( idRegistro );
                            }, 
                            function error(error) {
                                defered.reject(error);
                            }//,
                            //function notify(notify){}
                        );

                        return ($q.when( promise ))
                };

                function setearItem( clave, registro ){

                    var defered = $q.defer();
                    var promise = defered.promise;
                    
                    $localForage
                    .setItem(clave, registro)
                        .then(
                            function() {
                                var exito = true;
                                defered.resolve(exito)
                            }, 
                            function(err) {
                                console.log(err);
                                defered.reject(err)
                            }
                        );
                    return ( promise );
                }

                function eliminarItem( clave ){

                    var defered = $q.defer();
                    var promise = defered.promise;

                    $localForage
                        .removeItem( clave )
                        .then(
                            function() {
                                defered.resolve(true)
                            }
                        )
                        .catch(
                            function(err) {

                            }
                        );

                    return ( promise );
                }

                function borrarDB(){

                    return $localForage
                        .clear()
                        .then(
                            function() {

                                return $q.when( true );
                            //obtenerLibrosDeseados();
                        }).catch(function(err) {
                            // This code runs if there were any errors
                            console.log(err);
                        });
                    
                }

                //---
                //METODOS PUBLICOS CRUD PARA POSTGRESQL
                //---


                //SELECT
                // url_conn_completa => si es undefined o false entonces se toma la configuracion de esta clase
                // en ese caso, el parametro /consulta/ NO DEBE CONTENER LOS DATOS DE CONECCION, SOLO LA API REFERENCIADA
                // ej: consulta = 'qa/metodo' => url_conn_completa = undefined o url_conn_completa = FALSE
                // ej: consulta = 'localhost://XXX.XXX/api/qa/' => url_conn_completa = TRUE
                function crudRead( consulta, url_conn_completa ){

                    var url_consulta = '';

                    url_consulta = (url_conn_completa == true)?consulta:sv_.url_server + consulta;
                    //var url_server
                    //url_consulta = sv_.url_server + consulta;

                    //console.log(url_consulta, url_conn_completa)

                    if(typeof(tabla)=='undefined'){
                        //console.log(url_consulta);
                    }
                    var deferred = $q.defer();
                    $timeout(function() {
                        $http
                            .get(url_consulta)
                            .success(
                                function(data) {
                                    //console.log(data)
                                    deferred.resolve(data);
                                }
                            )
                            .error(
                                function(reason) {
                                    deferred.reject(reason);
                                }
                            );
                        }
                    , 500);

                    

                    return ( deferred.promise )
                };

                //INSERT INTO
                function crudCreate( data, url_conn ){
                    var deferred = $q.defer();

                    var url_consulta = '';

                    url_consulta = sv_.url_server + url_conn;
                    //console.log(url_conn, url_consulta)
                    $http.post(url_consulta, data)
                    .success(
                        function(data) {
                            //console.log(data)
                            deferred.resolve(data);
                        }
                    )
                    .error(function(reason) {
                        deferred.reject(reason);
                    });
                    return ( deferred.promise );
                };

                //UPDATE
                function crudUpdate( con_url, registro ){
                    var deferred = $q.defer();

                    var consulta_basica = 'todos';

                    var url_consulta = (typeof(con_url) != 'undefined')?con_url:'http://localhost:3090/api/todos/';
                   // console.log(url_consulta)
                    $http.put(sv_.url_server + url_consulta, registro)
                    .success(
                        function(data) {
                            //console.log(data)
                            deferred.resolve(data);
                        }
                    )
                    .error(function(reason) {
                        deferred.reject(reason);
                    });
                    return ( deferred.promise );
                };

                //DELETE
                function crudDelete( con_url, registro ){
                    var deferred = $q.defer();

                    var consulta_basica = 'todos';

                    var url_consulta = (typeof(con_url) != 'undefined')?con_url:'http://localhost:3090/api/todos/';
                    //console.log(sv_.url_server + url_consulta)
                    $http.delete(sv_.url_server + url_consulta)
                        .success(
                            function(data) {
                                
                                deferred.resolve(data);
                                //return ( $q.when( data ) );
                            }
                        )
                        .error(function(reason) {
                            deferred.reject(reason);
                        });
                    return ( deferred.promise );
                };


                //INSERT INTO
                function crudCreateDeferred( data, con_url ){
                    var deferred = $q.defer();

                    var consulta_basica = 'todos';

                    var url_consulta = (typeof(con_url) != 'undefined')?con_url:'http://localhost:3090/api/todos/';
                    //console.log(url_consulta)
                    $timeout(function() {
                      deferred.notify('crudCreateDeferred()-> In progress')}
                    , 0)

                    //$http( {method: 'POST', url: url_consulta, data: data} )
                    $http.post(url_consulta, data)  
                        .then(
                            function success( data ){
                                //console.log(data)
                                return deferred.resolve(data)
                            },
                            function errorCall( err ){},
                            function notify( notif ){
                                $timeout(function() {
                      deferred.notify('crudCreateDeferred()-> progressing')}
                    , 0)
                            }
                        )

                    /*$http.post(url_consulta, data)
                    .success(
                        function(data) {
                            //console.log(data)
                            deferred.resolve(data);
                        }
                    )
                    .error(function(reason) {
                        deferred.reject(reason);
                    });*/

                    return ( deferred.promise );
                };

                //---
                //METODOS PRIVADOS CRUD
                //---

                 function generarUrlServer(  ){
                    return ( (server_config.host+server_config.puerto+server_config.api) )
                 };

        };

})();

