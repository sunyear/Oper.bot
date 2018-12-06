(function(){
    'use strict';
    
    angular
        .module('actas_remitos.lote', [
                //'biblioteca.libros.categorias',
                //'ngSanitize'
                'ui.router',
                'ui.bootstrap'
            ]
        )
        .config(config);
        
        config.$inject = ['$stateProvider','$urlRouterProvider'];
        function config($stateProvider, $urlRouterProvider){

            $urlRouterProvider.when("", "/validador");
            $urlRouterProvider.when("/", "/validador");
            // $urlRouterProvider.when("/", "/tab/menu");
            $urlRouterProvider
                //.when('/a?idAutor', '/autores/:idAutor')
                //.when('/autor/:idAutor', '/autores/:idAutor')
               // .when('/l?idLibro', '/libros/:idLibro')
                //.when('/libro/:idLibro', '/libros/:idLibro')
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                //.otherwise('/biblioteca/libros/listado/todos');
                //.otherwise('/biblioteca/libros/panel-central');
                .otherwise('/validador');

            $stateProvider          
                /******************************
                ***** SECCION LIBROS *********
                *******************************/
                .state('lotes', {
                    cache: false,
                    url: '/validador',
                    templateUrl: './views/lote-template.html',
                    controller: 'LoteController',
                    controllerAs: 'vm'
    
                    /*,
                    resolve: {
                        libros: obtenerLibros
                    }*/
                })
                /*
                .state('detalle', {
                    parent: 'libros',
                    cache: false,
                    url: '/detalle/{idLibro:[0-9]{1,20}}',
                    views: {
                        'libros@biblioteca': {
                            templateUrl: './libros/templates/libros.detalle.html',
                            controller: 'LibroDetalleController',
                            controllerAs: 'detvm'
                        }
                    },
                    resolve: {
                        libro: obtenerDatosLibro
                    }
                })
                */
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

        

})();