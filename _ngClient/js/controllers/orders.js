var ordersController = angular.module('ordersController', []);

ordersController.controller('OrderCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	$scope.title= "Crokes Chipper";

  	//Categories ---

  	var aPromise;
  	var itemList, discountList, OrderList, totalPrice;
  	var OrderNum = 0;


  	loadCategories = function() 
		{ 
		    $scope.asynchWait = true;
			displayCategories({});
			$scope.asynchWait = false;			 
		}

		function getCategories()
		{
        	return $http.post('/api/categories'); 			
		}		
		
		function displayCategories(filters)
		{ 		
			aPromise = getCategories(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.categories = response.data;
						  },
						  function error(error)
						  {
							  $scope.categories = [];					  
						  });
		}

		$scope.getTemplateCategoryItems = function (category) {
			return 'displaycategoryitems';
		};

  	//ITEMS ---

  	loadItems = function() 
		{ 
		    $scope.asynchWait = true;
			displayItems({});
			$scope.asynchWait = false;			 
		}

		function getItems()
		{
        	return $http.post('/api/items'); 			
		}		
		
		function displayItems(filters)
		{ 		
			aPromise = getItems(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.items = response.data;
							itemList = response.data;
						  },
						  function error(error)
						  {
							  $scope.items = [];					  
						  });
		}

		$scope.getTemplateItems = function (item) {
			return 'displayitem';
		};

	//Discounts ---

	loadDiscounts = function() 
		{ 
		    $scope.asynchWait = true;
			displayDiscounts({});
			$scope.asynchWait = false;			 
		}

		function getDiscounts()
		{
        	return $http.post('/api/discounts'); 			
		}		
		
		function displayDiscounts(filters)
		{ 		
			aPromise = getDiscounts(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.discounts = response.data;
							discountList = response.data;
						  },
						  function error(error)
						  {
							  $scope.discounts = [];					  
						  });
		}

		$scope.getTemplateDiscounts = function (discount) {
			return 'displaydiscount';
		};

	//Handle Orders

	initOrder = function(){
		OrderList = [];
		availDisList = [];
		totalPrice = 0;
		$scope.totalcost = totalPrice;
		$scope.order = OrderList;
		$scope.specialavail = availDisList;
	}

	$scope.addToOrder = function (itemId, itemQty) {

		//MUST FIX GETTING QTY VALUE FROM INPUT FIELD!!!

		var temp; var itmQty;
		var count = -1;

		if(itemQty === undefined){
			itmQty = 1;
		} else { itmQty = 1; }

		if(itemId >=0 && itemId <= itemList.length){

			$scope.items.some(function(item){
				if(item._id === itemId){
					temp = {
						_id: item._id,
						name: (item.name+" "+item.category_id),
						qty: itmQty,
						price: item.price
					}
				}
			});

		}else{
			$scope.discounts.some(function(disItem){
				if(disItem._id === itemId){
					temp = {
						_id: disItem._id,
						name: disItem.title,
						qty: itmQty,
						price: disItem.price
					}
				}
			});
		}

			if(OrderList.length === 0){
						OrderList.push(temp);
					}

				else{

					var exist = false;

				OrderList.some(function(tempChk){
					count++;
					if(tempChk._id === temp._id)
					{
						OrderList[count].qty = (tempChk.qty+itmQty);
						exist = true;
					}
				});

				if(!exist){
					OrderList.push(temp);
				}
			}

			$scope.order = OrderList;

			updateCheckoutBtn();

		};

		$scope.removeFromOrder = function (itemId, remQty) {

			var rmvQty;
			var count = -1;

			if(remQty === undefined){
			rmvQty = 1;
			} else { rmvQty = 1; }

			OrderList.some(function(tempChk){
				count++;
					if(tempChk._id === itemId)
					{
						if(tempChk.qty === 1){
							OrderList.splice(count, 1);
						} else {
							OrderList[count].qty = (tempChk.qty-rmvQty);
						}
					}
				});

			updateCheckoutBtn();
		};

		$scope.getTemplateOrder = function (order) {
			return 'displayorder';
		};

	//loadCategories();
	loadItems();
	loadDiscounts();
	initOrder();

	//Handle Checkout

	updateCheckoutBtn = function () {
		var checkoutBtn = document.getElementById("checkoutBtn");
			if(OrderList.length !== 0){
				checkoutBtn.disabled = false;
			}else{ checkoutBtn.disabled = true; }

			totalPrice = 0;

		OrderList.some(function(item){
			totalPrice += (item.price*item.qty);
		});

		$scope.totalcost = totalPrice;
		checkSpecials();
	};

	$scope.checkoutOrder = function () {
		OrderNum++;

		var OrderString = "<h4>";
		var OrderStringItems = ""

		var popupWin = window.open('', '_blank', 'width=1000,height=750');
  		popupWin.document.open();
  		OrderList.some(function(orderItem){
  			OrderStringItems += ("<li>Menu Item. " + orderItem._id + "  -  " + orderItem.name + ",    Qty. " + orderItem.qty + ",    Price. &euro;" + (orderItem.price*orderItem.qty).toFixed(2) + "</li>");
  		});

  		OrderString += "<br/><br/>Total price = &euro;"+totalPrice.toFixed(2)+"</h4>";


  		popupWin.document.write('<html><head><title>Order Number - '+OrderNum+'</title> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> </head><body onload="window.print()"><h2>Order Number - '+OrderNum+'</h2><div class="row"><div class="col-xs-10 col-xs-offset-1"><ol>'
  		 + OrderStringItems + '</ol></div></div>'+OrderString+'</body></html>');
  		popupWin.document.close();

  		initOrder();
  		updateCheckoutBtn();
	};

	//Specials Available

	checkSpecials = function (){

		var tempDisList = [];
		var availDisList = [];

		OrderList.some(function(tempItem){
			discountList.some(function(discountItem){
				discountItem.items.some(function(tempDisItems){
					if(tempItem._id === tempDisItems.items_id && tempItem._id !== 1){
						tempDisList.push(discountItem);
					}
				});
			});
		});

		$.each(tempDisList, function(i, e) {
        	if ($.inArray(e, availDisList) == -1) availDisList.push(e);
    	});

    	availDisList.sort(function (a, b) {
 			return a.index - b.index;
		});

		if(OrderList.length === 0){
			availDisList = [];
			$scope.specialavail = availDisList;
		}else{
			$scope.specialavail = availDisList;
		}
	};

	$scope.getTemplateDisAvail = function (specialavail) {
			return 'disavail';
		};

	$scope.updateOrderSpecial = function (itemId) {

		var orderUpdate = $scope.specialavail;
		var count = -1;

		orderUpdate.some(function(selectedDis){
			if(selectedDis._id === itemId){
				selectedDis.items.some(function(disItems){
					OrderList.some(function(matchItem){
						count++;
						if(matchItem._id === disItems.items_id && matchItem._id !== 1){

							var tempDis = {
								_id: selectedDis._id,
								name: selectedDis.title,
								qty: matchItem.qty,
								price: selectedDis.price
							}

								OrderList.splice(count, 1, tempDis);

								updateCheckoutBtn();

						}
					});
				});
			}
		});

		$scope.order = OrderList;

	};
  
  }]);
