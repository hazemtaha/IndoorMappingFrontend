var app = angular.module('IndoorMapping', ['ionic'])

 app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider,$urlRouterProvider){
  $stateProvider

  .state('home',{
    url: '/home',
    templateUrl: 'templates/home.html'
  })

  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html'
  })

  .state('register',{
    url: '/register',
    templateUrl: 'templates/register.html'
  });


  $urlRouterProvider.otherwise('/home');
}]);



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
