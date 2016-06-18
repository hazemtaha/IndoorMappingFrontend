angular.module('IndoorMapping', ['ionic','ngCordovaBeacon'])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider

        .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl',
        controllerAs: "authCtrl"
      })

      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'AuthCtrl',
        controllerAs: "authCtrl"
      })
      // map

      .state('map', {
        url: '/map',
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl',
        controllerAs: "mapCtrl",
      });

      $urlRouterProvider.otherwise('/home');
    }
  ])

  .run(function($ionicPlatform) {
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
