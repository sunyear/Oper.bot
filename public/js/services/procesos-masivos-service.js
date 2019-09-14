(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .factory('procesosMasivosService', procesosMasivosService);

        procesosMasivosService.$inject = ['$localForage', '$q', '$http', '$timeout', '$filter', 'basedatosservice', 'TABLA'];
        function procesosMasivosService($localForage, $q, $http, $timeout, $filter, basedatosservice, TABLA) {

                //var lotes = ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) || [] );

                var actas = {};

                var server_config = {

                        host: 'http://localhost',
                        puerto: ':3090',
                        api: '/api/procesos_masivos/',
                        metodo: ''
                    }

                var service = {

                    cargarParams: cargarParams,
                    guardarParams: guardarParams,
                    obtenerProcesosMasivos: obtenerProcesosMasivos,
                    obtenerProcesosMasivosLotes: obtenerProcesosMasivosLotes,
                    obtenerProcesosAutomaticos: obtenerProcesosAutomaticos,
                    guardarProcesoMasivo: guardarProcesoMasivo,
                    eliminarProcesoMasivo: eliminarProcesoMasivo



                    /*generarArchivos: generarArchivos,
                    cargarDetalles: cargarDetalles,
                    getArchivosDirectorio: getArchivosDirectorio,
                    getParamsActasPDF: getParamsActasPDF,
                    publicarActasPDF: publicarActasPDF,
                    guardarLoteValidado: guardarLoteValidado,
                    obtenerLotesValidados: obtenerLotesValidados,
                    soap: enviarSoap*/

                };

                return ( service );


                //---
                //METODOS PUBLICOS
                //---




                 function enviarSoap(){
                    var base_url = "https://tapp.santafe.gov.ar/WsLicencias/LicenciasWSService";
                    //console.log(base_url)

                 }


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



                function obtenerProcesosMasivos( str_busqueda = '' ){

                    //console.log(str_busqueda)

                    let consulta = 'procesos_masivos/vista';

                    let filtro_fecha_proceso = {
                            anio: null,//new Date().getFullYear(),
                            mes: null//new Date().getMonth() + parseInt(1))
                        }
                    

                    //console.log(filtro_fecha_proceso)
                    var json_return_data = JSON.parse('{}');
                    //var consulta = 'procesos_masivos/vista';
                    //var consulta = 'procesos_masivos/vista/' + filtro_fecha_proceso.anio + '/' + filtro_fecha_proceso.mes
                    //console.log(str_busqueda)

                   if(typeof(str_busqueda) === 'string' && (str_busqueda.indexOf(':',0) > -1)){
                        let arr_busq = str_busqueda.split(':');

                        if(arr_busq.length > 1){
                            
                            switch( arr_busq[0] ){
                                case 'l': consulta += '/lote/' + arr_busq[1]; //busca por nro_lote
                                    break;
                                case 'r': consulta += '/remito/' + arr_busq[1]; //busca por nro_remito
                                    break;
                                case 't': consulta += '/tipo/' + arr_busq[1];//busca por tipo_proceso (REPROCESO, CARGA MASIVA)
                                    break;
                            };

                        }
                    }else{

                        filtro_fecha_proceso.anio = (str_busqueda.hasOwnProperty('anio'))?str_busqueda.anio: new Date().getFullYear()
                        filtro_fecha_proceso.mes = (str_busqueda.hasOwnProperty('mes'))?str_busqueda.mes: (new Date().getMonth() + parseInt(1))
                        consulta += '/fecha_proceso/' + filtro_fecha_proceso.anio + '/' + filtro_fecha_proceso.mes

                    }
                    
                    //console.log(consulta)

                   var return_data = basedatosservice.crudRead( consulta );
                    return  $q.when ( return_data )
                            .then(
                                function ProcesosMasivos( procesos_masivos ){
                                    //console.log(procesos_masivos)
                                    var tmp_procesos_masivos = [];
                                    for (var i=0;i<procesos_masivos.length;i++){
                                        
                                        //console.log(procesos_masivos[i].lotes_norte + '|'+procesos_masivos[i].lotes_sur+'|'+(parseInt(procesos_masivos[i].lotes_sur) + parseInt(procesos_masivos[i].lotes_norte)), procesos_masivos[i].email_enviado)    
                                        tmp_procesos_masivos.push(
                                            {
                                                
                                                'id_proceso_masivo': procesos_masivos[i].id_proceso_masivo,
                                                'fecha_proceso': procesos_masivos[i].fecha_proceso,
                                                'tipo_proceso': procesos_masivos[i].tipo_proceso,
                                                'lotes_norte': procesos_masivos[i].lotes_norte,
                                                'lotes_sur': procesos_masivos[i].lotes_sur,
                                                'total_actas': procesos_masivos[i].total_actas,
                                                'cantidad_rechazos': procesos_masivos[i].cantidad_rechazos,
                                                'cantidad_no_notif': procesos_masivos[i].cantidad_no_notif,
                                                'email_enviado': ( (parseInt(procesos_masivos[i].lotes_sur) + parseInt(procesos_masivos[i].lotes_norte)) == procesos_masivos[i].email_enviado),
                                                'pend_norte': procesos_masivos[i].pend_norte,
                                                'pend_sur': procesos_masivos[i].pend_sur

                                            }
                                        );

                                    }
                                   
                                    return ( tmp_procesos_masivos );
                                }
                            )
                };


                function obtenerProcesosMasivosLotes( id_proceso_masivo ){

                    var json_return_data = JSON.parse('{}');

                    var consulta = 'procesos_masivos/' + id_proceso_masivo;
                    //console.log(id_proceso_masivo)
                    var return_data = basedatosservice.crudRead( consulta );

                    //console.log(consulta)

                    return  $q.when ( return_data )
                            .then(
                                function ProcesosMasivosLotes( proceso_masivo_lotes ){

                                    let obj_proceso_masivo_detalles = {
                                            cabecera: null,
                                            detalle: null,
                                        },
                                    
                                        obj_cab = {
                                            id_proceso_masivo: id_proceso_masivo,
                                            fecha_proceso: null,
                                            tipo_proceso: null
                                        },

                                        obj_det = {                                            
                                            id_proceso_masivo_detalle: null,
                                            actas: null,
                                            lote: null,
                                            remito: null,
                                            notificada: null,
                                            zona: null,
                                            nota: {
                                                texto: '',
                                                editar: false
                                            },
                                            colr_rech: false,
                                            colr_proc: false, 
                                            colr_email: false
                                        },
                                        arr_det = [];

                                    angular.forEach(proceso_masivo_lotes, function (registro, index){
                                        obj_cab.fecha_proceso = registro.fecha_proceso; // la vista de detalle trae este dato
                                        obj_cab.tipo_proceso = registro.tipo_proceso; // la vista de detalle trae este dato
                                        if(registro.id_proceso_masivo_detalle !== null){
                                            //console.log(registro)
                                            let obj_det = {
                                                id_proceso_masivo_detalle: registro.id_proceso_masivo_detalle,
                                                actas: registro.cantidad_actas,
                                                lote: registro.numero_lote,
                                                remito: registro.numero_remito,
                                                notificada: registro.notificada,
                                                zona: registro.zona,
                                                nota: {
                                                    texto: registro.nota || '',
                                                    editar: false
                                                    },
                                                id_tipo_envio: registro.id_tipo_envio,
                                                colr_rech: (registro.id_estado_envio < 0)?true:false,
                                                colr_proc: (registro.id_estado_envio > 0)?true:false, 
                                                colr_email: (registro.email_enviado > 0)?true:false, 
                                                }
                                            arr_det.push(obj_det)
                                            obj_det = {};
                                        }
                                    });

                                    obj_proceso_masivo_detalles.cabecera = obj_cab;
                                    obj_proceso_masivo_detalles.detalle = arr_det;

                                    //console.log(obj_proceso_masivo_detalles.detalle)

                                    return ( obj_proceso_masivo_detalles );
                                }
                            )
                };

                function obtenerProcesosAutomaticos(){

                    return $q.when ( {} );
                }


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

                function guardarLoteValidado( lote_validado ){

                    //console.log(lote_validado)

                    lote_validado.id_lote = ( new Date() ).getTime();
                    


                        const consulta = 'lotes/guardarLoteValidado'
                        basedatosservice
                            .crudCreate( lote_validado, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                     console.log(resData)
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('getPathActasPDF()->', notif);
                                }
                            );
                    

                    return ( $q.when(lote_validado) );
                };


                function obtenerLotesValidados(){

                    var json_return_data = JSON.parse('{}');

                    

                    var consulta = 'lotes/vista';
                    var return_data = basedatosservice.crudRead( consulta );
                    return  $q.when ( return_data )
                            .then(
                                function ReproduccionNota( lotes_validados ){
                                    var tmp_lotes_validados = [];
                                    for (var i=0;i<lotes_validados.length;i++){
                                        
                                        tmp_lotes_validados.push(
                                            {
                                                'metalote': lotes_validados[i].metalote,
                                                'estado_lote': lotes_validados[i].estado_lote,
                                                'fecha_validado': lotes_validados[i].fecha_validado
                                            }
                                        );

                                    }
                                   
                                    return ( tmp_lotes_validados );
                                }
                            )
                };


                /*
                > obj_datos: objeto con dos propiedades: cabecera, detalle
                >>cabecera {
                        id_proceso_masivo
                        tipo_proceso
                        fecha_proceso
                    }
                >>detalle {
                        [
                            id_proceso_masivo_detalle
                            remito
                            lote
                            actas
                            zona
                            notificada
                            id_estado_proceso
                            id_tipo_envio
                        ]
                    }
                */
                function guardarProcesoMasivo( obj_datos ){

                    const consulta = 'procesos_masivos/guardarProcesoMasivo'
                    console.log(obj_datos)
                    const res = basedatosservice.crudCreate( obj_datos, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    console.log(resData)
                                    return (resData);
                                },
                                function fail(){},
                                function notificar(notif){
                                    console.log('getPathActasPDF()->', notif);
                                }
                            )
                    return $q.when(res)
                };


                function eliminarProcesoMasivo( id_proceso_masivo ){
                    var consulta = 'procesos_masivos/eliminarProcesoMasivo/' + id_proceso_masivo;
                    return ( basedatosservice.crudDelete( consulta ) );
                };


                //***
                //METODOS PRIVADOS
                //***

                //function generarArchivos

                function generaArchivoSQLRemitosActas( actas ){

                    var archivo = devolverArrayElem(actas.lst_archivos, 'SCRIPT_SQL_REMITOS');
                    console.log(actas)

                    if(archivo.imprime){

                        server_config.metodo = 'generaArchivoRemitosActas';
                        //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        const consulta = 'fs/generaArchivoRemitosActas'
                        basedatosservice
                            .crudCreate( actas, consulta )
                            .then(
                                function procesarRespuesta( resData ){
                                    actas.results.push(resData);
                                }
                            );
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
                        
                        console.log(actas)

                        //var deferred = $q.defer();
                        server_config.metodo = 'generaArchivosActas'
                        //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                        const consulta = 'fs/generaArchivosActas'
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