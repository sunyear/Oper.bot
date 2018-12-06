(function(){
    'use strict';
    
    angular
        .module('lotes.lote', [
                //'biblioteca.libros.categorias',
                //'ngSanitize'
                'ui.router'
            ]
        )
        .config(config);
        
        config.$inject = ['$stateProvider','$urlRouterProvider','$sceDelegateProvider', '$mdIconProvider', '$mdDateLocaleProvider', '$mdAriaProvider'];
        function config($stateProvider, $urlRouterProvider,$sceDelegateProvider, $mdIconProvider, $mdDateLocaleProvider,$mdAriaProvider){

            $mdAriaProvider.disableWarnings();
            $urlRouterProvider.when("", "/oper-bot/main/vista_global");
            $urlRouterProvider.when("/", "/oper-bot/main/vista_global");
            // $urlRouterProvider.when("/", "/tab/menu");
            $urlRouterProvider
                //.when('/a?idAutor', '/autores/:idAutor')
                //.when('/autor/:idAutor', '/autores/:idAutor')
               // .when('/l?idLibro', '/libros/:idLibro')
                //.when('/libro/:idLibro', '/libros/:idLibro')
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                //.otherwise('/biblioteca/libros/listado/todos');
                //.otherwise('/biblioteca/libros/panel-central');
                .otherwise('/oper-bot/main/vision-general');

            $stateProvider  
                .state('app', {
                    abstract: true,
                    url: '/oper-bot',
                    views: {
                        "": {
                            templateUrl: './views/layout/layout-template.html',
                            controller: 'LayoutController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.main', {
                    url: '/main',
                    views: {
                        "menulateral": {
                            templateUrl: './views/layout/layout-menu-template.html',
                            controller: 'MenuController',
                            controllerAs: 'vm_m'
                        }
                    }
                })
                .state('vista_global', {
                    parent: 'app.main',
                    url: '/vision-general',
                    views: {
                        "@app": {
                            templateUrl: './views/vista-global-template.html'
                        }
                    }
                })
                /**********************************
                /************ PROCESOS ************/
                .state('procesos', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/procesos',
                })
                .state('procesos.tablero', {
                    url: '/tablero',
                    views: {
                        "@app": {
                            templateUrl: './views/procesos-tablero-template.html'
                        }
                    }
                })
                .state('procesos.generar-archivos', {
                    url: '/generar-archivos',
                    views: {
                        "@app": {
                            templateUrl: './views/procesos/procesos-generar-archivos-template.html',
                            controller: 'ProcesosGenerarArchivosController'
                        }
                    }
                })
                .state('procesos.generar-docs-correo', {
                    url: '/generar-docs-correo',
                    views: {
                        "@app": {
                            templateUrl: './views/procesos/procesos-generar-docs-correo-template.html',
                            controller: 'ProcesosGenerarDocsCorreoController'
                        }
                    }
                })
                .state('procesos.carga-masiva', {
                    url: '/carga-masiva',
                    views: {
                        "@app": {
                            //templateUrl: './views/procesos/procesos-carga-masiva-template.html',
                            templateUrl: './views/procesos/procesos-carga-masiva-grid-template.html',
                            controller: 'ProcesosCargaMasivaController',
                            controllerAs: 'vm',
                            resolve: {
                                data: obtenerProcesosMasivos
                            }
                        }
                    }
                })
                /*.state('procesos.carga-masiva-lotes', {
                    url: '/carga-masiva/lotes',
                    data: {
                        id_proceso_masivo: 0
                    },
                    views: {
                        "@app": {
                            templateUrl: './views/procesos/procesos-carga-masiva-modal-template.html',
                            controller: 'ProcesosCargaMasivaControllerForm',
                            controllerAs: 'vm',
                        }
                    }
                })*/
                .state('procesos.carga-masiva-lotes', {
                    url: '/carga-masiva/:idProcesoMasivo',
                    data: {
                        idCargaMasiva: 0
                    },
                    params: {
                        idCargaMasiva: 0
                    },
                    views: {
                        "@app": {
                            templateUrl: './views/procesos/procesos-carga-masiva-detalle-template.html',
                            controller: 'ProcesosCargaMasivaControllerForm',
                            controllerAs: 'vm',
                            resolve: {
                                data: obtenerCargaMasivaDetalles
                            }
                        }
                    }
                })
                /************ FIN PROCESOS ************/
                /**************************************/
                .state('seguimiento', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/seguimiento',
                })
                .state('seguimiento.tablero_actas', {
                    url: '/tablero-actas',
                    views: {
                        "@app": {
                            templateUrl: './views/seguimiento/seguimiento-actas-tablero-template.html'
                        }
                    }
                })
                .state('seguimiento.tablero_impresiones', {
                    url: '/tablero-impresiones',
                    views: {
                        "@app": {
                            templateUrl: './views/seguimiento/seguimiento-impresiones-tablero-template.html'
                        }
                    }
                })
                .state('validaciones', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/validaciones',
                })
                .state('validaciones.tablero', {
                    url: '/tablero',
                    views: {
                        "@app": {
                            templateUrl: './views/validaciones/validaciones-tablero-template.html',
                            controller: 'ValidacionesTableroController'
                        }
                    }
                })
                .state('validaciones.prevalidacion', {
                    url: '/prevalidacion',
                    views: {
                        "@app": {
                            templateUrl: './views/validaciones/validaciones-prevalidacion-template.html',
                            controller: 'ValidadorCecaitraController'
                        }
                    }
                })
                /**********************************
                /************ RUTAS QA ************/
                .state('qa', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/qa',
                })
                .state('qa.tablero', {
                    url: '/tablero',
                    views: {
                        "@app": {
                            templateUrl: './views/qa/qa-tablero-template.html',
                            controller: 'QATableroController'
                        }
                    }
                })
                .state('qa.reproducciones', {
                    url: '/reproduciones',
                    data: {
                      id_caso_uso: 0
                    },
                    params: {
                        id_caso_uso: 0
                    },
                    views: {
                        "@app": {
                            templateUrl: './views/qa/reproducciones/qa-escenarios-template.html',
                            //templateUrl: './views/qa/qa-reproducciones-template.html',
                            controller: 'QAReproducciones',
                            controllerAs: 'vm',
                            resolve: {
                                caso_reproducciones: obtenerCasoReproducciones
                            }
                        }
                    }
                })
                .state('reproduccion', {
                    parent: 'qa.reproducciones',
                    url: '/reproduccion',
                    data: {
                        id_caso_reproduccion: 0
                    },
                    params: {
                        id_reproduccion: 0
                    },
                    views: {
                        "@app": {
                            templateUrl: './views/qa/reproducciones/qa-reproduccion-template.html',
                            controller: 'QAReproduccionDetalles',
                            controllerAs: 'vm',
                            resolve: {
                                reproduccion: obtenerReproduccionDatos,

                            }
                        }
                    }
                })
                .state('qa.casos-uso', {
                    url: '/casos-uso',
                    data: {
                      id_caso_uso: 0
                    },
                    params: {
                        id_caso_uso: 0
                    },
                    views: {
                        "@app": {
                            templateUrl: './views/qa/qa-casos-uso-template.html',
                            controller: 'QACasosUsoController',
                            controllerAs: 'vm',
                            resolve: {
                                casos_uso: obtenerCasosUso
                            }
                        }
                    }
                })
                .state('detalles', {
                    parent: 'qa.casos-uso',
                    url: '/detalles',
                    params: {
                        id_caso_uso: 0
                    },
                    data: {
                        id_caso_uso: 0,
                    },
                    views: {
                        '@app': {
                            templateUrl: './views/qa/qa-cu-formulario-template.html',
                            controller: 'QACasosUsosFormController',
                            controllerAs: 'vm',
                            resolve: {
                                caso_uso: obtenerCasoUso
                            }
                        }
                    }
                })
                .state('qa.casos-prueba', {
                    url: '/casos-prueba',
                    params: {
                        id_caso_uso: 0
                    },
                    data: {
                      'caso_prueba': {}
                    },
                    views: {
                        "@app": {
                            templateUrl: './views/qa/qa-casos-prueba-template.html',
                            controller: 'QACasosPruebaController',
                            resolve: {
                                qa_casos_prueba: obtenerCasosPrueba
                            }
                        }
                    }
                })
                .state('caso', {
                    parent: 'qa.casos-prueba',
                    url: '/caso',
                    params: {
                        id_caso_prueba: null
                    },
                    data: {
                        id_caso_prueba: 0,
                    },
                    views: {
                        '@app': {
                            templateUrl: './views/qa/qa-caso-prueba-template.html',
                            controller: 'QACasosPruebaModalController'
                        }
                    }
                })
                
                .state('datos-caso', {
                    parent: 'caso',
                    url: '/datos-caso',
                    params: {
                        id_caso_prueba: null
                    },
                    data: {
                        id_caso_prueba: 0,
                    },
                    views: {
                        'datos-caso@caso': {
                            templateUrl: './views/qa/qa-datos-caso-template.html',
                            controller: 'QACPDatosController'
                        }
                    }
                })
                .state('reproducciones', {
                    parent: 'caso',
                    url: '/reproducciones',
                    data: {
                      id_caso_prueba: 0,
                      id_caso_reproduccion: 0,
                    },
                    views: {
                      'reproducciones@caso': {
                        //templateUrl: './views/qa/qa-ejecuciones-template.html',
                        //controller: 'QACPEjecucionesController',
                        templateUrl: './views/qa/qa-casos-reproducciones-template.html',
                        controller: 'QACasosReproducciones',
                        controllerAs: 'vm',
                        resolve: {
                                caso_reproducciones: obtenerCasoReproducciones
                        }

                      }
                    }
                })
                /*
                .state('datos-caso', {
                    parent: 'qa.casos-prueba',
                    url: '/datos-caso',
                    
                    data: {
                      'selectedTab': 0,
                      'caso_prueba': {}
                    },
                    
                    views: {
                      'datos-caso@': {
                        templateUrl: './views/qa/qa-datos-caso-template.html',
                        controller: 'QACPDatosController',
                        resolve: {
                                caso_prueba: function($stateParams, qaService){
                                    console.log($stateParams)
                                    return {};
                                }
                        }

                      }
                    }
                })
                */
                .state('qa.validaciones', {
                    url: '/validaciones',
                    views: {
                        "@app": {
                            templateUrl: './views/qa/qa-validaciones-template.html',
                            controller: 'QAValidacionesController'
                        }
                    }
                })
                .state('qa.constanciapdf', {
                    url: '/constanciapdf',
                    views: {
                        "@app": {
                            templateUrl: './views/qa/visorpdf-template.html',
                            controller: 'VisorPDFController'
                        }
                    }
                })
                /************ FIN RUTAS QA ************/
                /************ RUTAS REPORTS ***********/
                 .state('reportes', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/reportes',
                })
                .state('reportes.tablero', {
                    url: '/tablero',
                    views: {
                        "@app": {
                            templateUrl: './views/reportes/reportes-tablero-template.html',
                            controller: 'ReportesTablero',
                            controllerAs: 'vm'
                        }
                    }
                })
                /************** FIN RUTAS REPORTS *************/
                .state('config', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/config',
                })
                .state('config.app-params', {
                    url: '/app-params',
                    views: {
                        "@app": {
                            templateUrl: './views/config-app-template.html',
                            controller: 'ConfigAppController',
                            controllerAs: 'vm',
                            resolve: {
                                params_data : obtenerAppParams
                            }
                            
                            /*
                            {
                                config_app_params: obtenerAppParams
                            }}
                            */
                            
                            
                        }
                    }
                })
                 .state('autogestion', {
                    abstract: true,
                    parent: 'app.main',
                    url: '/autogestion',
                })
                .state('autogestion.tablero', {
                    url: '/tablero',
                    views: {
                        "@app": {
                            templateUrl: './views/autogestion/autogestion-tablero-template.html'
                        }
                    }
                });
                
            $sceDelegateProvider
                .resourceUrlWhitelist([
                // Adding 'self' to the whitelist, will allow requests from the current origin.
                'self',
                // Using double asterisks here, will allow all URLs to load.
                // We recommend to only specify the given domain you want to allow.
                '**'
  ]);
            $mdIconProvider
                .defaultIconSet('./bower_components/angular-material/modules/icons/fonts/materialdesignicons-webfont.svg');

                
            /*$mdDateLocaleProvider
                .formatDate = function(date) {
                    return date ? moment(date).format('YYYYMMDD') : '';
                };
                */

                $mdDateLocaleProvider.parseDate = function(dateString) {
                  var m = moment(dateString, 'YYYY-MM-DD', true);
                  return m.isValid() ? m.toDate() : new Date(NaN);
                };

                $mdDateLocaleProvider.formatDate = function(date) {
                  var m = moment(date);
                  return m.isValid() ? m.format('YYYY-MM-DD') : '';
                };
                
        };


        //METODO QUE OBTIENE LOS LIBROS EN FUNCION DEL PARAMETRO $stateParams
        //$stateParamas puede ser: 'todos'; 'favoritos'; 'leidos'; 'noleidos'
        //SE USA EN EL RESOLVE DEL STATE libros.listado
        function obtenerLibros($stateParams, librosService){
            return ( librosService.obtenerDatosListado( $stateParams.filtro ) );
        }


        //METODO QUE OBTIENE LOS DATOS DEL LIBRO SELECCIONADO. SE RETORNA UNA PROMISE
        //SE USA EN EL RESOLVE DEL STATE libros.detalle
        function obtenerDatosLibro($stateParams, librosService){

            //console.log($stateParams)
            return ( librosService.cargarLibro( $stateParams.idLibro ) );
        }


        function obtenerInfoLecturas($stateParams, lecturasService, libro){

            var datos = [];

            if(libro.leyendo){
                lecturasService
                    .obtenerLecturas()
                    .then(
                        function procesar( lecturas ){
                            //console.log(lecturas)
                        }
                    );
            }

            datos.push(libro);

            return ( datos );
        }

        function obtenerAppParams($stateParams, ParamsConfigService){
            return ( ParamsConfigService.obtenerParams() )
        }

        function obtenerTickets($stateParams, qaService){

            return ( qaService.obtenerTickets() )

        }

        function obtenerCasosPrueba($stateParams, qaService){


            return ( qaService.obtenerCasosPrueba() )

        }

        function obtenerReproduccionDatos($stateParams, qaService){


            return ( qaService.obtenerReproduccionDatos( $stateParams.id_reproduccion ) )

        }


        function obtenerEscenarios($stateParams, qaService){

            return ( qaService.obtenerEscenarios() )

        }

        function obtenerCasoReproducciones($stateParams, qaService){

            return ( qaService.obtenerCasoReproducciones() )

        }

        function obtenerCasosUso($stateParams, qaService){

            return ( qaService.obtenerCasosUso() )

        };

        function obtenerCasoUso($stateParams, qaService){

            //console.log(qaService.getCasoPrueba( 1 ))

            return ( qaService.obtenerCasosUso() );
        };


        function obtenerCargaMasivaDetalles($stateParams, procesosMasivosService){


            //return ( procesosMasivosService.obtenerProcesosMasivosLotes( $stateParams.id_proceso_masivo ) )
            //console.log($stateParams.idCargaMasiva)
            return ( procesosMasivosService.obtenerProcesosMasivosLotes( $stateParams.idProcesoMasivo ) )

        }

        function obtenerProcesosMasivos( $stateParams, procesosMasivosService ){
            return ( procesosMasivosService.obtenerProcesosMasivos() )
        }

        

})();

