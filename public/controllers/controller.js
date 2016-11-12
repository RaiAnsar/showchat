var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {

	console.log("hello");

	

	$scope.search = function(url){
		$http.get('/search').success(function(results){
			$scope.searchlist=results;
		});
		 $window.location.href = url;
		 
	};


}]);
