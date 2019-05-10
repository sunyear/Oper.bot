
(function(){
  'use strict';

    angular
        .module('lotes.lote')
        .directive('ngFileModel', ngFileModel);

         function ngFileModel($parse){
            var directive = {

                scope: {},
                restrict: 'A',
                link: linkFunc,
                bindings: {
                    files: '='
                }

            };

            return directive;

            function linkFunc(scope, element, attrs){
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                console.log(scope.files)
                //element.removeClass("ng-hide");
               // scope.$watch()
               console.log(this)
                element.on('change', function () {
                    var values = [];
                    console.log(element[0].files)
                    angular.forEach(element[0].files, function (item) {
                        var value = {
                           // File Name 
                            name: item.name,
                            //File Size 
                            size: item.size,
                            //File URL to view 
                            url: URL.createObjectURL(item),
                            // File Input Value 
                            _file: item
                        };
                        values.push(value);
                    });
                    scope.$apply(function () {
                        if (isMultiple) {
                            modelSetter(scope, values);
                        } else {
                            modelSetter(scope, values[0]);
                        }
                    });    
                });
            };
        };
})();