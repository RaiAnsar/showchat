var webControllers = angular.module('webControllers', []);

webControllers.controller('SearchController', ['$scope', 'CommonData'  , function($scope, CommonData) {
   $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"
  };
}]);
