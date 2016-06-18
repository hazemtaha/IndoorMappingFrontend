(function() {
    'use strict';

    angular
        .module('IndoorMapping')
        .factory('Db', db);

    db.$inject = ['$http'];

    /* @ngInject */
    function db($http) {
        var db = {
            importMap: importMap
        };

        return db;

        function importMap(beaconUUID) {
            return $http.get('http://indoor-mapping.os34.tech/svg/beacon/'+beaconUUID+'.json');
            // http://indoor-mapping.os34.tech/svg/beacon/73676723-7400-0000-FFFF-0000FFFF0005.json
        }
    }
})();
