(function(){
  'use strict';

	angular
		.module('lotes.lote')
		.directive('focusOn', focusOn);

		function focusOn($parse){
			
			var directive = {
				link: linkFunc
			};

			return directive;

			function linkFunc(scope, elem, attr){
				scope.$on('focusOn', function(e, name) {
			    	if(name === attr.focusOn) {
			          elem[0].focus();
			        }
				});
			};
		}

 })();