angular.module('IndoorMapping', ['ionic', 'Devise', 'ngCordovaBeacon'])

.config([
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
