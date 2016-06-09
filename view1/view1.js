'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope',
  '$http',function($scope, $http) {
/*
  $scope.toto = function()
  {
    alert('toto');
  }
*/
  console.log('fvgbh0');
  $http({
    method: 'GET',
    url: 'https://sudotrisjava.herokuapp.com/sudotris/id/3/reel'
  }).success(function(data){
  }).error(function(){
  });
  $scope.chat = "miaou";
//  $scope.toto();
}]);