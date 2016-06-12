var app = angular.module('IndoorMapping', ['ionic','Devise'])

 app.config([
  '$stateProvider',
  '$urlRouterProvider',
  //'$httpProvider',
  'AuthProvider',
  function($stateProvider,$urlRouterProvider,AuthProvider){
    //$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    AuthProvider.registerPath('http://indoor-mapping.os34.tech/visitors.json');
    AuthProvider.registerMethod('POST');
    AuthProvider.loginPath('http://indoor-mapping.os34.tech/visitors/sign_in.json');
    AuthProvider.loginMethod('POST');


  $stateProvider

  .state('home',{
    url: '/home',
    templateUrl: 'templates/home.html'
  })

  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl',
    controllerAs: "authCtrl",
    onEnter: ['$state', 'Auth', function($state, Auth) {
                Auth.currentUser().then(function (){
                  $state.go('/home');
                })
              }]
  })

  .state('register',{
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'AuthCtrl',
    controllerAs: "authCtrl",
    onEnter: ['$state', 'Auth', function($state, Auth) {
                Auth.currentUser().then(function (){
                  $state.go('/home');
                })
              }]
  });


  $urlRouterProvider.otherwise('/home');
}]);

app.controller('AuthCtrl', [
'$state',
'Auth',
function($state, Auth){
   this.login = function() {
    Auth.login(this.user).then(function(){
      //console.log(data);
      $state.go('home');
    }, function(err){
      alert(JSON.stringify(err));
    });
  };

  this.isAuthenticated = function(){
    return Auth.isAuthenticated();
  }



  this.register = function() {
    Auth.register(this.user).then(function(){
      $state.go('home');
    });
  };

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
