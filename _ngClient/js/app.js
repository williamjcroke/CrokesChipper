var crokesChipper = angular.module("crokesChipper", ['ngRoute', 'nrzLightify',
     'globalController', 'employeesController', 'itemsController', 'ordersController', 'ngResource' ]);

crokesChipper.run(function( ) {

});

crokesChipper.config(['$routeProvider','$httpProvider', '$provide',  '$locationProvider',
      function($routeProvider, $httpProvider, $provide,  $locationProvider ) {	 
	  
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];	  
 
			$routeProvider.
					when('/menu',{
						templateUrl: './partials/order.html',
						controller: 'OrderCtrl'
						}).				
					 //  when('/home', {
						// templateUrl: './partials/home.html',
						// controller: 'HomeCtrl'
					 //  }).	
					 //  when('/order', {
						// templateUrl: './partials/order.html',
						// controller: 'OrderCtrl'
					 //  }).
					 //  when('/item-manager', {
						// templateUrl: './partials/item-manager.html',
						// controller: 'ItemCtrl'
					 //  }).
					 //  when('/employee-manager', {
						// templateUrl: './partials/employee-manager.html',
						// controller: 'EmployeeCtrl'
					 //  }). 						
					  otherwise({
						redirectTo: '/menu'
					  });

			//$locationProvider.html5Mode(true); removes # in URL, breaks routes 
 			
  }]);