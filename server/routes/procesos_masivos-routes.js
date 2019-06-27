/*================================================================
Server side Routing
Route Definitions

Depending on the REST route/endpoint the PostgreSQL database 
is Queried appropriately.

PostgreSQL DB table name is: 'preval_db'

TABLAS: 
	> PROCESOS_MASIVOS
 	> PROCESOS_MASIVOS_LOTES

VISTAS:
	> PROCESOS_MASIVOS_V

=================================================================*/

var pg = require('pg');
const sql = require('sql');

var database = require('../config/database.js');
var conString = database.conString;
var results = [];

var loq = [];
//const { Pool } = require('pg');
//const pool = new Pool();

var d = require('domain').create();

d.on('error', function(err){
	console.log(err)
});


module.exports = {



	/*================================================================
	PROCESOS_MASIVOS - VISTA PROCESOS_MASIVOS_V
	=================================================================*/
	procesos_masivos_v : function(req, res) {

		console.log(req.params)

		let values = [];

		//let tabla_consulta = (req.params.hasOwnProperty('anio') && req.params.hasOwnProperty('mes'))?'procesos_masivos($1,$2)':'procesos_masivos_v';

		results = [];
		let query = {};

		let query_template = {
			lote: {
				text: "select pm.* From procesos_masivos_v pm join procesos_masivos_detalles pmd on pmd.id_proceso_masivo = pm.id_proceso_masivo where pmd.numero_lote = $1",
				values: [req.params.lote]
			},
			remito: {
				text: "select pm.* From procesos_masivos_v pm join procesos_masivos_detalles pmd on pmd.id_proceso_masivo = pm.id_proceso_masivo where pmd.numero_remito = $1",
				values: [req.params.remito]
			},
			tipo: {
				text: "select pm.* From procesos_masivos_v pm where pm.tipo_proceso = $1 ORDER BY fecha_proceso DESC",
				values: [req.params.tipo]
			},
			default: {
				//text: "SELECT * FROM procesos_masivos_v",
				//values: []
				text: "SELECT * FROM procesos_masivos($1,$2) order by fecha_proceso desc",
				values: [req.params.anio, req.params.mes]
			}
		}

		//console.log(query_template)

		
		if(req.params.hasOwnProperty('lote')){
			query = query_template.lote;
		}else if(req.params.hasOwnProperty('remito')){
			query = query_template.remito;
		}else if(req.params.hasOwnProperty('tipo')){
			query = query_template.tipo;
		}else{
			query = query_template.default;
		}

  		pg.connect(conString, function(err, client, done) {

  			if(err) throw err;
  			
			query = client.query(query)
			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});

			//fired after last row is emitted
			query.on('end', function() {
				//console.log(results)
			  client.end();
			  return res.json(results); // return all todos in JSON format
			});

			if(err)
				console.log(err);

   		})
  		//);
	},
	/*================================================================
	PROCESOS_MASIVOS_LOTES - VISTA PROCESOS_MASIVOS_LOTES_V
	=================================================================*/
	procesos_masivos_lotes_v : function(req, res) {

		results = [];
		//console.log('PASO POR ACA')
		var id_proceso_masivo = req.params.id_proceso_masivo;
		var query_lote = '';
		//console.log(req.params)
		

		// get a pg client from the connection pool
  		//d.run(
  			pg.connect(conString, function(err, client, done) {

  			//console.log('Variable client: ' .red + (typeof(client.query))); 
   
  			if(err) throw err;
  			//throw err;

  			var query = client.query("SELECT * FROM procesos_masivos_detalles_v WHERE id_proceso_masivo = $1", [id_proceso_masivo]);
			

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});


			//fired after last row is emitted
			query.on('end', function() { 
			  client.end();
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);

   		})
  		//);
	},
	/*================================================================
	PROCESOSMASIVOS - 	TABLA procesos_masivos segun id_proceso_masvo
						TABLA procesos_masivos_detalles

	UPDATE O INSERT
	=================================================================*/
	guardarProcesoMasivo : function(req, res) {

		let id_proceso_masivo_insert = 0;

		var exito = false;
		results = [];
		
		//var id_proceso_masivo = req.body.cabecera.id_proceso_masivo;

		const obj_cabecera = req.body.cabecera;
		const obj_detalle = req.body.detalle;

		let id_proceso = 0;

		let query = {};

		var resa = false;

		//var id_proceso_masivo_insert = [];

		let data_cab = {
			id_proceso_masivo: obj_cabecera.id_proceso_masivo,
			tipo_proceso: obj_cabecera.tipo_proceso,
			fecha_proceso: obj_cabecera.fecha_proceso
		};

		res.id_proceso_masivo = data_cab.id_proceso_masivo;

		//console.log(obj_cabecera)
		//console.log(obj_detalle)

		//var las = 

		console.log(data_cab.fecha_proceso, obj_cabecera.fecha_proceso)

		return (guardarDatos( res, data_cab ));

		//OPERACIONES CABECERA INSERT/UPDATE/DELETE
		function guardarDatos( res, data_cab ){

			//let query = {};


			const query_template = {
					insert: {
						text: 'INSERT INTO procesos_masivos (tipo_proceso, fecha_proceso) VALUES($1, $2) RETURNING id_proceso_masivo',
						values: [data_cab.tipo_proceso, data_cab.fecha_proceso],
					},
					update: {
						text: 'UPDATE procesos_masivos SET tipo_proceso=($2), fecha_proceso=($3) WHERE id_proceso_masivo=($1)',
					  	values: [data_cab.id_proceso_masivo,data_cab.tipo_proceso, data_cab.fecha_proceso],
					},
					delete: {
						text: 'DELETE FROM procesos_masivos WHERE id_proceso_masivo=($1)',
					  	values: [data_cab.id_proceso_masivo],
					}
				};

			let query_res = {};
			//let results;

			//console.log(pg.connect(conString))
			pg.connect(conString, function(err, client, done) {

				let arr_res = [];
				let id = 0;
				
				if(obj_cabecera.hasOwnProperty('uid')){

					let query = '';

					switch (obj_cabecera.uid){
						case 'I': //INSERT
							query = query_template.insert;
						break;
						case 'U': //UPDATE
							query = query_template.update;
						break;
						case 'D': //DELETE
							query = query_template.delete;
						break;
					}

					query_res = client.query(query)
					query_res.on('row', function(row) {
			      		data_cab.id_proceso_masivo = row.id_proceso_masivo;
			      		id_proceso_masivo = row.id_proceso_masivo;
			      		results.push(row)
					});
					query_res.on('end', function(return_data) {
						client.end();
						if(obj_detalle.length > 0){
							guardarDatosDetalles( data_cab.id_proceso_masivo );
						}
						return res.json(data_cab)
					});

					/*
					if( obj_cabecera.uid === 'I' ){//INSERT

						query_res = client.query(query.insert)
						query_res.on('row', function(row) {
				      		data_cab.id_proceso_masivo = row.id_proceso_masivo;
				      		id_proceso_masivo = row.id_proceso_masivo;
				      		results.push(row)
						});
						

					}else if( obj_cabecera.uid === 'U' ){//UPDATE

						query_res = client.query(query.update)
						query_res.on('row', function(row) {
				      		data_cab.id_proceso_masivo = row.id_proceso_masivo;
				      		id = row.id_proceso_masivo;
				      		results.push(row)
						});
										
					}
					*/

				}

				

			}); //FIN PG CONNECT

			//return data_cab.id_proceso_masivo;

			return ( res );

		}; //FIN FUNCION insertarCabecera


		//OPERACIONES DETALLE INSERT/UPDATE/DELETE
		function guardarDatosDetalles( id_proceso_masivo ){
			let data_det = {};
			let tblProcesosDetalles = sql.define({
			  name: 'procesos_masivos_detalles',
			  columns: [
			    'numero_remito',
			    'numero_lote',
			    'cantidad_actas',
			    'notificada',
			    'zona',
			    'id_tipo_envio',
			    'id_estado_envio',
			    'email_enviado',
			    'id_proceso_masivo',
			    'nota',
			    'id_proceso_masivo_detalle'
			  ]
			});

			let arr_obj_insert = [];
			let arr_obj_update = [];
			let arr_obj_delete = [];
			let query = {};
			let query_res;

			for(var i=0; i<obj_detalle.length; i++){

					//const id_proceso_masivo = res.id_proceso_masivo;

					if(obj_detalle[i].hasOwnProperty('uid')){

						let nota_texto = (obj_detalle[i].nota.texto == "''")?'':obj_detalle[i].nota.texto;

						let colr_proc = false;

						if(obj_detalle[i].colr_rech){
							colr_proc = -1;
						}else if(obj_detalle[i].colr_proc){
							colr_proc = 1;
						}else{
							colr_proc = 0;
						}

						data_det = {
								'id_proceso_masivo': id_proceso_masivo,
								//'id_proceso_masivo_detalle': obj_detalle[i].id_proceso_masivo_detalle,
								'numero_remito': obj_detalle[i].remito,
							    'numero_lote': obj_detalle[i].lote,
							    'cantidad_actas': obj_detalle[i].actas,
							    'notificada': obj_detalle[i].notificada,
							    'zona': obj_detalle[i].zona,
							    'id_tipo_envio': obj_detalle[i].id_tipo_envio,
							    'id_estado_envio': colr_proc,
							    'email_enviado': (obj_detalle[i].colr_email)?1:0,
							    'nota': obj_detalle[i].nota.texto
							};

						switch (obj_detalle[i].uid){

							case 'I': //INSERT
								arr_obj_insert.push(data_det);
							break;
							case 'U': //UPDATE
									data_det.id_proceso_masivo_detalle = obj_detalle[i].id_proceso_masivo_detalle;
									arr_obj_update.push(data_det);
							break;
							case 'D': //DELETE
									//query = query_template.delete;
							break;

						}

						
					}
				} // FIN FOR

				pg.connect(conString, function(err, client, done) {
					
					if( arr_obj_insert.length > 0){
						console.log(arr_obj_insert)
	   					query = tblProcesosDetalles.insert(arr_obj_insert).returning(tblProcesosDetalles.id_proceso_masivo).toQuery();
	   					query_res = client.query(query);
		   				query_res.on('row', function(row) {
				      		results.push(row);
						});
	   				}else if(arr_obj_update.length > 0){

	   					for(var index=0; index<arr_obj_update.length; index++){
							query = tblProcesosDetalles.update(arr_obj_update[index]).where(tblProcesosDetalles.id_proceso_masivo.equals(arr_obj_update[index].id_proceso_masivo), tblProcesosDetalles.id_proceso_masivo_detalle.equals(arr_obj_update[index].id_proceso_masivo_detalle)).toQuery();
		   					query_res = client.query(query);
			   				query_res.on('row', function(row) {
					      		results.push(row);
							});
		   				}

	   				}
	   								
					query_res.on('end', function( result_query) {	 	
				 		client.end();								 	
				 		//return res.json(results)
					});
	   			});
				
			if( id_proceso_masivo > 999999999){
				let query_res = {};
				
				//console.log(obj_detalle.length)
				for(var i=0; i<obj_detalle.length; i++){

					//const id_proceso_masivo = res.id_proceso_masivo;

					if(obj_detalle[i].hasOwnProperty('uid')){

						let nota_texto = (obj_detalle[i].nota.texto == "''")?'':obj_detalle[i].nota.texto;

						let colr_proc = false;

						if(obj_detalle[i].colr_rech){
							colr_proc = -1;
						}else if(obj_detalle[i].colr_proc){
							colr_proc = 1;
						}else{
							colr_proc = 0;
						}

						const data_det = [
		   						obj_detalle[i].remito,
		   						obj_detalle[i].lote,
		   						obj_detalle[i].actas,
		   						obj_detalle[i].notificada,
		   						obj_detalle[i].zona,
		   						obj_detalle[i].id_tipo_envio,
		   						colr_proc,
		   						(obj_detalle[i].colr_email)?1:0,
		   						id_proceso_masivo,
		   						obj_detalle[i].nota.texto,
							];

						let query_template = {
							insert: {
								text: 'INSERT INTO procesos_masivos_detalles (numero_remito, numero_lote, cantidad_actas, notificada, zona, id_tipo_envio, id_estado_envio, email_enviado, id_proceso_masivo, nota) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_proceso_masivo_detalle;',
								values: data_det,
							},
							update: {
								text: 'UPDATE procesos_masivos_detalles SET numero_remito=($1), numero_lote=($2), cantidad_actas=($3), notificada=($4), zona=($5), id_tipo_envio=($6), id_estado_envio=($7), email_enviado=($8), id_proceso_masivo=($9), nota=($10) WHERE id_proceso_masivo = $9 and id_proceso_masivo_detalle = $11',
							  	values: data_det,
							},
							delete:{
								text: 'DELETE FROM procesos_masivos_detalles WHERE id_proceso_masivo = $1 and id_proceso_masivo_detalle = $2',
							  	values: [id_proceso_masivo, obj_detalle[i].id_proceso_masivo_detalle],	
							}
						};
						console.log(obj_detalle[i].uid)
						let query = '';

						switch (obj_detalle[i].uid){

							case 'I': //INSERT
								query = query_template.insert;
							break;
							case 'U': //UPDATE
									data_det.push(obj_detalle[i].id_proceso_masivo_detalle);
									query = query_template.update;
							break;
							case 'D': //DELETE
									query = query_template.delete;
								break;

						}
						
						pg.connect(conString, function(err, client, done) {
								//console.log('322>',query)
				   				query_res = client.query(query);
				   				query_res.on('row', function(row) {
						      		results.push(row);
								});
								query_res.on('end', function( result_query) {	 	
							 		client.end();								 	
							 		//return res.json(results)
								});
				   			});
					};

				}; //FIN FOR
			}
		}; //FIN FUNCION guardarDatosDetalles

    },
    eliminarProcesoMasivo : function(req, res) {

		var results = [];
		
   		let query = {
				text: 'DELETE FROM procesos_masivos WHERE id_proceso_masivo = $1',
				values: [req.params.id_proceso_masivo]
			}

		pg.connect(conString, function(err, client, done) {

			query_res = client.query(query)
			query_res.on('row', function(row) {		  		
		  		results.push(row)
			});
			query_res.on('end', function(return_data) {
				client.end();
				return res.json(results)
			});
   		});

		return ( res );
    },
	/*================================================================
	QA - TABLA reproducciones segun id_reproduccion_nota, id_reproduccion (id_caso_reproduccion)
	UPDATE O INSERT
	=================================================================*/
	guardarReproduccion : function(req, res) {

		var exito = false;
		var results = [];
		var id_caso_reproduccion = req.body.reproduccion_encab.id_caso_reproduccion;


		if( id_caso_reproduccion === 0){ //INSERT

			console.log(req.body.reproduccion_encab.id_caso_reproduccion_new)

			
			var data = {
				id_caso_reproduccion: req.body.reproduccion_encab.id_caso_reproduccion_new,
				id_caso: 1,
				id_version_sijai: 1,
				archivo_entrada: req.body.reproduccion_encab.campos.f_reproduccion.cmp_data	|| '',
				id_estado_reproduccion: 1, //(-1,0,1)
				notas: req.body.reproduccion_nota || '',
				f_reproduccion: '2017-04-15 15:00:04'
			};

			//console.log(req.body)
			//console.log(data)
			if(exito) return ( res );
			// get a pg client from the connection pool
	  		pg.connect(conString, function(err, client, done) {

	   			client.query("INSERT INTO casos_reproducciones (id_caso_reproduccion, id_caso, id_version_sijai, archivo_entrada, id_estado_reproduccion, notas, f_reproduccion) VALUES($1,$2, $3, $4, $5, $6, $7)",
	   			[data.id_caso_reproduccion, data.id_caso, data.id_version_sijai, data.archivo_entrada, data.id_estado_reproduccion, data.notas, data.f_reproduccion]);
				
				var query = client.query("SELECT * FROM casos_reproducciones_v WHERE id_caso_reproduccion = ($1) ORDER BY f_reproduccion, version_sijai ASC",[data.id_caso_reproduccion]);

				//can stream row results back 1 at a time
				query.on('row', function(row) {
			      	results.push(row);
				});

				//fired after last row is emitted
				query.on('end', function() { 
				  client.end();
				  return res.json(results); // return all todos in JSON format
				});

				//console.log()
				if(err)
					console.log(err);
	   		});
	   		

		}else{ // UPDATE (requiere req.params)
			const reproduccion = req.body;
			//console.log('UPD:',req.body)

			var data = {
				id_caso_reproduccion: reproduccion.reproduccion_encab.id_caso_reproduccion,
				id_caso: 1,
				id_version_sijai: 1,
				archivo_entrada: reproduccion.reproduccion_encab.campos.archivo_entrada.cmp_data,
				id_estado_reproduccion: 1, //(-1,0,1)
				notas: reproduccion.reproduccion_nota,
				f_reproduccion: reproduccion.reproduccion_encab.campos.f_reproduccion.cmp_data
			};

			//console.log(data)

			pg.connect(conString, function(err, client, done) {

	   			client.query("UPDATE casos_reproducciones SET id_caso_reproduccion=($1), id_caso=($2), id_version_sijai=($3), archivo_entrada=($4), id_estado_reproduccion=($5), notas=($6), f_reproduccion=($7) WHERE id_caso_reproduccion=($1)", 
	   				[data.id_caso_reproduccion, data.id_caso, data.id_version_sijai, data.archivo_entrada, data.id_estado_reproduccion, data.notas, data.f_reproduccion]);
				var query = client.query("SELECT * FROM casos_reproducciones_v WHERE id_caso_reproduccion = ($1) ORDER BY f_reproduccion, version_sijai ASC",[data.id_caso_reproduccion]);

				//can stream row results back 1 at a time
				query.on('row', function(row) {
			      	results.push(row);
				});

				//fired after last row is emitted
				query.on('end', function() { 
					
				  client.end();
				  return res.json(results); // return all todos in JSON format
				});

				//console.log()
				if(err)
					console.log(err);
	   		});
			
		}


		//console.log(req.params)
		//console.log(req.body.reproduccion_encab)
		//console.log(req.body.reproduccion_nota)
		//console.log(req.body.resultados_obtenidos)

		//console.log(res)

		/*
		if(req.body.id_reproduccion_nota !== 0){ //UPDATE REPRODUCCIONES NOTAS

			var data = {
				id_reproduccion: req.body.id_reproduccion,
				id_reproduccion_nota : req.params.id_reproduccion_nota,
				reproduccion_nota_texto: req.body.reproduccion_nota_texto
			};

			// get a pg client from the connection pool
	  		pg.connect(conString, function(err, client, done) {

	   			client.query("UPDATE reproducciones_notas SET reproduccion_nota_texto=($3) WHERE id_reproduccion=($1) AND id_reproduccion_nota = ($2)", [data.id_reproduccion, data.id_reproduccion_nota, data.reproduccion_nota_texto]);
				var query = client.query("SELECT reproduccion_nota_texto FROM reproducciones_notas WHERE id_reproduccion_nota = ($1)",[data.id_reproduccion_nota]);

				//can stream row results back 1 at a time
				query.on('row', function(row) {
			      	results.push(row);
				});

				//fired after last row is emitted
				query.on('end', function() { 
					
				  client.end();
				  return res.json(results); // return all todos in JSON format
				});

				//console.log()
				if(err)
					console.log(err);
	   		});
   		}else{ //INSERT INTO REPRODUCCIONES NOTAS
   			var data = {
				id_reproduccion: req.body.id_reproduccion,
				id_reproduccion_nota : 0,
				reproduccion_nota_texto: req.body.reproduccion_nota_texto
			};

			// get a pg client from the connection pool
	  		pg.connect(conString, function(err, client, done) {

	   			client.query("INSERT INTO reproducciones_notas (id_reproduccion, reproduccion_nota_texto) VALUES($1,$2)", [data.id_reproduccion, data.reproduccion_nota_texto]);
				var query = client.query("SELECT reproduccion_nota_texto FROM reproducciones_notas WHERE id_reproduccion = ($1)",[data.id_reproduccion]);

				//can stream row results back 1 at a time
				query.on('row', function(row) {
			      	results.push(row);
				});

				//fired after last row is emitted
				query.on('end', function() { 
				  client.end();
				  return res.json(results); // return all todos in JSON format
				});

				//console.log()
				if(err)
					console.log(err);
	   		});



   		}
		//var id_reproduccion = req.params.id_reproduccion_nota;
		*/
		return ( res );
    },
	/*================================================================
	QA - TABLA reproduccione_notas segun id_reproduccion (id_caso_reproduccion)
	=================================================================*/
	reproducciones_notas : function(req, res) {

		results = [];
		var id_reproduccion = req.params.id_reproduccion;

		// get a pg client from the connection pool
  		//d.run(
  			pg.connect(conString, function(err, client, done) {

  			//console.log('Variable client: ' .red + (typeof(client.query))); 
   
  			if(err) throw err;
  			//throw err;

			var query = client.query("SELECT * FROM reproducciones_notas WHERE id_reproduccion = $1", [id_reproduccion]);

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});


			//fired after last row is emitted
			query.on('end', function() { 
			  client.end();
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);

   		})
  		//);
	},
	/*================================================================
	QA - TABLA reproducciones_notas segun id_reproduccion_nota, id_reproduccion (id_caso_reproduccion)
	UPDATE O INSERT
	=================================================================*/
	guardarReproduccionNota : function(req, res) {

		var results_insert = [];
		var results = [];
		//console.log(req.params.id_reproduccion_nota)
		//console.log(typeof(req.body.id_reproduccion_nota))

		//console.log(res)


		if(req.body.id_reproduccion_nota !== 0){ //UPDATE REPRODUCCIONES NOTAS

			var data = {
				id_reproduccion: req.body.id_reproduccion,
				id_reproduccion_nota : req.params.id_reproduccion_nota,
				reproduccion_nota_texto: req.body.reproduccion_nota_texto
			};

			// get a pg client from the connection pool
	  		pg.connect(conString, function(err, client, done) {

	   			client.query("UPDATE reproducciones_notas SET reproduccion_nota_texto=($3) WHERE id_reproduccion=($1) AND id_reproduccion_nota = ($2)", [data.id_reproduccion, data.id_reproduccion_nota, data.reproduccion_nota_texto]);
				var query = client.query("SELECT reproduccion_nota_texto FROM reproducciones_notas WHERE id_reproduccion_nota = ($1)",[data.id_reproduccion_nota]);

				//can stream row results back 1 at a time
				query.on('row', function(row) {
			      	results.push(row);
				});

				//fired after last row is emitted
				query.on('end', function() { 
					
				  client.end();
				  return res.json(results); // return all todos in JSON format
				});

				//console.log()
				if(err)
					console.log(err);
	   		});
   		}else{ //INSERT INTO REPRODUCCIONES NOTAS
   			var data = {
				id_reproduccion: req.body.id_reproduccion,
				id_reproduccion_nota : 0,
				reproduccion_nota_texto: req.body.reproduccion_nota_texto
			};

			// get a pg client from the connection pool
	  		pg.connect(conString, function(err, client, done) {

	   			client.query("INSERT INTO reproducciones_notas (id_reproduccion, reproduccion_nota_texto) VALUES($1,$2)", [data.id_reproduccion, data.reproduccion_nota_texto]);
				var query = client.query("SELECT reproduccion_nota_texto FROM reproducciones_notas WHERE id_reproduccion = ($1)",[data.id_reproduccion]);

				//can stream row results back 1 at a time
				query.on('row', function(row) {
			      	results.push(row);
				});

				//fired after last row is emitted
				query.on('end', function() { 
				  client.end();
				  return res.json(results); // return all todos in JSON format
				});

				//console.log()
				if(err)
					console.log(err);
	   		});



   		}
		//var id_reproduccion = req.params.id_reproduccion_nota;

		return ( res );
    },
    /*================================================================
	QA - TABLA reproducciones_notas
	DELETE
	=================================================================*/
	eliminarReproduccion : function(req, res) {

		//console.log(req.body)
		//console.log(req.body.reproducciones.length)

		var deletes = JSON.parse(req.params.caso_reproduccion);
		var results = [];

		//console.log(JSON.parse(deletes))

		var ids = [1,2];

		//console.log(idss)

		const sql_query = "DELETE FROM casos_reproducciones WHERE id_caso_reproduccion = ANY ($1) RETURNING *";
		const values = ids;

		//console.log(deletes)
		//console.log(typeof(deletes))

		//return (res);

		pg.connect(conString, function(err, client, done) {

			//console.log(sql_query)

			var query = client.query(sql_query, [deletes])
			//console.log(query)

			query.on('row', function(row) {
		      	//console.log(row.id_caso_reproduccion)
		      	results.push(row.id_caso_reproduccion);
			});


			query.on('end', function() { 
			  client.end();
			  //results = (results.length > 0)?results: $
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);

   		});




		//console.log(deletes)
   		
		//var id_reproduccion = req.params.id_reproduccion_nota;

		return ( res );
    },
    /*================================================================
	QA - TABLA reproducciones_notas
	DELETE
	=================================================================*/
	eliminarReproduccionNota : function(req, res) {

		var results_insert = [];
		var results = [];
		//console.log(req.params.id_reproduccion_nota)
		//console.log(typeof(req.body.id_reproduccion_nota))

		//console.log(res)
		var id_reproduccion_nota = req.params.id_reproduccion_nota;
		// get a pg client from the connection pool
  		pg.connect(conString, function(err, client, done) {



   			client.query("DELETE FROM reproducciones_notas WHERE id_reproduccion_nota = $1", [id_reproduccion_nota]);
			var query = client.query("SELECT * FROM reproducciones_notas WHERE id_reproduccion = $1", [id_reproduccion_nota]);

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});

			//fired after last row is emitted
			query.on('end', function() { 
			  client.end();
			  //results = (results.length > 0)?results: $
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);
   		});
   		
		//var id_reproduccion = req.params.id_reproduccion_nota;

		return ( res );
    },
    /*================================================================
	
	=================================================================*/
	obtenerCasoReproducciones : function(req, res) {

		results = [];

		/*

		pool.on('error', (err, client) => {
			console.error('Unexpected error on idle client', err)
			process.exit(-1)
		})


		pool.connect()
			.then(client => {
		    return client.query('SELECT * FROM casos_reproducciones_v ORDER BY f_reproduccion, version_sijai ASC')
		      .then(res => {
		        client.release()
		        console.log(res.rows[0])
		      })
		      .catch(e => {
		        client.release()
		        console.log(err.stack)
		      })
		})

		*/

	}
};
