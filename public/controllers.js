var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when('/search', {
        controller: 'SearchController',
        templateUrl:'search.html'
    });
});
