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
            registerVisitor: registerVisitor,
            loginVisitor: loginVisitor,
            getBeacons: getBeacons,
            registerVisit: registerVisit,
            callibrateBeacon: callibrateBeacon
        };

        return db;

        function importMap(beaconUUID) {
            return $http.get('http://indoor-mapping.os34.tech/svg/beacon/'+beaconUUID+'.json');
            // http://indoor-mapping.os34.tech/svg/beacon/73676723-7400-0000-FFFF-0000FFFF0005.json
        }
        function getBeacons() {
          return $http.get('http://indoor-mapping.os34.tech/beacons.json');
        }

        function registerVisitor(user){
            return $http.post('http://indoor-mapping.os34.tech/visitors.json',user);
            //return $http.post('http://localhost:3000/visitors.json',user);
        }

        function loginVisitor(user){
            //return $http.post('http://localhost:3000/visitors/login.json',user);
            return $http.post('http://indoor-mapping.os34.tech/visitors/login.json',user);
        }

        function registerVisit(visitorId, beacnUuid) {
          return $http.post('http://indoor-mapping.os34.tech/beacon/'+beacnUuid+'/visit.json',{ visitor_id: visitorId });
        }
        function callibrateBeacon(beaconUuid, lat, lon) {
          console.log(lon);
          return $http.post('http://indoor-mapping.os34.tech/beacon/'+beaconUuid+'/callibrate.json',{ lon: lon, lat: lat });
        }
    }
})();
