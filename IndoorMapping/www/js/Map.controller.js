(function() {
  'use strict';

  angular
    .module('IndoorMapping')
    .controller('MapCtrl', mapCtrl);

  mapCtrl.$inject = ['$rootScope', '$ionicPlatform', '$cordovaBeacon', 'Db'];

  /* @ngInject */
  function mapCtrl($rootScope, $ionicPlatform, $cordovaBeacon, Db) {
    var self = this;
    self.beacons = [{
      id: 'zone1',
      uuid: '73676723-7400-0000-FFFF-0000FFFF0005',
      major: 2,
      minor: 746
    }, {
      id: 'zone2',
      uuid: '73676723-7400-0000-FFFF-0000FFFF0001',
      major: 2,
      minor: 277
    }];

    self.startScanForBeacons = function() {
      var locationManager = cordova.plugins.locationManager;
      for (var i = 0; i < self.beacons.length; i++) {
        var beaconRegion = new locationManager.BeaconRegion(self.beacons[i].id, self.beacons[i].uuid, self.beacons[i].major, self.beacons[i].minor);
        locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();
        locationManager.startRangingBeaconsInRegion(beaconRegion).fail().done();
      }
      var delegate = new cordova.plugins.locationManager.Delegate();
      locationManager.setDelegate(delegate);
      console.log('self.delegate' + JSON.stringify(delegate));
      // Detect beacon callback
      delegate.didDetermineStateForRegion = function(pluginResult) {
        var beacon = pluginResult.region;
        // console.log('self.beacon' + JSON.stringify(beacon));
        var state = pluginResult.state === 'CLRegionStateInside' ? true : false;
        var stateStr = state ? 'in' : 'out';
        // console.log('self.stateStr' + stateStr);
        // console.log(JSON.stringify(beacon));
        console.log("did determine state for region " + JSON.stringify(pluginResult));

        //Write code to do whatever you want
      };
      delegate.didRangeBeaconsInRegion = function(data) {
        console.log('didRangeBeaconsInRegion: ' + JSON.stringify(data.region.identifier + ' : Prox : ' + data.beacons[0].proximity + ' - rssi: ' + data.beacons[0].rssi + ' - tx: ' + data.beacons[0].tx + ' - accuracy: ' + data.beacons[0].accuracy));
      };
    };
    $ionicPlatform.ready(function() {
      self.startScanForBeacons();
    });

    Db.importMap(123);
  }
})();
