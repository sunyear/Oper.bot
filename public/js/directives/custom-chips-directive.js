(function(){
  'use strict';

	angular
		.module('lotes.lote')
		.directive('customChip', customChip);

		function customChip($parse){
			var directive = {

				//scope: scope,
				restrict: 'EA',
				link: linkFunc

			};

			return directive;

			function linkFunc(scope, elem, attrs){
				var chipTemplateClass = attrs.class;
				elem.removeClass(chipTemplateClass);
				var mdChip = elem.parent().parent();
				//console.log(mdChip)
				//mdChip.addClass(chipTemplateClass);
				mdChip.addClass(scope.$chip.class);
			};
		}

 })();