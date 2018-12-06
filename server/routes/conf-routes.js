/*================================================================
Server side Routing
Route Definitions

Depending on the REST route/endpoint the PostgreSQL database 
is Queried appropriately.

PostgreSQL DB table name is: 'todos'
=================================================================*/
var fs = require('fs-extra');
var results = [];


module.exports = {

	/*================================================================
	READ - $http get
	=================================================================*/
	//Get all todos in the database
	cargarParams : function(req, res) {

		results = [];

		// get a pg client from the connection pool
  		//d.run(
  			
		   fs.readJson('./server/config/params.json', (err, packageObj) => {
			  if (err) console.error(err)

			  return ( res.json(packageObj) )
			})
  		//);
	}
};