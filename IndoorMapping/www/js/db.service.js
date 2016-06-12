(function() {
    'use strict';

    angular
        .module('IndoorMapping')
        .factory('Db', db);

    db.$inject = [];

    /* @ngInject */
    function db() {
        var db = {
            importMap: importMap
        };

        return db;

        function importMap(beaconUUID) {
          console.log(beaconUUID);
            // return $http.get('/svg/beacon/'+beaconUUID+'.json');
        }
    }
})();
