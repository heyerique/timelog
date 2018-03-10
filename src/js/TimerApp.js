/* jshint undef: true, unused: true, esversion: 6, asi: true */

window.angular
	.module('timerApp', [])
	.controller('Controller', Controller)
	.directive('onReadFile', readFile)

function readFile($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile)
			
            element.on('change', function(onChangeEvent) {
                var reader = new FileReader()

                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result})
                    })
                }
				
                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0])
            })
        }
    }
}