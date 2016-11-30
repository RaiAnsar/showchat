var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {

	console.log("hello");

	$http.get('/postlist').success(function(results){
		$scope.postlist=results;
	});

	$scope.createPost = function(){
		$http.post('/postlist', $scope.post);
		$window.location.reload();
	};

}]);
