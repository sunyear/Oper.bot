(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .factory('qaService', qaService);

        qaService.$inject = ['$localForage', '$q', '$http', '$timeout', 'basedatosservice', 'TABLA'];
        function qaService($localForage, $q, $http, $timeout, basedatosservice, TABLA) {

                //var lotes = ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) || [] );

                var tickets = [
                    {
                        "numero_ticket": '003309654',
                        "titulo_ticket": '[Calidad] Recalcular las tolerancias en Calidad',
                        "fecha_ticket": '22/02/2017',
                        "version_ticket": '2.9.1',
                        "subversion_ticket": 'RC4',
                        "link_mantis": ''
                    },
                    {
                        "numero_ticket": '003309654',
                        "titulo_ticket": '[Calidad] Recalcular las tolerancias en Calidad',
                        "fecha_ticket": '22/02/2017',
                        "version_ticket": '2.9.2',
                        "subversion_ticket": 'RC4',
                        "link_mantis": ''
                    },
                    {
                        "numero_ticket": '003309654',
                        "titulo_ticket": '[Calidad] Recalcular las tolerancias en Calidad',
                        "fecha_ticket": '22/02/2017',
                        "version_ticket": '2.9.1',
                        "subversion_ticket": 'RC5',
                        "link_mantis": ''
                    },
                    {
                        "numero_ticket": '003309654',
                        "titulo_ticket": '[Calidad] Recalcular las tolerancias en Calidad',
                        "fecha_ticket": '22/02/2017',
                        "version_ticket": '2.9.2',
                        "subversion_ticket": 'RC5',
                        "link_mantis": ''
                    }
                ];


                var casos_prueba = [
                    {
                        "ID": 'CP-001',
                        "nombre": 'Preprocesar archivo de interfaz [actas personales notificadas]',
                        "funcionalidades": ['ConsultarArchivos','AgregarArchivo','ProcesarArchivo'],
                        "precondiciones": ["operador con permisos[consultar_archivos, procesar_archivos]", "archivo csv actas personales notificadas"],
                        "etiquetas": ['CU-115','CU-101'],
                        "descripcion": '',
                        "resultado_esperado": [],
                        "observaciones": "",
                        "pack_datos": {},
                        "ticket_mantis": []
                    },
                    {
                        "ID": 'CP-002',
                        "nombre": '[Calidad] Verificar',
                        "funcionalidades": ['ConsultarArchivos','AgregarArchivo','ProcesarArchivo'],
                        "precondiciones": ["operador con permisos[consultar_archivos, procesar_archivos]", "archivo csv actas personales notificadas"],
                        "etiquetas": [['CU-115','CU-101'], []],
                        "descripcion": '',
                        "resultado_esperado": [],
                        "observaciones": "",
                        "pack_datos": {},
                        "ticket_mantis": []
                    },
                ];


                var escenarios = [
                    {
                        "ID": '12',
                        "nombre": 'Prueba de tipos documento',
                        "casos_uso": '',
                        "tickets": '',
                        'estado': 'EN EJECUCION'
                    },
                    {
                        "ID": '12',
                        "nombre": 'Prueba de numeros documento',
                        "casos_uso": '',
                        "tickets": '',
                        'estado': 'EN COLA'
                    },
                    {
                        "ID": '12',
                        "nombre": 'Documentacion adjunta',
                        "casos_uso": '',
                        "tickets": '',
                        'estado': 'EN COLA'
                    }
                ];


                var server_config = {

                        host: 'http://localhost',
                        puerto: ':3090',
                        api: '/api/qa/',
                        metodo: ''
                    }

                var service = {
                    cargarParams: cargarParams,
                    obtenerTickets: obtenerTickets,
                    obtenerCasosPrueba: obtenerCasosPrueba,
                    obtenerEscenarios: obtenerEscenarios,
                    guardarReproduccion: guardarReproduccion
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

                function obtenerTickets(){


                    return ($q.when( tickets ))
                    //server_config.metodo = 'cargarTickets'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };

                function obtenerCasosPrueba(){


                    return ($q.when( casos_prueba ))
                    //server_config.metodo = 'cargarTickets'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };

                function obtenerEscenarios(){


                    return ($q.when( escenarios ))
                    //server_config.metodo = 'cargarTickets'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };



                //nueva_reproduccion es un objeto con tres propiedades que son objetos:
                //--> .reproduccion_encab: fecha, archivo entrada/salida y version, descripcion
                //--> .reproduccion_nota: eso, notas
                //--> .resultados_obtenidos: un objeto cuyas propiedades son los resultados esperados, y el estado(-1,0,1): negativo, positivo, pendiente.
                function guardarReproduccion ( reproduccion ){
                    return $q.when( nueva_reproduccion )
                        //.then( buscarLibroEnBiblioteca ) //Si ya existe el registro, no guardar nada.
                        .then( generarIdReproduccion ) //Generar el id que se usara para el registro en la DB
                        .then( prepararRegistro ) //crear el objeto (registro) cuyas propiedades son los campos
                        .then( persistirEnDB ) //metodo que invoca al servicio de base de datos para INSERT/UPDATE/DELETE
                        .then(

                            function guardarDatosExito( id ) {
                                return $q.resolve( id );
                            }

                        ).catch(

                            function Error(error) {
                                console.log('guardarDatos()->error: ' + error)
                            }

                        )

                };



                //---
                //METODOS PRIVADOS
                //---


                function generarIdReproduccion( reproduccion ){


                    var id = (typeof(nueva_reproduccion.reproduccion_notas.id_reproduccion) == 'number')? nueva_reproduccion.reproduccion_notas.id_reproduccion : ( new Date() ).getTime();
                    nueva_reproduccion.id_reproduccion = id;

                    return ( nueva_reproduccion );

                };


                function prepararRegistro( reproduccion ){

                    console.log(nueva_reproduccion);

                };

        };

})();