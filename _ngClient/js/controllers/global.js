var globalController = angular.module('globalController', []);
 
globalController.controller('HomeCtrl', ['$scope' ,
		function($scope) {
			
			$scope.title= "Crokes POS Login";
	 
		}]);