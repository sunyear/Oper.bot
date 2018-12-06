(function(){
    'use strict';

    angular
        .module('lotes.lote')
        .controller('VisorPDFController', VisorPDFController);
        
        VisorPDFController.$inject = ['$scope', '$state', 'moment', '$filter', '$log', '$document', '$http', '$q', '$timeout', '$mdDialog', 'pdfDelegate', 'remitosActasService', 'PROCESOS', '$soap'];
        function VisorPDFController($scope, $state, moment, $filter, $log, $document, $http, $q, $timeout, $mdDialog, pdfDelegate, remitosActasService, PROCESOS, $soap) {

                var BASE64_MARKER = ';base64,';
                var dURI = '';


                $scope.acta_pdf =null;
                $scope.pdfobj = {
                	base64: '',
                	mostrar: true
                };
                //var archivo_acta_pdf = $scope.acta_pdf.nombre_archivo;


                $scope.cargarPDF = cargarPDF;
                $scope.limpiarFormulario = limpiarFormulario;
                $scope.enviarSoap = enviarSoap;



                 var base_url = "https://tapp.santafe.gov.ar/WsLicencias/LicenciasWSService";

                 function enviarSoap(){

                 	//console.log(base_url)

                 	$soap
                 		.post(base_url,"generarConstanciaRequest", {numeroDocumento: '30166000', sexo: 'M'})
                 		.then(
                 			function ads(data){
                 				console.log(data)
                 			}
                 		);

                 }



                function cargarPDF(){
                	//console.log(convertDataURIToBinary($scope.pdfobj.base64))

                	//$scope.pdfUrl = convertDataURIToBinary($scope.pdfobj.base64);//'./assets/'+archivo_acta_pdf;
                	$scope.pdfobj.mostrar = false;//
	                $timeout(
	                    function() {

	                        pdfDelegate
	                        	.$getByHandle('my-pdf-container')
	                        	.load(convertDataURIToBinary($scope.pdfobj.base64))

	                        pdfDelegate
	                        	.$getByHandle('my-pdf-container')
	                        	.zoomTo(1.5);

	                    }
	                );

                };


                function limpiarFormulario(){

                	$state.reload();

                	//numbers.map((number) => number * 2);


                }

                
                



                function convertDataURIToBinary(dataURI) {
                  //var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                  //var base64 = dataURI.substring(base64Index);
                  var raw = window.atob(dataURI);                  
                  var rawLength = raw.length;
                  var array = new Uint8Array(new ArrayBuffer(rawLength));

                  for(var i = 0; i < rawLength; i++) {
                    array[i] = raw.charCodeAt(i);
                  }
                  return array;
                }

        };
        //FIN CONTROLLER

})();