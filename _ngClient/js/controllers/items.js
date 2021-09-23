var itemsController = angular.module('itemsController', []);

itemsController.controller('ItemCtrl', ['$scope', 
  function($scope) {

  	$scope.title= "Item Management";
  
  }]);