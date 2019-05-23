/*================================================================
	Server side Routing
	Route Declarations

=================================================================*/

/* ========================================================== 
Internal App Modules/Packages Required
============================================================ */
var conf_routes = require('./routes/conf-routes.js');
var fs_routes = require('./routes/fs-routes.js');
var todoRoutes = require('./routes/todo-routes.js');	//Exchange routes
var lotes_procesosRoutes = require('./routes/lotes-procesos-routes.js');
var lotes_Routes = require('./routes/lotes-routes.js');
var qa_Routes = require('./routes/qa-routes.js');
var procesos_masivos_Routes = require('./routes/procesos_masivos-routes.js');
var bodyParser = require('body-parser');


module.exports = function(app) {

	/*================================================================
	ROUTES
	=================================================================*/


	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	app.get('/api/fs/cargarParams', conf_routes.cargarParams);


	//--
	// BACK-END: PREVALIDACION LOTES
	//--
	app.get('/api/lotes/vista', lotes_Routes.lotes_v);
	app.post('/api/lotes/guardarLoteValidado', lotes_Routes.guardarLoteValidado); //INSERT

	//--
	// BACK-END: GENERACION DE ARCHIVOS
	//--

	app.post('/api/fs/generaArchivoRemitosActas', fs_routes.generaArchivoRemitosActas);
	app.post('/api/fs/generaArchivosActas', fs_routes.generaArchivosActas);
	app.post('/api/fs/generaArchivoImposicion', fs_routes.generaArchivoImposicion);
	app.post('/api/fs/generaArchivoCodigosBarras', fs_routes.generaArchivoCodigosBarras);
	app.post('/api/fs/leerDirectorioLote', fs_routes.leerDirectorioLote);
	app.post('/api/fs/getParamsActasPDF', fs_routes.getParamsActasPDF);
	app.post('/api/fs/publicarActasPDF', fs_routes.publicarActasPDF)


	//--
	// BACK-END: QA
	//--

	//OPERACIONES SELECT
	app.get('/api/qa/reproducciones/vista', qa_Routes.reproducciones_v);
	app.get('/api/qa/reproducciones/notas/:id_reproduccion', qa_Routes.reproducciones_notas);
	app.get('/api/qa/reproducciones/vista', qa_Routes.obtenerCasoReproducciones);

	//REPRODUCCIONES
	//INSERT/UPDATE/DELETE
	app.post('/api/qa/reproducciones', qa_Routes.guardarReproduccion); //INSERT
	app.put('/api/qa/reproducciones/:id_caso_reproduccion', qa_Routes.guardarReproduccion); //UPDATE
	app.delete('/api/qa/reproducciones/:caso_reproduccion', qa_Routes.eliminarReproduccion);//DELETE
	
	//OPERACIONES INSERT/UPDATE/DELETE
	app.post('/api/qa/reproducciones/notas', qa_Routes.guardarReproduccionNota); //INSERT
	app.put('/api/qa/reproducciones/notas/:id_reproduccion_nota', qa_Routes.guardarReproduccionNota); //UPDATE
	app.delete('/api/qa/reproducciones/notas/:id_reproduccion_nota', qa_Routes.eliminarReproduccionNota);//DELETE
	//-- FIN QA


	//--
	// BACK-END: PROCESOS_MASIVOS
	//--

	//OPERACIONES SELECT
	//app.get('/api/procesos_masivos/vista', procesos_masivos_Routes.procesos_masivos_v);
	app.get('/api/procesos_masivos/vista/', procesos_masivos_Routes.procesos_masivos_v);
	app.get('/api/procesos_masivos/vista/fecha_proceso/:anio/:mes', procesos_masivos_Routes.procesos_masivos_v);
	app.get('/api/procesos_masivos/:id_proceso_masivo', procesos_masivos_Routes.procesos_masivos_lotes_v); //????
	app.get('/api/procesos_masivos/vista/lote/:lote', procesos_masivos_Routes.procesos_masivos_v);
	app.get('/api/procesos_masivos/vista/remito/:remito', procesos_masivos_Routes.procesos_masivos_v);
	app.get('/api/procesos_masivos/vista/tipo/:tipo', procesos_masivos_Routes.procesos_masivos_v);

	//OPERACIONES INSERT / UPDATE / DELETE
	app.post('/api/procesos_masivos/guardarProcesoMasivo', procesos_masivos_Routes.guardarProcesoMasivo); //INSERT
	app.delete('/api/procesos_masivos/eliminarProcesoMasivo/:id_proceso_masivo', procesos_masivos_Routes.eliminarProcesoMasivo);//DELETE

	//-- FIN PROCESOS MASIVOS

	//REPRODUCCIONES
	//INSERT/UPDATE/DELETE
	//app.post('/api/qa/reproducciones', qa_Routes.guardarReproduccion); //INSERT
	//app.put('/api/qa/reproducciones/:id_caso_reproduccion', qa_Routes.guardarReproduccion); //UPDATE
	//app.delete('/api/qa/reproducciones/:caso_reproduccion', qa_Routes.eliminarReproduccion);//DELETE
	
	//OPERACIONES INSERT/UPDATE/DELETE
	//app.post('/api/qa/reproducciones/notas', qa_Routes.guardarReproduccionNota); //INSERT
	//app.put('/api/qa/reproducciones/notas/:id_reproduccion_nota', qa_Routes.guardarReproduccionNota); //UPDATE
	//app.delete('/api/qa/reproducciones/notas/:id_reproduccion_nota', qa_Routes.eliminarReproduccionNota);//DELETE


	//-- FIN QA




	app.post('/api/todos', todoRoutes.createTodo);
	app.get('/api/todos', todoRoutes.getTodos);
	
	//entidad: lotes_procesos
	app.get('/api/lotes-procesos/vista/:nro_lote', lotes_procesosRoutes.getLoteProcesos);
	app.get('/api/lotes-procesos/vista', lotes_procesosRoutes.getTodos);
	app.put('/api/todos/:todo_id', todoRoutes.updateTodo);
	app.delete('/api/todos/:todo_id', todoRoutes.deleteTodo);
};