(function() {
  'use strict';

  angular
    .module('IndoorMapping')
    .controller('MapCtrl', mapCtrl);

  mapCtrl.$inject = ['$rootScope', '$ionicPlatform', '$cordovaBeacon', 'Db', '$timeout'];

  /* @ngInject */
  function mapCtrl($rootScope, $ionicPlatform, $cordovaBeacon, Db, $timeout) {
    var self = this;
    self.svg = SVG('drawing').size('1000', '1000');
    // self.beacons = [{
    //   id: 'zone1',
    //   uuid: '73676723-7400-0000-FFFF-0000FFFF0005',
    //   major: 2,
    //   minor: 746
    // }, {
    //   id: 'zone2',
    //   uuid: '73676723-7400-0000-FFFF-0000FFFF0001',
    //   major: 2,
    //   minor: 277
    // }];
    self.getNearestBeacon = function(targetBeacon, beaconsInRange) {
      var nearestBeacon, tmpDistance;
      angular.forEach(beaconsInRange, function(beacon) {
        var distance = Math.sqrt(Math.pow(targetBeacon.x - beacon.x, 2) + Math.pow(targetBeacon.y - beacon.y, 2));
        if (!tmpDistance) {
          tmpDistance = distance;
          nearestBeacon = beacon;
        } else if (distance < tmpDistance) {
          tmpDistance = distance;
          nearestBeacon = beacon;
        }
      });
      return nearestBeacon;
    }
    self.drawPath = function(sourceBeacon, destinationBeacon) {
      // var pathPoint = self.svg.circle(20).attr('fill', '#98bdc5').move(targetBeacon.x, targetBeacon.y);
      // write here
      if (sourceBeacon.x == destinationBeacon.x) {
        if (sourceBeacon.y ) {

        }
      }
    }
    self.startScanForBeacons = function() {
      var locationManager = cordova.plugins.locationManager;
      for (var i = 0; i < self.beacons.length; i++) {
        console.log(JSON.stringify(self.beacons));
        var beaconRegion = new locationManager.BeaconRegion(self.beacons[i].id, self.beacons[i].uuid, self.beacons[i].major, self.beacons[i].minor);
        locationManager.startMonitoringForRegion(beaconRegion).fail().done();
        locationManager.startRangingBeaconsInRegion(beaconRegion).fail().done();
      }
      var delegate = new cordova.plugins.locationManager.Delegate();
      locationManager.setDelegate(delegate);
      // Detect beacon callback
      delegate.didDetermineStateForRegion = function(pluginResult) {
        var beacon = pluginResult.region;
        var state = pluginResult.state === 'CLRegionStateInside' ? true : false;
        var stateStr = state ? 'in' : 'out';
        //Write code to do whatever you want
      };
      self.beaconsInRange = {};
      self.beaconsInFarRange = {};
      var isVisitedB4 = false;
      delegate.didRangeBeaconsInRegion = function(data) {
        var proximity = data.beacons[0].proximity;
        var accuracy = data.beacons[0].accuracy;
        if (proximity == "ProximityFar") {
          delete self.beaconsInRange[data.region.uuid];
          self.beaconsInFarRange[data.region.uuid];
        }
        var targetBeacon;
        if (proximity == "ProximityNear" || proximity == "ProximityImmediate") {
          if (self.beaconsInFarRange[data.region.uuid]) {
            delete self.beaconsInFarRange[data.region.uuid];
          }
          Db.importMap(data.region.uuid).then(function(response) {
            self.beacons.forEach(function(beacon) {
              if (beacon.uuid.toUpperCase() == data.region.uuid.toUpperCase()) {
                targetBeacon = beacon;
                var proxValue;
                if (proximity == "ProximityNear") {
                  proxValue = 1;
                } else {
                  proxValue = 2;
                }
                targetBeacon.proxValue = proxValue;
                targetBeacon.accuracy = accuracy;
                self.beaconsInRange[targetBeacon.uuid] = targetBeacon;
              }
            });
            console.log(JSON.stringify(targetBeacon.id) + ' - ' + data.beacons[0].accuracy + ' ' + data.beacons[0].proximity);

            self.svg.svg(response.data.svg_code);
            // console.log(JSON.stringify(self.beaconsInRange));
            angular.forEach(self.beaconsInRange, function(beacon) {
              if (targetBeacon.proxValue < beacon.proxValue) {
                targetBeacon = beacon;
              } else if (targetBeacon.accuracy > beacon.accuracy) {
                targetBeacon = beacon;
              }
            });
            if (!targetBeacon.isVisitedB4) {
              var userId = window.localStorage.getItem("userId");
              Db.registerVisit(userId, targetBeacon.uuid);
              targetBeacon.isVisitedB4 = true;
            }
            console.log(targetBeacon.isVisitedB4);
            $timeout(function() {
              angular.forEach(self.beaconsInRange, function(beacon) {
                beacon.isVisitedB4 = false;
              });
            }, ((60 * 1000) * 30));
            // start drawing
            self.svg.circle(20).attr('fill', '#98bdc5').move(targetBeacon.x, targetBeacon.y);

          }, function(response) {
            console.log(response);
          });
        } else {
          console.log("Not In Range");
        }
      };
    };
    $ionicPlatform.ready(function() {
      Db.getBeacons().then(function(response) {
        self.beacons = response.data.beacons;
        self.startScanForBeacons();
      }, function(error) {
        // console.log(JSON.stringify(error));
      });
    });
  }
})();
