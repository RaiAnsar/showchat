var app = angular.module('myApp', ['ngRoute', 'webControllers']);

app.config(function($routeProvider, $locationProvider){
    // $scope.test = 'working';
    // console.log("hello");
    $routeProvider.
    when('/search', {
        // template:'<div> hello </div>',
        templateUrl:'partials/search.html',
        controller: 'SearchController'
    // .otherwise({redirectTo: '/Error'})
    }).
    otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});
