var webControllers = angular.module('webControllers', []);

webControllers.controller('SearchController', ['$scope', function($scope) {
   $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    $scope.displayText = "Data set"
  };
}]);
