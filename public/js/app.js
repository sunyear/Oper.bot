(function(){
	'use strict';
	
	angular
		.module('lotes',[
				'ngMaterial',
				'xmd.directives.xmdWizard',
				'pdf',
				'widget.scrollbar',
				'dataGrid',
				'pagination',
				'angularSoap',
				//'ngSanitize',
				'lotes.main',
				'lotes.lote'
			]
		)
})();