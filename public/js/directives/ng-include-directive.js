/*
.directive('ngIncludeTemplate', function() {  
  return {  
    templateUrl: function(elem, attrs) { return attrs.ngIncludeTemplate; },  
    restrict: 'A',  
    scope: {  
      'ngIncludeVariables': '&'  
    },  
    link: function(scope, elem, attrs) {  
      var vars = scope.ngIncludeVariables();  
      Object.keys(vars).forEach(function(key) {  
        scope[key] = vars[key];  
      });  
    }  
  }  
})*/

(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .directive('ngIncludeTemplate', ngIncludeTemplate);

    function ngIncludeTemplate($parse){

      var directive = {
        templateUrl: templateUrlFunc,
        scope: {  
          'ngIncludeVariables': '&' 
        },
        restrict: 'A',
        link: linkFunc

      };

      return directive;

      function linkFunc(scope, elem, attrs){
        var vars = scope.ngIncludeVariables();  
        Object.keys(vars).forEach(
            function(key) {  
              scope[key] = vars[key];

            }
        );
        console.log(vars)
      };

      function templateUrlFunc(elem, attrs){
        return ( attrs.ngIncludeTemplate );
      }; 

    }

})();