/*
.directive('requerirAutor', 
    function() {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.requerirAutor = function(modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be invalid
                  scope.formulario.autorOK = false;
                  return false;
                }

                // it is valid
                scope.formulario.autorOK = true;
                return true;
              };
            }
        };
    }
)
.directive('validarAnio', 
    function() {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.validarAnio = function(modelValue, viewValue) {

               var INTEGER_REGEXP = /^\-?\d+$/;

               //&& ((viewValue >= attrs.min) && (viewValue <= attrs.max))

                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be valid
                  scope.formulario.anioPublicacionOK = true;
                  return true;
                }

                if ( INTEGER_REGEXP.test(viewValue) ) {

                    // it is valid
                    if(viewValue >= 0 && viewValue <= 2016){
                        scope.formulario.anioPublicacionOK = true;
                        return true;
                    }
                }

                // it is invalid
                scope.formulario.anioPublicacionOK = false;
                return false;
              };
            }
        };
    }
)
.directive('validarPaginas', 
    function() {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.validarPaginas = function(modelValue, viewValue) {

                var INTEGER_REGEXP = /^\-?\d+$/;

                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be valid
                  scope.formulario.paginasOK = true;
                  return true;
                }

                if ( INTEGER_REGEXP.test(viewValue) ){
                    if( viewValue >= 0 ) {
                        // it is valid
                        scope.formulario.paginasOK = true;
                        return true;
                    }
                }

                // it is invalid
                scope.formulario.paginasOK = false;
                return false;
              };
            }
        };
    }
)
.directive('autocompletar', 
    function($document) {

        return {
            require: 'ngModel',
            restrict: 'A',
            //template: '<div>asdasd</div>'
            link: function(scope, element, attrs, ctrl) {
            // get weather details

            var top = (element[0].offsetWidth) - 10;
            var left = (element[0].offsetHeight);

            console.log(element[0].offsetHeight)

            var template = '<div style="background-color:#666; position: absolute; top:'+ top +'px; left:20px;z-index:20; width:50px; border:solid 1px #EEE">LALALA</div>';

            $document.find('body').append(template);

            element.on('keyup', function(event){
                
            })

           
            }
        }
        
    }
);
*/