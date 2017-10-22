angular.module('myApp.sharedProperties', [])
    .service('sharedProperties', function () {
        var property = 'First';

        var listePersonnes = [];
        var listeFamilles = [];
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
            getListePersonnes: function () {
                return listePersonnes;
            },
            setListePersonnes: function(value) {
                listePersonnes = value;
            },
            getListeFamilles: function () {
                return listeFamilles;
            },
            setListeFamilles: function(value) {
                listeFamilles = value;
            }
        };
    });