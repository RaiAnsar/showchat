var webControllers = angular.module('webControllers', []);
var myApp = angular.module('myApp', []);
var postApp = angular.module('postApp', []);

webControllers.controller('SearchController', ['$scope', function($scope) {
    $http.get('/movieFile').success(function(results){
        $scope.movies = results;
    });
}]);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("myApp.controller");
	$http.get('/contactlist').success(function(results){
		$scope.contactlist = results;
	});

	$scope.addContact = function(){
		$http.post('/contactlist', $scope.contact);
	};
}]);

postApp.controller('postCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/postlist').success(function(results){
		$scope.postlist=results;
	});

	$scope.createPost = function(){
		$http.post('/postlist', $scope.post);
		$window.location.reload();
	};
}]);
