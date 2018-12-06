(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .factory('procesosService', procesosService);

        procesosService.$inject = ['$localForage', '$q', '$http', '$timeout', '$filter', 'basedatosservice', 'TABLA'];
        function procesosService($localForage, $q, $http, $timeout, $filter, basedatosservice, TABLA) {

                //var lotes = ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) || [] );

                var actas = {};

                var server_config = {

                        host: 'http://localhost',
                        puerto: ':3090',
                        api: '/api/fs/', 
                        metodo: ''
                    }

                var service = {

                    cargarParams: cargarParams,
                    guardarParams: guardarParams,
                    generarArchivos: generarArchivos,
                    generarImposicion: generarImposicion,
                    cargarDetalles: cargarDetalles,
                    getArchivosDirectorio: getArchivosDirectorio,
                    getParamsActasPDF: getParamsActasPDF,
                    publicarActasPDF: publicarActasPDF,
                    /* COMIENZA API PARA PROCESOS_MASIVOS */
                    obtenerProcesosMasivos: obtenerProcesosMasivos
                };

                return ( service );


                //---
                //METODOS PUBLICOS
                //---


                function cargarParams(){
                    server_config.metodo = 'cargarParams'
                    var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    return ( basedatosservice.crudRead( consulta, true ) );
                };

                function guardarParams(){
                    server_config.metodo = 'guardarAppParams';

                    var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo);
                    var contenido = 'qeeqweqwqew';
                    basedatosservice
                        .crudCreate( contenido, consulta )
                        .then(
                            function procesarRespuesta( resData ){
                                actas.results.push(resData);
                            }
                        );
                        
                    return ( $q.when(contenido) );
                };                

                function generarArchivos( actas ){
                    
                     
                    
                    /*
                    var notif = ['Inicio proceso ...'];
                    
                    var deferred = $q.defer();
                    deferred.promise.then( null, null, angular.noop );
                    deferred.notify(notif);
                    deferred.promise
                    .then(
                        function generaArchivoSQLRemitosActas( actas ){
                            server_config.metodo = 'generaArchivoRemitosActas';
                            var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                            $q.when(basedatosservice.crudCreate( actas, consulta ))
                            .then(
                                function resolver(datos){
                                    console.log(datos)
                                    deferred.resolve(datos)
                                    //return datos;
                                }
                            )
                            return deferred.promise;
                    
                    //return ($q.promise)
                    //console.log('rtytry')

                    //return ( actas );
                   
                        },
                        null,
                        function noti(notif){
                            //console.log('Generando archivos:  SQL remitos_actas')
                            notif.push('Generando archivos:  SQL remitos_actas')
                            //deferred.resolve(actas)
                            return notif;
                        }
                    )
                    .then(
                        generaArchivoCodigosBarras,
                        null,
                        function noti(notif){
                            //console.log('Generando archivo: codigo de barras ...')
                            notif.push('Generando archivo: codigo de barras ...')
                            //deferred.resolve(actas)
                            return notif;
                        }
                    )
                    .then(
                        generaArchivosActas,
                        null,
                        function noti(notif){
                            //console.log('Generando archivos:  *.PDF;*.JPG')
                            notif.push('Generando archivos:  *.PDF;*.JPG')
                            //deferred.resolve(actas);
                            return notif;
                        }
                    )
                    .then(
                        function finProceso( datos ) {
                                    //vmr.resultados_genera_remito = datos.data;
                                    console.log(datos)
                                    deferred.resolve(datos);
                                    return ( datos );
                        }

                    )
                    .catch(function err(err){console.log(err)})
                    .finally(
                        function finProceso(){
                           //deferred.resolve(actas)
                           notif.push('PROCESO TERMINADO');
                            
                        },
                        function notificar(notif){
                            //
                        }
                    )
                    //console.log(deferred)



                    
                    
                        */
                        
                          return $q.when( actas )
                            .then( generaArchivoSQLRemitosActas ) //genera SQL para tabla remitos_actas
                            .then( generaArchivoCodigosBarras ) //genera en un archivo los codigos de barras de 56 para el campo codigo_barra de las actas personales
                            .then( generaArchivosActas ) //genera los archivos pdf (con el numero de acta) y jpg (con el codigo barras 54)
                            .then(
                                function finProceso( resultData ) {
                                    //vmr.resultados_genera_remito = datos.data;
                                    //console.log(datos)
                                    resultData = (resultData.hasOwnProperty('results'))?resultData.results:resultData;
                                    //console.log(resultData)
                                    return ( resultData );
                                }
                            );
                      
                        

                    //return ( deferred.promise );
                };


                function generarImposicion( pkg_imposicion ){

                    return $q.when( pkg_imposicion )
                        .then( generaArchivoImposicion ) //genera los archivos pdf (con el numero de acta) y jpg (con el codigo barras 54)
                        .then(
                            function finProceso( resultData ) {
                                //vmr.resultados_genera_remito = datos.data;
                                //console.log(datos)
                                resultData = (resultData.hasOwnProperty('results'))?resultData.results:resultData;
                                //console.log(resultData)
                                return ( resultData );
                            }
                        );

                };


                function cargarDetalles( id_ ){

                };

                function getArchivosDirectorio( directorio ){
                    var archivo = '';

                    

                        server_config.metodo = 'leerDirectorioLote';
                        var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        return basedatosservice
                            .crudCreateDeferred( directorio, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    return resData.data[0];
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('getArchivosDirectorio()->', notif)
                                }
                                   
                            )
                            //.catch(function err(err){console.log(err)})
                            /*.finally(
                                function finProceso( data ){
                                   //deferred.resolve(actas)
                                   //notif.push('PROCESO TERMINADO');
                                   console.log(data)
                                    
                                },
                                function notificar(notif){
                                    console.log('notify:',notif)
                                }
                            )*/
                    

                    //return ( $q.when(actas) );
                }


                function getParamsActasPDF( directorio ){
                    var archivo = '';

                    

                        server_config.metodo = 'getParamsActasPDF';
                        var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        return basedatosservice
                            .crudCreateDeferred( directorio, consulta )
                            .then(
                                function devolverParamsActasPDF( resData ){
                                    //console.log(resData)
                                    return resData.data;
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('getParamsActasPDF()->', notif);
                                }
                                   
                            )
                            //.catch(function err(err){console.log(err)})
                            /*.finally(
                                function finProceso( data ){
                                   //deferred.resolve(actas)
                                   //notif.push('PROCESO TERMINADO');
                                   console.log(data)
                                    
                                },
                                function notificar(notif){
                                    console.log('notify:',notif)
                                }
                            )*/
                    

                    //return ( $q.when(actas) );
                }


                function publicarActasPDF( actas_pdf ){
                        var archivo = '';
                        actas_pdf = $filter('json')(actas_pdf);
                        //console.log(actas_pdf);
                        //var arr_ = actas_pdf;
                        server_config.metodo = 'publicarActasPDF';
                        var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        return basedatosservice
                            .crudCreateDeferred( actas_pdf, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    //console.log(resData)
                                    return resData.data;
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('getPathActasPDF()->', notif);
                                }
                                   
                            )
                            //.catch(function err(err){console.log(err)})
                            /*.finally(
                                function finProceso( data ){
                                   //deferred.resolve(actas)
                                   //notif.push('PROCESO TERMINADO');
                                   console.log(data)
                                    
                                },
                                function notificar(notif){
                                    console.log('notify:',notif)
                                }
                            )*/
                    

                    //return ( $q.when(actas) );
                }


                function obtenerProcesosMasivos(  ){

                }


                //***
                //METODOS PRIVADOS
                //***

                //function generarArchivos

                function generaArchivoSQLRemitosActas( actas ){

                    var archivo = devolverArrayElem(actas.lst_archivos, 'SCRIPT_SQL_REMITOS');

                    if(archivo.imprime){

                        //server_config.metodo = 'fs/generaArchivoRemitosActas';
                        //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        const consulta = 'asd';
                        /*
                        basedatosservice
                            .crudCreate( actas, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    actas.results.push(resData);
                                }
                            );
                            */
                    }

                    return ( $q.when(actas) );
                   
                };


                function generaArchivoCodigosBarras( actas ){

                    var archivo_1 = devolverArrayElem(actas.lst_archivos, 'CODIGOS_DE_BARRAS');
                    var archivo_2 = devolverArrayElem(actas.lst_archivos, 'CODIGOS_DE_BARRAS_JPG');

                    if( (!archivo_1.imprime) && (!archivo_2.imprime) ){
                        return $q.when(actas);
                    }
                    
                    server_config.metodo = 'generaArchivoCodigosBarras'
                    //console.log(actas)
                    var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;

                    basedatosservice
                        .crudCreate( actas, consulta )
                        .then(
                            function procesarRespuesta( resData ){
                                for(var i=0; i<resData.length;i++){
                                    actas.results.push(resData[i]);
                                }
                                //actas.results.push(resData);
                            }
                        );
                     
                    //return basedatosservice.crudCreate( actas, consulta )
                
                     return ( $q.when(actas) );
                };


                function generaArchivosActas( actas ){

                    var archivo_jpg = devolverArrayElem(actas.lst_archivos, 'ACTAS_PAPEL_PDF');
                    var archivo_pdf = devolverArrayElem(actas.lst_archivos, 'ACTAS_PAPEL_JPG');

                    if( (archivo_jpg.imprime) || (archivo_pdf.imprime) ){

                        //var deferred = $q.defer();
                        server_config.metodo = 'generaArchivosActas'
                        var consulta = 'fs/generaArchivosActas';
                        basedatosservice
                            .crudCreate( actas, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    //actas.results.push(resData);
                                    for(var i=0; i<resData.length;i++){
                                        actas.results.push(resData[i]);
                                    }
                                }
                            );
                    }

                    return ( $q.when(actas) );//basedatosservice.crudCreate( actas, consulta )
                    
                };


                function generaArchivoImposicion( pkg_imposicion ){


                    console.log(pkg_imposicion)
                    server_config.metodo = 'generaArchivoImposicion'
                    var consulta = 'fs/generaArchivoImposicion' ;
                    basedatosservice
                        .crudCreate( pkg_imposicion, consulta )
                        .then(
                            function procesarRespuesta( resData ){
                                //actas.results.push(resData);
                                console.log(pkg_imposicion)
                                /*for(var i=0; i<resData.length;i++){
                                    actas.results.push(resData[i]);
                                }*/
                            }
                        );



                    //var archivo_jpg = devolverArrayElem(actas.lst_archivos, 'ACTAS_PAPEL_PDF');
                    //var archivo_pdf = devolverArrayElem(actas.lst_archivos, 'ACTAS_PAPEL_JPG');

                    /*
                    if( (archivo_jpg.imprime) || (archivo_pdf.imprime) ){
                        
                        console.log(actas)

                        //var deferred = $q.defer();
                        server_config.metodo = 'generaArchivosActas'
                        var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        basedatosservice
                            .crudCreate( actas, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    //actas.results.push(resData);
                                    for(var i=0; i<resData.length;i++){
                                        actas.results.push(resData[i]);
                                    }
                                }
                            );
                    }
                    */

                    return ( $q.when(pkg_imposicion) );
                    
                };


                function devolverArrayElem(array, search){

                    var result = -1;
                    
                    angular.forEach(array, 
                            function(value, key) {
                                if(value.nombre === search){
                                    result = value;
                                    return result;
                                }
                            }
                    );

                    return result;

                }
        };

})();