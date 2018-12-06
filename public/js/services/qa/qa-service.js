(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .factory('qaService', qaService);

        qaService.$inject = ['$localForage', '$q', '$http', '$timeout', '$soap', 'basedatosservice', 'TABLA'];
        function qaService($localForage, $q, $http, $timeout, $soap, basedatosservice, TABLA) {

                //var lotes = ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) || [] );

                var base_url = "10.30.1.160/mantis/api/soap/mantisconnect.php?wsdl";

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

                var escenarios = [
                    {
                        "ID": 0,
                        "tipo": 'datos',
                        "nombre": 'actas personales notificadas',
                        "valor": '015_0334_20170504_100001.csv'

                    },
                     {
                        "ID": 1,
                        "tipo": 'parametro de sistema',
                        "nombre": 'DIAS_LIMITE_CALIDAD_R1',
                        "valor": '30'
                    },
                    {
                        "ID": 2,
                        "tipo": 'datos',
                        "nombre": 'actas personales no-notificadas',
                        "valor": '015_0233_20170504_200001.csv'

                    },
                ];


                var casos_prueba = [
                    {
                        "ID": 'CP-001',
                        "nombre": 'Preprocesar archivo de interfaz [actas personales notificadas]',
                        "funcionalidades": ['ConsultarArchivos','AgregarArchivo','ProcesarArchivo'],
                        "precondiciones": [],
                        "etiquetas": {},
                        "descripcion": '',
                        "resultados_esperados": [],
                        "observaciones": "",
                        "escenarios": [3],
                        "ticket_mantis": [''],
                        "estado": 'validado',
                        "pasos": [
                            'Usuario inicia sesion en el sistema',
                            'Usuario ingresa a Procesos, entonces a Consultar Archivos',
                            'Usuario busca lotes de actas CECAITRA en estado "A calidad"',
                            'Usuario se posiciona sobre un lote en estado "A Calidad" y a continuacion pulsa el boton[calidad]'
                        ]
                    },
                    {
                        "ID": 'CP-04/004',
                        "nombre": '[Control de Calidad]: actas personales notificadas fuera de plazo de imposicion',
                        "funcionalidades": ['ConsultarArchivos', 'AgregarArchivo', 'ValidarArchivo','Calidad'],
                        "precondiciones": [
                                'Actas personales notificadas aceptadas en la validacion automatica',
                                'Parametro de sistema DIAS_LIMITE_CALIDAD_R1 (n dias) configurado',
                                'Al menos un acta con fecha infraccion tal que: (HOY - f_infraccion) > DIAS_LIMITE_CALIDAD_R1'
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'El sistema no debe evaluar el plazo de imposicion de las actas notificadas',
                                'El sistema debe presentar la pantalla de Control de Calidad'
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[0],escenarios[1]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": 'en ejecucion',
                        "pasos": []
                    },
                    {
                        "ID": 'CP-05/004',
                        "nombre": '[Control de Calidad]: actas personales no-notificadas fuera del plazo de imposicion',
                        "funcionalidades": ['ConsultarArchivos', 'AgregarArchivo', 'ValidarArchivo','Calidad'],
                        "precondiciones": [
                                'Actas personales no-notificadas aceptadas en la validacion automatica',
                                'Parametro de sistema DIAS_LIMITE_CALIDAD_R1 (n dias) configurado',
                                'Al menos un acta tal que: (HOY - fecha_infraccion_acta) > DIAS_LIMITE_CALIDAD_R1',
                                'Operador con [PERMISO] CONTROL_CALIDAD'
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": 'Operador procesa en control de calidad un lote de actas personales no-notificadas. Las actas estan fuera del plazo de imposicion',
                        "resultados_esperados": [
                                'El sistema debe evaluar el plazo de imposicion de las actas notificadas',
                                'El sistema emite cuadro de dialogo indicando que existen n actas fuera de plazo de imposicion'
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": 'en ejecucion',
                        "pasos": []
                    },
                    {
                        "ID": 'CP-05/005',
                        "nombre": '[Control de Calidad]: actas personales no-notificadas fuera de plazo de imposicion',
                        "funcionalidades": ['ConsultarArchivos', 'AgregarArchivo', 'ValidarArchivo','Calidad'],
                        "precondiciones": [
                                'Parametro de sistema DIAS_LIMITE_CALIDAD_R1 (n dias) configurado',
                                'Actas personales no-notificadas aceptadas en la validacion automatica',
                                'Lote de actas en estado [A calidad]',
                                'Al menos un acta tal que: (HOY - fecha_infraccion_acta) > DIAS_LIMITE_CALIDAD_R1'
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": 'asd',
                        "resultados_esperados": [
                                'El sistema debe evaluar el plazo de imposicion de las actas notificadas',
                                'El sistema emite cuadro de dialogo indicando que existen n actas fuera de plazo de imposicion'
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": 'en ejecucion',
                        "pasos": []
                    },
                    {
                        "ID": 'CP-06/001',
                        "nombre": '[Archivo de respuesta]: lote ACEPTADO - instancia CALIDAD ',
                        "funcionalidades": ['ConsultarArchivos', 'AgregarArchivo', 'ValidarArchivo','Calidad'],
                        "precondiciones": [
                                'Lote de actas CECAITRA, procesadas en CALIDAD, en estado [ACEPTADO]',
                                'Al menos un registro aceptado',
                                'Al menos un registro observado',
                                'Al menos un registro rechazado',
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Registro aceptado: codigo 00',
                                'Registro observado: codigo 111',
                                'Registro rechazado: codigos segun tabla P_ERRORES_ARCHIVOS, concatenados, separados por ;(punto y coma)'
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario inicia sesion en el sistema',
                            'Usuario ingresa a Procesos, entonces a Consultar Archivos',
                            'Usuario busca lotes de actas CECAITRA en estado [RECHAZADO]',
                            'Usuario se posiciona sobre un lote en estado [RECHAZADO] y a continuacion pulsa el boton [respuesta]',
                            'Usuario descarga el archivo de respuesta, lo abre, y a continuacion analiza los resultados'
                        ]
                    },
                    {
                        "ID": 'CP-06/002',
                        "nombre": '[Archivo de respuesta]: lote rechazado en CALIDAD',
                        "funcionalidades": ['ConsultarArchivos', 'AgregarArchivo', 'ValidarArchivo','Calidad'],
                        "precondiciones": [
                                'Lote de actas CECAITRA en estado [RECHAZADO]',
                                'Al menos un registro aceptado por validacion automatica',
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Registros que no entraron a la muestra (sin errores en validacion) se informan sin codigo',
                                'Registros que se detectaron errores en la validacion se informan con el codigo correspondiente',
                                'Registros que se observaron en la validacion y quedaron pendientes se informan sin codigo',
                                'Registros que entraron en la muestra y se aceptaron se informan con codigo 00',
                                'Registros que entraron en la muestra y se rechazaron se informan con el codigo de error correspondiente',
                                'Registros que entraron en la muestra y se observaron se informan con el codigo 111',
                                'Registros que entraron en la muestra y quedaron pendientes se informan sin codigo'
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario inicia sesion en el sistema',
                            'Usuario ingresa a Procesos, entonces a Consultar Archivos',
                            'Usuario busca lotes de actas CECAITRA en estado [A CALIDAD]',
                            'Usuario se posiciona sobre un lote en estado [A CALIDAD] y a continuacion pulsa el boton [calidad]',
                            'Usuario acepta, observa y rechaza actas, hasta provocar el rechazo del lote',
                            'Ysyarui descarga el archivo de respuesta, lo abre, y a continuacion analiza los resultados'
                        ]
                    },
                    {
                        "ID": 'CP-06/003',
                        "nombre": '[Archivo de respuesta]: lote aceptado en CALIDAD',
                        "funcionalidades": ['ConsultarArchivos', 'AgregarArchivo', 'ValidarArchivo','Calidad'],
                        "precondiciones": [
                                'Lote de actas CECAITRA en estado [ACEPTADO]',
                                'Al menos un registro aceptado por validacion automatica',
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Registros que no entraron a la muestra (sin errores en validacion) se informan con codigo 00',
                                'Registros que se detectaron errores en la validacion se informan con el codigo correspondiente',
                                'Registros que se observaron en la validacion y quedaron pendientes se informan con codigo 111',
                                'Registros que entraron en la muestra y se aceptaron se informan con codigo 00',
                                'Registros que entraron en la muestra y se rechazaron se informan con el codigo de error correspondiente',
                                'Registros que entraron en la muestra y se observaron se informan con el codigo 111',
                                'Registros que entraron en la muestra y quedaron pendientes se informan con codigo 00'
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario inicia sesion en el sistema',
                            'Usuario ingresa a Procesos, entonces a Consultar Archivos',
                            'Usuario busca lotes de actas CECAITRA en estado [A CALIDAD]',
                            'Usuario se posiciona sobre un lote en estado [A CALIDAD] y a continuacion pulsa el boton [calidad]',
                            'Usuario acepta, observa y rechaza actas, hasta provocar la aceptacion del lote',
                            'Usuario descarga el archivo de respuesta, lo abre, y a continuacion analiza los resultados'
                        ]
                    },
                    {
                        "ID": 'CP-08/001',
                        "nombre": '[CONSTANCIA INFRACCIONES]: consulta por NRO_DOC y genero',
                        "funcionalidades": [],
                        "precondiciones": [
                                'NRO_DOC con genero INDISTINTO, MASCULINO, FEMENINO y JURIDICO',
                                'Causas asociadas al NRO_DOC'
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Todas las causas del nro_doc+genero consultado + causas genero indistinto + causas genero sin informar',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige Consultar personas fisicas',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    },
                    {
                        "ID": 'CP-08/002',
                        "nombre": '[CONSTANCIA INFRACCIONES]: tratamiento en juzgado',
                        "funcionalidades": [],
                        "precondiciones": [
                                'Causas asociadas al NRO_DOC en estado "CON DESCARGO"' 
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Se muestran causas con descargos pendientes, denegados o validos',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige CONSULTAS POR DOCUMENTO',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    },
                    {
                        "ID": 'CP-08/003',
                        "nombre": '[CONSTANCIA INFRACCIONES]: faltas graves',
                        "funcionalidades": [],
                        "precondiciones": [
                                'Causas asociadas al NRO_DOC sin pago voluntario/con faltas graves' 
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Se muestran causas cuyas infracciones no admiten pago voluntario',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige CONSULTAS POR DOCUMENTO',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    },
                    {
                        "ID": 'CP-08/004',
                        "nombre": '[CONSTANCIA INFRACCIONES]: pago voluntario',
                        "funcionalidades": [],
                        "precondiciones": [
                                'Causas asociadas al NRO_DOC con pago voluntario' 
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Se muestran causas cuyas infracciones admiten pago voluntario',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige CONSULTAS POR DOCUMENTO',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    },
                    {
                        "ID": 'CP-08/005',
                        "nombre": '[CONSTANCIA INFRACCIONES]: sentencia firme -> plan de pago, todas las cuotas pendientes',
                        "funcionalidades": [],
                        "precondiciones": [
                                'Causas asociadas al NRO_DOC con pago voluntario' 
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Se visualizan causas y sus planes de pago completos',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige CONSULTAS POR DOCUMENTO',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    },
                    {
                        "ID": 'CP-08/006',
                        "nombre": '[CONSTANCIA INFRACCIONES]: sentencia firme -> plan de pago, alguna cuota paga',
                        "funcionalidades": [],
                        "precondiciones": [
                                'Causas asociadas al NRO_DOC con sentencia firme y plan de pago' 
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Se visualizan causas y sus planes de pago completos excepto cuotas pagas',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige CONSULTAS POR DOCUMENTO',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    },
                    {
                        "ID": 'CP-08/007',
                        "nombre": '[CONSTANCIA INFRACCIONES]: sentencia firme -> sin plan de pago',
                        "funcionalidades": [],
                        "precondiciones": [
                                'Causas asociadas al NRO_DOC con pago voluntario' 
                            ],
                        "etiquetas": ['CU-116', 'CU-105', ''],
                        "descripcion": '',
                        "resultados_esperados": [
                                'Se muestran causas cuyas infracciones admiten pago voluntario',
                            ],
                        "observaciones": "",
                        "escenario": [escenarios[1],escenarios[2]],
                        "ticket_mantis": ['#0033024','#0032063','#0043024'],
                        "estado": '',
                        "pasos": [
                            'Usuario ingresa a la web del infractor',
                            'Usuario elige CONSULTAS POR DOCUMENTO',
                            'Usaurio carga un nro_doc y un genero (FEMENINO o MASCULINO)',
                            'Usuario presiona buscar',
                        ]
                    }
                ];


                var reproducciones_casos_prueba = [

                    
                    {
                        "id_reproduccion_caso_prueba": 1,
                        "id_reproduccion": 1,
                       "id_caso_prueba": casos_prueba[5].ID,
                        "nombre_caso_prueba": casos_prueba[5].nombre,
                        "id_caso_prueba_estado": 0
                    },
                    {
                        "id_reproduccion_caso_prueba": 2,
                        "id_reproduccion": 1,
                       "id_caso_prueba": casos_prueba[7].ID,
                        "nombre_caso_prueba": casos_prueba[7].nombre,
                        "id_caso_prueba_estado": 0
                    },

                    {
                        "id_reproduccion_caso_prueba": 1,
                        "id_reproduccion": 2,
                        "id_caso_prueba": casos_prueba[0].id_caso_prueba,
                        "nombre_caso_prueba": casos_prueba[0].nombre,
                        "id_caso_prueba_estado": 2
                    },
                    {
                        "id_reproduccion_caso_prueba": 2,
                        "id_reproduccion": 2,
                        "id_caso_prueba": casos_prueba[1].id_caso_prueba,
                        "nombre_caso_prueba": casos_prueba[1].nombre,
                        "id_caso_prueba_estado": 2
                    },

                    {
                        "id_reproduccion_caso_prueba": 1,
                        "id_reproduccion": 3,
                        "id_caso_prueba": casos_prueba[3].id_caso_prueba,
                        "nombre_caso_prueba": casos_prueba[3].nombre,
                        "id_caso_prueba_estado": 2
                    }

                ];


                var reproducciones_tbl = [
                    {
                        id_reproduccion: 1,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 2,
                        titulo_reproduccion: 'Prueba validacion rangos actas B',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[2],reproducciones_casos_prueba[3]],
                        version_sijai: '3.1.1 RC2',
                        id_p_estado_reproduccion: 1,
                        reproduccion_reportada: 1
                    },
                    {
                        id_reproduccion: 3,
                        titulo_reproduccion: 'Emision constancia de infraccion desde web infractor (cupones de pago)',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'web.infractor'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'lic.nac'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[3]],
                        id_p_estado_reproduccion: 1,
                        version_sijai: '3.1.0 RC2',
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 4,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 5,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 6,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 7,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 8,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 9,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 10,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 11,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 12,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 13,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 14,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 15,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                    {
                        id_reproduccion: 16,
                        titulo_reproduccion: 'Prueba validacion rangos actas A',
                        etiquetas: [
                            {
                                id_etiqueta: 1,
                                titulo: 'Rubro1'
                            },
                            {
                                id_etiqueta: 2,
                                titulo: 'ValidarRangosActas'
                            }
                        ],
                        casos_prueba: [reproducciones_casos_prueba[0],reproducciones_casos_prueba[1]],
                        version_sijai: '',
                        id_p_estado_reproduccion: 0,
                        reproduccion_reportada: 0
                    },
                ];


                var reportes = [
                    {
                        id_reporte: 1,
                        id_reproduccion_caso_prueba: 1,
                        id_reproduccion: 4,
                        titulo: 'Error 999 al crear lo que sea',
                        descripcion: 'qweqwjo  aijosdj  oiqwe oqweu  qwioue oajsd qwioe u',
                        casos_uso: [],
                        palabras_clave: [],
                        archivos_adjuntos: []
                    },
                    {
                        id_reporte: 2,
                        id_reproduccion_caso_prueba: 1,
                        id_reproduccion: 2,
                        titulo: 'otroo titulo',
                        descripcion: 'qweqwjo  aijosdj  oiqwe oqweu  qwioue oajsd qwioe u',
                        casos_uso: [],
                        palabras_clave: [],
                        archivos_adjuntos: []
                    }
                ];


                var archivos_adjuntos = [
                    {
                        id_archivo: 1,
                        id_reproduccion: 3,
                        id_reproduccion_caso_prueba: 1,
                        nombre_archivo: 'asdadasd.csv',
                        tipo_archivo: 'CSV',
                        raw_archivo: 'qeqweqwewqe',
                        f_archivo:'01/01/2018'
                    },
                    {
                        id_archivo: 2,
                        id_reproduccion: 3,
                        id_reproduccion_caso_prueba: 1,
                        nombre_archivo: 'asdadasd.jpg',
                        tipo_archivo: 'captura pantalla',
                        raw_archivo: 'qeqweqwewqe',
                        f_archivo:'01/01/2018'
                    }
                ];



                var reproducciones_v = [
                    {
                        id_reproduccion: 1,
                        titulo_reproduccion:  reproducciones_tbl[0].titulo_reproduccion,
                        etiquetas: reproducciones_tbl[0].etiquetas,
                        id_p_estado_reproduccion: reproducciones_tbl[0].id_p_estado_reproduccion,
                        version_sijai: reproducciones_tbl[0].version_sijai
                    },
                    {
                        id_reproduccion: 2,
                        titulo_reproduccion:  reproducciones_tbl[1].titulo_reproduccion,
                        etiquetas: reproducciones_tbl[1].etiquetas,
                        id_p_estado_reproduccion: reproducciones_tbl[1].id_p_estado_reproduccion,
                        version_sijai: reproducciones_tbl[1].version_sijai
                    },
                    {
                        id_reproduccion: 3,
                        titulo_reproduccion: reproducciones_tbl[2].titulo_reproduccion,
                        etiquetas: reproducciones_tbl[2].etiquetas,
                        id_p_estado_reproduccion: reproducciones_tbl[2].id_p_estado_reproduccion,
                        version_sijai: reproducciones_tbl[2].version_sijai
                    },
                    {
                        id_reproduccion: 4,
                        titulo_reproduccion:  reproducciones_tbl[1].titulo_reproduccion,
                        etiquetas: reproducciones_tbl[1].etiquetas,
                        id_p_estado_reproduccion: reproducciones_tbl[1].id_p_estado_reproduccion,
                        version_sijai: reproducciones_tbl[1].version_sijai
                    },
                    {
                        id_reproduccion: 5,
                        titulo_reproduccion:  reproducciones_tbl[1].titulo_reproduccion,
                        etiquetas: reproducciones_tbl[1].etiquetas,
                        id_p_estado_reproduccion: reproducciones_tbl[1].id_p_estado_reproduccion,
                        version_sijai: reproducciones_tbl[1].version_sijai
                    },
                    {
                        id_reproduccion: 6,
                        titulo_reproduccion:  reproducciones_tbl[1].titulo_reproduccion,
                        etiquetas: reproducciones_tbl[1].etiquetas,
                        id_p_estado_reproduccion: reproducciones_tbl[1].id_p_estado_reproduccion,
                        version_sijai: reproducciones_tbl[1].version_sijai
                    },
                ];


                


                var casos_uso= [
                    {
                        id_caso_uso: 1,
                        id_lbl_caso_uso: 'CU-115',
                        nombre_caso_uso: 'Validar Rubro1',
                        f_ult_modificacion: '01/08/2017',
                        casos_prueba: [
                            {
                                id_caso_prueba: 1,
                                caso_prueba: 'CP-06/001',
                                descripcion: '[Archivo de respuestas]: lote ACEPTADO - isntancia {CALIDAD}'
                            },
                            {
                                id_caso_prueba: 2,
                                caso_prueba: 'CP-06/002',
                                descripcion: '[Archivo de respuestas]: lote RECHAZADO - isntancia {CALIDAD}'
                            },

                        ]
                    },
                    {
                        id_caso_uso: 2,
                        id_lbl_caso_uso: 'CU-338',
                        nombre_caso_uso: 'Resolver Por Inhabilitacion',
                        f_ult_modificacion: '01/08/2017'
                    },
                    {
                        id_caso_uso: 3,
                        id_lbl_caso_uso: 'CU-265',
                        nombre_caso_uso: 'Consultar red link',
                        f_ult_modificacion: '01/08/2017'
                    },
                    {
                        id_caso_uso: 4,
                        id_lbl_caso_uso: 'CU-104',
                        nombre_caso_uso: 'Novedades correo',
                        f_ult_modificacion: '01/08/2017'
                    }
                ];


                var casos_ejecuciones = [
                    {
                        "id_caso_ejecucion": '1',
                        "f_ejecucion":  '14/05/2017 14:22:43',
                        "relase_candidate": '2.10.0 RC5',
                        "archivo_entrada": '015_0233_20170828_400002.csv',
                        "archivo_salida": 'RTA-000-015_0233_20170828_400002.csv',
                    },
                    {
                        "id_caso_ejecucion": '2',
                        "f_ejecucion":  '14/05/2017 14:24:06',
                        "relase_candidate": '2.10.0 RC5',
                        "archivo_entrada": '015_0233_20170828_400003.csv',
                        "archivo_salida": 'RTA-000-015_0233_20170828_400003.csv',
                    }
                ];

                var casos_reproducciones = {a:1};

                /*var reproducciones_notas = [
                    {
                        "id_nota_ejecucion": '1',
                        "id_caso_ejecucion": '1',
                        "nota": 'asdasdasd qew q'
                    },
                    {
                        "id_nota_ejecucion": '2',
                        "id_caso_ejecucion": '2',
                        "nota": 'qeeqwweqwwqewqe'
                    },
                ];*/

                var json_reproducciones_notas = JSON.parse('{ "datos": [' +
                        '{"id_nota_reproduccion":"1", "id_caso_reproduccion":"1","nota": "cacacacacacacaca"},' + 
                        '{"id_nota_reproduccion":"1", "id_caso_reproduccion":"3","nota": "popopopopopopo"} ' +
                        ']}');

                
                


                var server_config = {

                        host: 'http://localhost',
                        puerto: ':3090',
                        api: '/api/qa/',
                        metodo: ''
                    }

                var service = {

                    caso_prueba: {},

                    cargarParams: cargarParams,
                    obtenerTickets: obtenerTickets,
                    obtenerCasosPrueba: obtenerCasosPrueba,
                    obtenerEscenarios: obtenerEscenarios,
                    obtenerCasosUso: obtenerCasosUso,
                    setCasoPrueba: setCasoPrueba,
                    getCasoPrueba: getCasoPrueba,
                    //obtenerCasosReproducciones: obtenerCasosReproducciones,
                    obtenerNotasReproduccion: obtenerNotasReproduccionSQL,
                    obtenerCasoReproducciones: obtenerCasoReproduccionesSQL,
                    guardarReproduccion: guardarReproduccion,
                    borrarReproduccion: borrarReproduccion,
                    guardarReproduccionNota: guardarReproduccionNotaSQL,
                    eliminarReproduccionNota: eliminarReproduccionNotaSQL,
                    soapTest: soapTest,
                    //NUEVA INTERFAZ PARA REPRODUCCIONES 04/2018
                    obtenerReproduccionesCasosPrueba: obtenerReproduccionesCasosPrueba,
                    obtenerReproduccionDatos: obtenerReproduccion,
                    obtenerCasosPruebaAutocompletar: obtenerCasosPrueba,
                    obtenerReproducciones: obtenerReproducciones,
                    obtenerReproduccion: obtenerReproduccion,
                    cancelarReproduccion: cancelarReproduccion,
                    obtenerArchivosAdjuntosReproduccion: obtenerArchivosAdjuntosReproduccion,
                    esCasoPruebaReportado: esCasoPruebaReportado,
                    guardarReporte: guardarReporte

                };

                return ( service );


                //---
                //METODOS PUBLICOS NUEVA INTERFAZ PARA REPRODUCIONES 04/2018
                //---


                function obtenerReproducciones(){





                     return ($q.when( reproducciones_tbl ));
                };


                function obtenerReproduccionDatos(  ){

                    var reproduccion = {
                        encabezado: [],
                        casos_prueba: obtenerReproduccionesCasosPrueba()
                    };

                    return ($q.when( reproduccion ));
                }


                function obtenerReproduccionesCasosPrueba(  ){
                    return (reproducciones_casos_prueba );
                }


                function obtenerReproduccion ( id_reproduccion ){

                    let reproduccion_db = [];

                    angular.forEach(reproducciones_tbl, function (value, key){
                        let id_reproduccion_busq = reproducciones_tbl[key].id_reproduccion;
                        if(id_reproduccion_busq === id_reproduccion){
                            reproduccion_db = angular.copy(reproducciones_tbl[key])
                            key = -1;
                            return;
                        }
                    });

                    return ( $q.when( reproduccion_db ) );
                };

                /***********/
                //31/05/2018

                function guardarReproduccion( reproduccion, iniciar_reproduccion ){

                    console.log(reproduccion.id_reproduccion)
                    

                    if(reproduccion.id_reproduccion === 0){
                        console.log(reproduccion)
                        let id_reproduccion = ( new Date() ).getTime();
                        reproduccion.id_reproduccion = id_reproduccion;
                        reproducciones_tbl.push( reproduccion );
                    }else{

                       
                            angular.forEach(reproducciones_tbl, function (value, key){
                                let id_reproduccion_busq = reproducciones_tbl[key].id_reproduccion;
                                if(id_reproduccion_busq === reproduccion.id_reproduccion){
                                    reproducciones_tbl[key] = reproduccion;
                                    //reproducciones_tbl[key] = angular.copy(reproduccion);
                                    key = -1;
                                    return;
                                }
                             });

                         if( iniciar_reproduccion ){
                            angular.forEach(reproducciones_tbl, function (value, key){
                                let id_reproduccion_busq = reproducciones_tbl[key].id_reproduccion;
                                if(id_reproduccion_busq === reproduccion.id_reproduccion){
                                    reproducciones_tbl[key].id_p_estado_reproduccion = (iniciar_reproduccion)?1:0;
                                    reproducciones_tbl[key].version_sijai = reproduccion.version_sijai;

                                    key = -1;
                                    return;
                                }
                             });

                        }

                    }

                    

                    //console.log(reproducciones_tbl)

                    return ( $q.when(reproducciones_tbl) );

                };

                function cancelarReproduccion( id_reproduccion ){

                    angular.forEach(reproducciones_tbl, function (value, key){
                        let id_reproduccion_busq = reproducciones_tbl[key].id_reproduccion;
                        if(id_reproduccion_busq === id_reproduccion){
                            console.log(reproducciones_tbl[key])
                            reproducciones_tbl[key].id_p_estado_reproduccion = 0;
                            key = -1;
                            //return;
                        }
                    });

                     return ($q.when( null ))

                };


                function obtenerArchivosAdjuntosReproduccion(){
                    return ($q.when( archivos_adjuntos ))
                };


                function esCasoPruebaReportado( id_reproduccion, id_reproduccion_caso_prueba ){

                    console.log(id_reproduccion, id_reproduccion_caso_prueba)

                    let reportado = false;

                    angular.forEach(reportes, function (value, key){
                        let id_reproduccion_caso_prueba_busq = reportes[key].id_reproduccion_caso_prueba;
                        let id_reproduccion_busq = reportes[key].id_reproduccion;

                        console.log(id_reproduccion_caso_prueba_busq, id_reproduccion_caso_prueba)

                            if( (id_reproduccion_caso_prueba_busq === id_reproduccion_caso_prueba) && id_reproduccion_busq === id_reproduccion){


                                reportado = true;


                                key = -1;
                                return;
                            }
                    });

                    return ( reportado )

                };


                function guardarReporte( reporte ){

                    if(reporte.id_reporte === 0){
                        console.log(reporte)
                        let id_reporte = ( new Date() ).getTime();
                        reporte.id_reporte = id_reporte;
                        reportes.push( reporte );
                    }else{
                        angular.forEach(reportes, function (value, key){
                            let id_reporte_busq = reportes[key].id_reporte;
                            if(id_reporte_busq === reporte.id_reporte){
                                reportes[key] = reporte;
                                //reproducciones_tbl[key] = angular.copy(reproduccion);
                                key = -1;
                                return;
                            }
                         });
                    }

                    console.log(reportes)

                    return ( $q.when(reportes) );

                };


                /***********/


                //---
                //METODOS PUBLICOS
                //---

                function soapTest(){
                    console.log($soap.post(base_url,"HelloWorld"));
                };

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

                function obtenerCasosPrueba( map ){
                    if(typeof(map) !== 'undefined'){
                        return $q.when( casos_prueba.map(function (state) {
                                //console.log(state)
                                //console.log(state.nombre.replace(/\W+/g, ''))
                                return  {
                                            value: state.nombre.replace(/\W+/g, '').toLowerCase(),//state.nombre.toLowerCase(),
                                            display: state.nombre
                                        }
                                }
                        ));

                    }else{
                        return ($q.when( casos_prueba ))
                    }


                    
                    //server_config.metodo = 'cargarTickets'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };


                function setCasoPrueba( caso_prueba ){
                    this.caso_prueba = angular.copy(caso_prueba, {})
                };


                function getCasoPrueba( id_caso_prueba_busq ){


                    /*    

                    if(typeof(propiedad) == 'undefined'){
                        return ( this.caso_prueba );
                    }else{
                        return ( this.caso_prueba[propiedad] );  
                    }*/

                    //console.log(this.casos_prueba)

                    let caso_prueba = {};

                    angular.forEach(casos_prueba, function (value, key){
                        let id_caso_prueba = casos_prueba[key].ID;
                        if(id_caso_prueba === id_caso_prueba_busq){
                            caso_prueba = angular.extend({}, casos_prueba[key])
                            key = -1;
                            return;
                        }
                    });

                    //console.log(caso_prueba.resultados_esperados)
                    
                    return ($q.when( caso_prueba ))
                };


                function obtenerEscenarios(){


                    return ($q.when( escenarios ))
                    //server_config.metodo = 'cargarTickets'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };

                function obtenerCasoEjecuciones(){

                    return ($q.when( casos_ejecuciones ))
                    //server_config.metodo = 'cargarTickets'
                    //var consulta = (server_config.host+server_config.puerto+server_config.api+server_config.metodo) ;
                    //return ( basedatosservice.crudRead( consulta, true ) );
                };

                function obtenerNotasReproduccion( id_caso_reproduccion ){

                    var json_return_data = JSON.parse('{}');

                    for (var i in json_reproducciones_notas.datos){
                        if(id_caso_reproduccion == json_reproducciones_notas.datos[i].id_caso_reproduccion){
                            json_return_data = json_reproducciones_notas.datos[i];
                            i = -1;
                        }
                        
                    }

                    //console.log(json_return_data)
                    return ( $q.when( json_return_data ) )
                };



                function obtenerNotasReproduccionSQL( id_caso_reproduccion ){

                    var json_return_data = JSON.parse('{}');

                    var consulta = 'qa/reproducciones/notas/' + id_caso_reproduccion;
                    var return_data = basedatosservice.crudRead( consulta );

                    return  $q.when ( return_data )
                            .then(
                                function ReproduccionNota( caso_reproduccion_notas ){
                                    return ( caso_reproduccion_notas );
                                }
                            )
                };


                function obtenerCasoReproduccionesSQL(){
                    var consulta = 'qa/reproducciones/vista';
                    var return_data = basedatosservice.crudRead( consulta );
                    console.log(return_data)
                    casos_reproducciones = return_data;
                    return ( casos_reproducciones );

                };


                function guardarReproduccionNotaSQL( reproduccion_nota ){

                    console.log(reproduccion_nota)

                    var id_reproduccion_nota = 0;
                    var consulta = 'qa/reproducciones/notas';
                    var return_data;

                    //Si id_reproducion_nota === 'undefined' es porque se esta creando
                    if(reproduccion_nota.id_reproduccion_nota === 0){ //INSERT INTO
                        //console.log(reproduccion_nota.id_reproduccion_nota)
                        return_data = basedatosservice.crudCreate( JSON.parse(JSON.stringify(reproduccion_nota)), consulta );
                    }else{//UPDATE
                        //id_reproduccion_nota = reproduccion_nota.id_reproduccion_nota;
                        consulta += '/' + reproduccion_nota.id_reproduccion_nota;
                        return_data = basedatosservice.crudUpdate( consulta, JSON.parse(JSON.stringify(reproduccion_nota)) );
                    }

                    //console.log(return_data)

                    ///console.log(reproduccion_nota)
                    //var return_data = basedatosservice.crudUpdate( consulta, JSON.parse(JSON.stringify(reproduccion_nota)) );
                    
                    return ( return_data );
                };


                function eliminarReproduccionNotaSQL( id_reproduccion_nota ){

                    var consulta = 'qa/reproducciones/notas/' + id_reproduccion_nota;
                    console.log(consulta)
                    var return_data = basedatosservice.crudDelete( consulta );

                    return ( return_data );
                };


                
                function urlServerApi(){
                    return (server_config.host+server_config.puerto+server_config.api);
                };


                //nueva_reproduccion es un objeto con tres propiedades que son objetos:
                //--> .reproduccion_encab: fecha, archivo entrada/salida y version, descripcion
                //--> .reproduccion_nota: eso, notas
                //--> .resultados_obtenidos: un objeto cuyas propiedades son los resultados esperados, y el estado(-1,0,1): negativo, positivo, pendiente.
                function guardarReproduccion_old ( reproduccion ){
                    return $q.when( reproduccion )
                        //.then( buscarLibroEnBiblioteca ) //Si ya existe el registro, no guardar nada.
                        .then( generarIdReproduccion ) //Generar el id que se usara para el registro en la DB
                        .then( prepararRegistroReproduccion ) //crear el objeto (registro) cuyas propiedades son los campos
                        .then( persistirReproduccionEnDB ) //metodo que invoca al servicio de base de datos para INSERT/UPDATE/DELETE
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

                

                function borrarReproduccion( reproducciones ){

                    //console.log(casos_reproduccion)

                    //console.log(JSON.stringify(reproducciones));

                    //var cons = JSON.stringify('{"caso_reproducciones": '+ JSON.stringify(reproducciones) + '}');

                    //console.log(JSON.parse(cons))

                    var consulta = 'qa/reproducciones/' + JSON.stringify(reproducciones)//cons;
                    //console.log(consulta)
                    var return_data = basedatosservice.crudDelete( consulta );
                    //console.log(consulta)
                    return ( return_data );
                };





                function obtenerCasosUso(){

                    return ($q.when( casos_uso )) 

                };


                //---
                //METODOS PRIVADOS
                //---

                 function generarIdReproduccion( reproduccion ){

                    //console.log(reproduccion.reproduccion_encab.id_caso_reproduccion)
                    let id_caso_reproduccion = reproduccion.reproduccion_encab.id_caso_reproduccion;

                    if( id_caso_reproduccion === 0 ){//se esta creando una nueva reproduccon
                        id_caso_reproduccion = ( new Date() ).getTime();
                        reproduccion.reproduccion_encab.id_caso_reproduccion_new = id_caso_reproduccion;
                    }
                    //var id = (reproduccion.hasOwnProperty('id_reproduccion'))? reproduccion.id_reproduccion : ( new Date() ).getTime();
                    //reproduccion.id_reproduccion = id;

                    return ( reproduccion );

                };


                function prepararRegistroReproduccion( reproduccion ){

                    return ( reproduccion );

                };


                function persistirReproduccionEnDB( reproduccion ){

                    var consulta = 'qa/reproducciones';
                    var return_data;

                    //Si id_reproducion_nota === 'undefined' es porque se esta creando
                    if(typeof(reproduccion.reproduccion_encab.id_caso_reproduccion_new) !== 'undefined'){ //INSERT INTO
                        //console.log(reproduccion_nota.id_reproduccion_nota)
                        return_data = basedatosservice.crudCreate( JSON.parse(JSON.stringify(reproduccion)), consulta );
                    }else{//UPDATE
                        //id_reproduccion_nota = reproduccion_nota.id_reproduccion_nota;
                        consulta += '/' + reproduccion.reproduccion_encab.id_caso_reproduccion;
                        return_data = basedatosservice.crudUpdate( consulta, JSON.parse(JSON.stringify(reproduccion)) );
                    }

                    return ( return_data );
                };
        };

})();