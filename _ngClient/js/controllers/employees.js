var employeesController = angular.module('employeesController', []);

employeesController.controller('EmployeeCtrl', ['$scope', 
  function($scope) {

  	$scope.title= "Employee Management";
  
  }]);