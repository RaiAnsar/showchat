var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

	console.log("hello");

	$http.get('/contactlist').success(function(results){
		$scope.contactlist=results;
	});

	$scope.addContact = function(){
		$http.post('/contactlist', $scope.contact);
	};

}]);
