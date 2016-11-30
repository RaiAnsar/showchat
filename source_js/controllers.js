var myApp = angular.module('myApp', []);
var postApp = angular.module('postApp', []);

myApp.controller('movieSearchApp', ['$scope', '$http', '$window', function($scope, $http, $window) {
    //console.log('myApp.controller hello');
    $scope.search = function(){
        console.log('in the search function');
        $http.post('/movieFile', $scope.movie).success(function(results){
            $scope.movielist = results;
        });
    }

    $scope.data = {model: null,
                   availableOptions: [
                     {id: '1', name: "episode"},
                     {id: '2', name: "movie"},
                     {id: '3', name: "tv mini series"},
                     {id: '4', name: "tv movie"},
                     {id: '5', name: "tv series"},
                     {id: '6', name: "video game"},
                     {id: '7', name: "video movie"}
                  ]
                };
}]);

myApp.controller('theaterSearchController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('theaterSearchController');
    $scope.SearchMovieNearby = function(){
        console.log('in SearchMovieNearby');
        var movieName = $scope.MovieName;
        var address   = $scope.Address;
        var genre     = $scope.Genre;
        $http.post('theaterSearch',
        {
            movieName: movieName,
            address: address,
            genre: genre
        });
    }
}]);

postApp.controller('postCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
	console.log("hello");
	$http.get('/postlistData').success(function(results){
		$scope.postlist=results;
	});

	$scope.createPost = function(){
		$http.post('/postlistData', $scope.post);
		$window.location.reload();
	};
}]);

//movieSearchApp.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
//	console.log("hello");
//	$http.get('/movieList').success(function(results){
//		$scope.contactlist=results;
//	});
//	// $scope.addContact = function(){
//	// 	$http.post('/contactlist', $scope.contact);
//    //     $window.location.reload();
//	// };
//}]);
