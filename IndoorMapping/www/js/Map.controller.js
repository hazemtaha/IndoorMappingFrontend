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

    self.startScanForBeacons = function() {
      var locationManager = cordova.plugins.locationManager;
      for (var i = 0; i < self.beacons.length; i++) {
        // console.log(JSON.stringify(self.beacons));
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
      self.lnPoints = [];
      self.pathBlocks = [];
      var isVisitedB4 = false;
      delegate.didRangeBeaconsInRegion = function(data) {
        // console.log("data" + JSON.stringify(data));
        var proximity = data.beacons[0].proximity;
        var accuracy = data.beacons[0].accuracy;
        if (proximity == "ProximityFar") {
          delete self.beaconsInRange[data.region.uuid];
          // console.log("self.beaconsInFarRange" + JSON.stringify(self.beaconsInFarRange));
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
            // console.log(JSON.stringify(targetBeacon.id) + ' - ' + data.beacons[0].accuracy + ' ' + data.beacons[0].proximity);
 // shortest path code
            if (self.svg.attr('name') != response.data.id) {
              self.svg.svg(response.data.svg_code);
              self.svg.attr('name', response.data.id);
              var grid = new PF.Grid(self.svg.width(), self.svg.height());
              var blocks = self.svg.select('.map-element').members;
              var shortestPath = {
                from: {},
                to: {}
              };
              blocks.forEach(function(block) {
                if (block.attr('name') != 'beacon') {
                  for (var x = block.bbox().x; x <= block.bbox().x2; x++) {
                    for (var y = block.bbox().y; y <= block.bbox().y2; y++) {
                      grid.setWalkableAt(x, y, false);
                    }
                  }
                } else if (block.attr('name') == 'beacon') {
                  block.remove();
                }
                block.on('click', function(ev) {
                  // console.log("\n \n \n ------------------------Entered -------------------------------- \n \n \n ");
                  self.pathBlocks.push({block: block, oldFill: block.attr('fill')});
                  block.attr('fill', '#89c4f4');
                  if (!Object.keys(shortestPath.from).length) {
                    shortestPath.from.x = (block.bbox().cx + block.bbox().w / 2) + 1;
                    shortestPath.from.y = block.bbox().cy;
                  } else if (!Object.keys(shortestPath.to).length) {
                    shortestPath.to.x = (block.bbox().cx + block.bbox().w / 2) + 1;
                    shortestPath.to.y = block.bbox().cy;
                  }
                  if (Object.keys(shortestPath.from).length && Object.keys(shortestPath.to).length) {
                    console.log("\n \n \n ------------------------Entered -------------------------------- \n \n \n ");
                    console.log("\n \n \n ------------------------Entered -------------------------------- \n \n \n ");
                    var finder = new PF.AStarFinder();
                    self.gridBackup = grid.clone();
                    console.log(JSON.stringify(shortestPath));
                    var path = finder.findPath(shortestPath.from.x, shortestPath.from.y, shortestPath.to.x, shortestPath.to.y, grid);
                    grid = self.gridBackup;
                    if (self.lnPoints.length) {
                      angular.forEach(self.lnPoints, function(lnPoint) {
                        lnPoint.remove();
                      })
                    }
                    self.lnPoints = [];
                    console.log(JSON.stringify(path));
                    for (var i = 0; i < (path.length - 1); i++) {
                      self.lnPoints.push(self.svg.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]).stroke({
                        width: 5
                      }).attr('fill', '#98bdc5'));
                    }
                    shortestPath.from = {};
                    shortestPath.to = {};
                    self.pathBlocks[0].block.attr('fill', self.pathBlocks[0].oldFill)
                    self.pathBlocks[1].block.attr('fill', self.pathBlocks[1].oldFill)
                    self.pathBlocks = [];
                  }
                });
              });
            }
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
            $timeout(function() {
              angular.forEach(self.beaconsInRange, function(beacon) {
                beacon.isVisitedB4 = false;
              });
            }, ((60 * 1000) * 30));
            // start drawing
            self.svg.circle(20).attr('fill', '#98bdc5').move(targetBeacon.x, targetBeacon.y);
          }, function(response) {
            // console.log(response);
          });
        } else {
          // console.log("Not In Range");
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
