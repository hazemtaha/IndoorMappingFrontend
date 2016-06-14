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
        }
    }
})();
