var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

	console.log("hello");

	$http.get('/search').success(function(results){
		$scope.searchlist=results;
	});

}]);
