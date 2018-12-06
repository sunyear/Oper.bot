/*================================================================
Server side Routing
Route Definitions

Depending on the REST route/endpoint the PostgreSQL database 
is Queried appropriately.

PostgreSQL DB table name is: 'todos'
=================================================================*/

var fs = require('fs-extra');
var klawSync = require('klaw-sync')
var klaw = require('klaw')

var params_json_path = require.resolve('../config/params.json')
var params_json = require('../config/params.json');


//var files_w = klawSync(params_json.params.archivos_path + params_json.params.archivos_dir, {nodir: true})
//var files_w = klawSync(params_json.params.archivos_validar_automaticas + dir_lote, {nodir: true})

//console.log(params_json.params.archivos_path)
//var results = [];

function devolverObjElem(object, search){

                    var result = -1;

                   // console.log(object)

                    for(var key in object){
                    	//console.log(key, search)
                    	//if(object.hasOwnProperty(key)) {
                    		if(object[key].nombre === search){
                    			//console.log(26,object[key].nombre, search)
                    			result = object[key];
        					return result;
        				}
        				//}}
                    }
                    
                    return result;

                };

module.exports = {


	
	//results: [],
	generaArchivoImposicion : function(req, res) {

		var results = [];
		var reg, data_transform;

		var data = req.body;

		//console.log(data)
				
		var nro_lote = '233';
		var nombre_archivo_imp = 'I_Lote00000' + nro_lote + '_170707.txt'; //I_Lote17082203_170828.txt // I_Lote00000388_170824.txt
		var dir_destino = params_json.params.archivos_generados_directorio + '/I_' + nro_lote + '/';
		var file = dir_destino + nombre_archivo_imp;

		if(true){

			try {
				data_transform = data.join();
				data_transform = data_transform.replace(/,/gi, '\r\n');
				fs.outputFile(file, data_transform, err => {

				})
			} catch (err) {
				console.error(err)
			}

			//results.push(['Archivo de codigos: ',nombre_archivo,1]);

		}
		

		return ( res.json(results) );

	},
	/*================================================================
	Recibe un array con los codigos de barras
	genera, a partir de ese array:
		1: archivos pdf (numero_acta.pdf)
		2: archivos jpg (codigo_barras_54.jpg)
	=================================================================*/
	generaArchivosActas : function(req, res) {

		var results = [];
		
		//console.log(req.body)

		var id_tipo_acta = req.body.id_tipo_acta;
		var id_remito = req.body.id_remito;

		var data = (id_tipo_acta == 2)?req.body.codigos_barras.codigos_54:req.body.codigos_barras.codigos_54;


		var params_archivo_cod_pdf = devolverObjElem(req.body.lst_archivos, 'ACTAS_PAPEL_PDF');
		var params_archivo_cod_jpg = devolverObjElem(req.body.lst_archivos, 'ACTAS_PAPEL_JPG');


		var dir_origen = params_json.params.archivos_base_directorio; //directorio donde estan alojados los archivos base.jpg y base.pdf
		var dir_destino = params_json.params.archivos_generados_directorio + '/' + id_remito + '/imagenes/'; //directorio donde seran alojados los archivos generados por la app

		var nombre_archivo = 'codigos_barras_jpg.txt';
		var file = dir_destino + nombre_archivo;

		var nombre_archivo_pdf = '';
		var nombre_archivo_jpg = '';

		var c_jpg = c_pdf = 0;
		var codigos_img_jpg = [];

		var lst_archivos = req.body.lst_archivos;

		//var results = [];
		//console.log('DATA LENGTH', data.length)

		for(var i=0; i<=data.length -1; i++){

			var cod_barras = data[i];
			//console.log(cod_barras)
			var numero_acta =  (id_tipo_acta == 2)?cod_barras.substr(11,8):cod_barras.substr(9,8);//cod_barras.substr(11,8):cod_barras.substr(11,8);//old: cod_barras.substr(9,8):cod_barras.substr(9,8);
			
			nombre_archivo_jpg = cod_barras + params_archivo_cod_jpg.tipo_archivo;
			nombre_archivo_pdf = numero_acta + params_archivo_cod_pdf.tipo_archivo;

			if(params_archivo_cod_jpg.imprime){

				try {
						fs.copySync(dir_origen + params_archivo_cod_jpg.clonar, dir_destino+nombre_archivo_jpg)
				  //console.log(dir_origen + params_archivo_cod_pdf.clonar)
				  		c_jpg++;
				  		
				} catch (err) {
				  console.error(err)
				}
			}

			if(params_archivo_cod_pdf.imprime){

				try {
				  fs.copySync(dir_origen + params_archivo_cod_pdf.clonar, dir_destino+nombre_archivo_pdf)
				  //console.log(nombre_archivo_jpg + 'creado exitosamente')
				  c_pdf++;

				} catch (err) {
				  console.error(err)
				}
			}

		};

		var str_jpg = (c_jpg>0)?'Archivos de imagenes creados: ' + c_jpg: '';
		var str_pdf = (c_pdf>0)?'Archivos PDF creados: ' + c_pdf: '';

		if(str_jpg != '') results.push([str_jpg,0]);
		if(str_pdf != '') results.push([str_pdf,0]);
		//console.log
		//req.body.results = results;
		//console.log(results)
		return ( res.json(results) );

	},
	generaArchivoRemitosActas : function(req, res) {
		var results = [];
		
		//var actas = req.body.actas;
		//console.log('82: ',req.body)

		//console.log(req.body.sql_remitos)

		var sql_remitos = req.body.sql_remitos;
		var dir_destino = params_json.params.archivos_generados_directorio + '/' + 'Lote' + req.body.lote + '/'; // + params_json.params.archivos_dir;
		var nombre_archivo_sql = 'remito_' + req.body.id_remito + '.sql';
		var file = dir_destino + nombre_archivo_sql;

		//var file = '/tmp/this/path/does/not/exist/file.txt'
		fs.outputFile(file, sql_remitos, err => {
		  //console.log(err) // => null
		  
		  //fs.readFile(file, 'utf8', (err, data) => {
		    //console.log(data) // => hello!
		  //})
		})

		results = ['Archivo SQL creado: ',nombre_archivo_sql,1];
		//req.body.results = results;
		//console.log(results[results.length-1])
		//return ( res.json( req.body ) );

		return ( res.json(results) );

	},
	generaArchivoCodigosBarras : function(req, res) {

		var results = [];

		var params_archivo_cod_jpg = devolverObjElem(req.body.lst_archivos, 'CODIGOS_DE_BARRAS_JPG');
		var params_archivo_cod_txt = devolverObjElem(req.body.lst_archivos, 'CODIGOS_DE_BARRAS');
		
		var dir_destino = params_json.params.archivos_generados_directorio + '/' + req.body.id_remito + '/';
		
		var nombre_archivo = 'codigos_barras_' + req.body.id_remito + '.txt';
		var file = dir_destino + nombre_archivo;

		var nombre_archivo_jpg = 'codigos_barras_' + req.body.id_remito + '_JPG.txt';
		var file_jpg = dir_destino + nombre_archivo_jpg;
		
		var codigos = ( req.body.id_tipo_acta == 2)?req.body.codigos_barras.codigos_54:req.body.codigos_barras.codigos_56;
		var codigos_jpg = [];//codigos.slice(0);

		if(params_archivo_cod_txt.imprime){

			codigos = codigos.join();
			codigos = codigos.replace(/,/gi, '\r\n');
			fs.outputFile(file, codigos, err => {
			  //console.log(err) // => null
			 
			  //fs.readFile(file, 'utf8', (err, data) => {
			    //console.log(data) // => hello!
			  //})
			})
			results.push(['Archivo de codigos: ',nombre_archivo,1]);
		}

		if(params_archivo_cod_jpg.imprime){

			codigos_jpg = req.body.codigos_barras.codigos_54.slice(0);

			codigos_jpg = codigos_jpg.map(
				function(currentValue, index, arr){
					return ( currentValue+'.jpg' );
				}
			).join();

			codigos_jpg = codigos_jpg.replace(/,/gi, '\r\n');
			fs.outputFile(file_jpg, codigos_jpg, err => {
			  
			})
			results.push(['Archivo de codigos JPG: ',nombre_archivo_jpg,1]);
		}
		
		//req.body.results = results;

		return ( res.json(results) );

		//return ( res.json( req.body ) );
	},
	getParamsActasPDF : function(req, res) {

		var paramsActasPDF = {};

		paramsActasPDF = {
    						"archivos_validar_automaticas": params_json.params.archivos_validar_automaticas,
    						"muestreo_automaticas": params_json.params.muestreo_automaticas
						}

		return ( res.json(paramsActasPDF) );

	},
	publicarActasPDF: function (req, res){

		var results = [];
		var dir_destino = params_json.params.directorio_assets;//carpeta accesible via http;
		var lote = req.body[0];
		var actas_pdf = req.body.actas_pdf;

		//while()


		for (var i in actas_pdf){
			var acta_pdf = actas_pdf[i]
			//console.log(i)
			try {
				//console.log(nombre_archivo)
				fs.copySync(acta_pdf.fullpath, dir_destino+acta_pdf.nombre_archivo)
	  		//console.log(dir_origen + params_archivo_cod_pdf.clonar)
		  		
			} catch (err) {
			  console.error(err)
			}
		}

		//for(var i=0;i<actas_pdf.length;i++){
		//	acta_pdf = actas_pdf[i];
			//console.log(acta_pdf)
			//var nombre_archivo = acta_pdf.acta_pdf.substr((acta_pdf.acta_pdf.lastIndexOf('/'))+1);

			
		//}

		//var dir_ = params_json.params.archivos_validar_automaticas + dir_lote;

		/*
		try {
				fs.copySync(archivo_origen, dir_destino+nombre_archivo_jpg)
	  		//console.log(dir_origen + params_archivo_cod_pdf.clonar)
		  		
		} catch (err) {
		  console.error(err)
		}
		*/
		return ( res.json(actas_pdf) );
	},
	leerDirectorioLote : function(req, res) {
		var results = [];
		var items = [];

		var dir_lote = req.body.dir_lote;

		var dir_destino = params_json.params.archivos_validar_automaticas + dir_lote;

		items.push( klawSync(dir_destino, {nodir: true}) )
		
		//results.push(files_w.length -1);

		/*var items = []; // files, directories, symlinks, etc
		klaw(dir_destino)
		  .on('data', 
		  		function (item) {
		    		items.push(item.path)
		  		}
		  )
		  .on('end', 
		  		function () {
		    		console.dir(items) // => [ ... array of files]
		    		return;// ( res.json(items) );
		  		}
		  )*/
		  

		//results = ['Archivo SQL creado: ',nombre_archivo_sql,1];
		//req.body.results = results;
		//console.log(results[results.length-1])
		//return ( res.json( req.body ) );

		return ( res.json(items) );

	},
	guardarAppParams : function(req, res) {

		var results = [];
		
		var dir_destino = params_json.params.archivos_path + params_json.params.archivos_dir;
		
		/*var nombre_archivo = 'codigos_barras_' + req.body.id_remito + '.txt';
		var file = dir_destino + nombre_archivo;

		var nombre_archivo_jpg = 'codigos_barras_' + req.body.id_remito + '_JPG.txt';
		var file_jpg = dir_destino + nombre_archivo_jpg;
		*/
		

		//console.log(req.body)

			
			//fs.outputFile(params_json_path, "params_json", err => {
			  //console.log(err) // => null
			 
			  //fs.readFile(file, 'utf8', (err, data) => {
			    //console.log(data) // => hello!
			  //})
			//})
			//results.push(['Archivo de codigos: ',nombre_archivo,1]);
		

		
		
		//req.body.results = results;

		return ( res.json(results) );

		//return ( res.json( req.body ) );
	},

};