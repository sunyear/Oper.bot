/*================================================================
Server side Routing
Route Definitions

Depending on the REST route/endpoint the PostgreSQL database 
is Queried appropriately.

PostgreSQL DB table name is: 'preval_db'
=================================================================*/

var pg = require('pg');

var database = require('../config/database.js');
var conString = database.conString;
var results = [];

//const { Pool } = require('pg');
//const pool = new Pool();

var d = require('domain').create();

d.on('error', function(err){
	console.log(err)
});


module.exports = {

	/*================================================================
	QA - VISTA REPRODUCCIONES_V
	=================================================================*/
	reproducciones_v : function(req, res) {

		results = [];

		// get a pg client from the connection pool
  		//d.run(
  			pg.connect(conString, function(err, client, done) {

  			//console.log('Variable client: ' .red + (typeof(client.query))); 
   
  			if(err) throw err;
  			//throw err;

			var query = client.query("SELECT * FROM casos_reproducciones_v ORDER BY id_caso_reproduccion DESC");

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});


			//fired after last row is emitted
			query.on('end', function() {
				console.log(results)
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