(function() {
    'use strict';

    angular
        .module('IndoorMapping')
        .factory('Db', db);

    db.$inject = ['$http'];

    /* @ngInject */
    function db($http) {
        var db = {
            importMap: importMap,
            registerVisitor: registerVisitor
        };

        return db;

        function importMap(beaconUUID) {
          console.log(beaconUUID);
            // return $http.get('/svg/beacon/'+beaconUUID+'.json');
        }

        function registerVisitor(user){
            return $http.post('http://indoor-mapping.os34.tech/visitors.json',user);
        }
    }
})();
