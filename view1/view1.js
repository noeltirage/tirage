'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
      });
    }])

    .controller('View1Ctrl', ['$scope', 'sharedProperties', function($scope, sharedProperties) {
      $scope.listeFamilles = sharedProperties.getListeFamilles();
      $scope.listePersonnes = sharedProperties.getListePersonnes();
      $scope.done = false;
      $scope.showChilds = function(item){
        item.active = !item.active;
      };
      $scope.addFamily = function() {
        $scope.listeFamilles.push(
            {
              id: $scope.listeFamilles.length,
              name: $scope.nomFamille
            });
        sharedProperties.setListeFamilles($scope.listeFamilles);
        $scope.nomFamille = ""
      };

      $scope.addPersonne = function() {
        $scope.listePersonnes.push({
          id: $scope.listePersonnes.length,
          name: $scope.nomPersonne,
          famille: $scope.selectFamille,
          offreA: null,
          aRecu: false
        });
        sharedProperties.setListePersonnes($scope.listePersonnes);
        $scope.nomPersonne = ""
      };

      $scope.tirage = function()
      {
        var error = false;
        $scope.listePersonnes.forEach(
            function(personne)
            {
              personne.offreA = null;
              personne.aRecu = false;
            }
        );
        $scope.listePersonnes.forEach(


            function(personne)
            {
              if (error == false)
              {

                var listePersonnesEligibles = [];
                $scope.listePersonnes.forEach(
                    function(personneAAjouter)
                    {

                      if ( ( personne.famille != personneAAjouter.famille ) && ( personneAAjouter.aRecu == false ) )
                      {
                        console.log('psuh');
                        listePersonnesEligibles.push(personneAAjouter)
                      }
                    }
                );
                if (listePersonnesEligibles.length > 0)
                {
                  var random = Math.floor(Math.random() * listePersonnesEligibles.length);
                  personne.offreA = listePersonnesEligibles[random].id;
                  listePersonnesEligibles[random].aRecu = true;
                }
                else
                {
                  error = true;
                }
              }

            }
        );
        if (error)
        {
          console.log('fail');
          $scope.tirage()
        }else
        {
          sharedProperties.setListePersonnes($scope.listePersonnes);
          $scope.done = true;
        }

      }

    }]);