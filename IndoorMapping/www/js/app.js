var app = angular.module('IndoorMapping', ['ionic', 'Devise', 'ngCordovaBeacon']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  'AuthProvider',
  function($stateProvider, $urlRouterProvider, AuthProvider) {

    AuthProvider.registerPath('http://indoor-mapping.os34.tech/visitors.json');
    AuthProvider.registerMethod('POST');
    AuthProvider.loginPath('http://indoor-mapping.os34.tech/visitors/sign_in.json');
    AuthProvider.loginMethod('POST');


    $stateProvider

      .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'AuthCtrl',
      controllerAs: "authCtrl",
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function() {
          $state.go('/home');
        })
      }]
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'AuthCtrl',
      controllerAs: "authCtrl",
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function() {
          $state.go('/home');
        })
      }]
    })

    // map

    .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'mapCtrl',
      controllerAs: "mapCtrl",
    });


    $urlRouterProvider.otherwise('/home');
  }
]);

app.controller('AuthCtrl', [
  '$state',
  'Auth',
  function($state, Auth) {
    this.login = function() {
      Auth.login(this.user).then(function() {
        //console.log(data);
        $state.go('home');
      }, function(err) {
        alert(JSON.stringify(err));
      });
    };

    this.isAuthenticated = function() {
      return Auth.isAuthenticated();
    }



    this.register = function() {
      Auth.register(this.user).then(function() {
        $state.go('home');
      });
    };

  }
]);

// map controller

app.controller("mapCtrl", ['$rootScope', '$ionicPlatform', '$cordovaBeacon', function($rootScope, $ionicPlatform, $cordovaBeacon) {
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
      console.log('didRangeBeaconsInRegion: ' + JSON.stringify(data.region.identifier+' : Prox : '+data.beacons[0].proximity + ' - rssi: '+ data.beacons[0].rssi + ' - tx: '+ data.beacons[0].tx +' - accuracy: '+ data.beacons[0].accuracy));
    };
  };
  $ionicPlatform.ready(function() {
    self.startScanForBeacons();
  });
}]);




app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
