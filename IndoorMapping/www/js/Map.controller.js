(function() {
  'use strict';

  angular
    .module('IndoorMapping')
    .controller('MapCtrl', mapCtrl);

  mapCtrl.$inject = ['$rootScope', '$ionicPlatform', '$cordovaBeacon', 'Db'];

  /* @ngInject */
  function mapCtrl($rootScope, $ionicPlatform, $cordovaBeacon, Db) {
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
    // console.log(JSON.stringify(self.beacons));
    self.intersection = function(x0, y0, r0, x1, y1, r1) {
      var a, dx, dy, d, h, rx, ry;
      var x2, y2;

      /* dx and dy are the vertical and horizontal distances between
       * the circle centers.
       */
      dx = x1 - x0;
      dy = y1 - y0;

      /* Determine the straight-line distance between the centers. */
      d = Math.sqrt((dy * dy) + (dx * dx));

      /* Check for solvability. */
      if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
      }
      if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
      }

      /* 'point 2' is the point where the line through the circle
       * intersection points crosses the line between the circle
       * centers.
       */

      /* Determine the distance from point 0 to point 2. */
      a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

      /* Determine the coordinates of point 2. */
      x2 = x0 + (dx * a / d);
      y2 = y0 + (dy * a / d);

      /* Determine the distance from point 2 to either of the
       * intersection points.
       */
      h = Math.sqrt((r0 * r0) - (a * a));

      /* Now determine the offsets of the intersection points from
       * point 2.
       */
      rx = -dy * (h / d);
      ry = dx * (h / d);

      /* Determine the absolute intersection points. */
      var xi = x2 + rx;
      var xi_prime = x2 - rx;
      var yi = y2 + ry;
      var yi_prime = y2 - ry;

      return {
        x1: xi,
        x2: xi_prime,
        y1: yi,
        y2: yi_prime
      };
    }
    self.startScanForBeacons = function() {
      var locationManager = cordova.plugins.locationManager;
      // console.log(JSON.stringify(self.beacons));
      for (var i = 0; i < self.beacons.length; i++) {
        var beaconRegion = new locationManager.BeaconRegion(self.beacons[i].id, self.beacons[i].uuid, self.beacons[i].major, self.beacons[i].minor);
        locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();
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
      var rssiObj = {};
      delegate.didRangeBeaconsInRegion = function(data) {
        // console.log('didRangeBeaconsInRegion: ' + JSON.stringify(data.region.identifier + ' : Prox : ' + data.beacons[0].proximity + ' - rssi: ' + data.beacons[0].rssi + ' - tx: ' + data.beacons[0].tx + ' - accuracy: ' + data.beacons[0].accuracy));
        // console.log("proximity"+JSON.stringify(data.beacons[0].proximity));
        //console.log(JSON.stringify(data));
        if(data.beacons[0].proximity == "ProximityNear")
         {
           console.log("data  "+JSON.stringify(data.region.uuid));
           var beaconUuid = JSON.stringify(data.region.uuid);
           Db.importMap(data.region.uuid).then(function(response) {
             console.log("Hello1");
             //console.log(JSON.stringify(response));
             console.log(JSON.stringify(self.beacons));
             var targetBeacon;
             self.beacons.forEach(function(beacon){
               if(beacon.uuid.toUpperCase() == data.region.uuid.toUpperCase())
               {
                 targetBeacon = beacon;
               }
             });
            //  console.log("targetBeacon"+JSON.stringify(targetBeacon.x));
             self.svg.svg(response.data.svg_code);
             self.svg.circle(20).attr('fill', 'black').move(targetBeacon.x,targetBeacon.y);

           },function(response) {
             //console.log(JSON.stringify(response));
              console.log("Hello2");
           });
         }
         else {
           console.log("hello3");
         }
          console.log('didRangeBeaconsInRegion: ' + JSON.stringify(data.region.identifier + ' : Prox : ' + data.beacons[0].proximity + ' - rssi: ' + data.beacons[0].rssi + ' - tx: ' + data.beacons[0].tx + ' - accuracy: ' + data.beacons[0].accuracy));
          // var ratio_db = data.beacons[0].tx - data.beacons[0].rssi;
          // var ratio_linear = Math.pow(10, ratio_db / 10);

          // var r = Math.sqrt(ratio_linear);
          // console.log(data.region.identifier +'   '+ r);
          // console.log(data.region.identifier +'   '+ data.beacons[0].rssi);
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
