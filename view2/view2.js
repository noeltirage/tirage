'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'sharedProperties', function($scope, sharedProperties) {
  sharedProperties.setProperty("ybgvfd");
  $scope.listeFamilles = sharedProperties.getListeFamilles();
  $scope.listePersonnes = sharedProperties.getListePersonnes();

  $scope.showChilds = function(item){
    item.active = !item.active;
  };

}]);