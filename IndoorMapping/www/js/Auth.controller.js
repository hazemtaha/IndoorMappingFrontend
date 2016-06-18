(function() {
    'use strict';

    angular
        .module('IndoorMapping')
        .controller('AuthCtrl', authCtrl);

    authCtrl.$inject = ['$state','Db'];

    /* @ngInject */
    function authCtrl($state,Db) {
        var self = this;
        self.user = {};

        self.isAuthenticated = function() {
          //return Auth.isAuthenticated();
        }



        self.register = function() {
            console.log(self.user);
          Db.registerVisitor(self.user).then(function(response){
            console.log(JSON.stringify(response));
              if(response.data.errorMsg == "Email or Username already exists" || response.data.errorMsg == "Password not match with the confirmation"){
                  self.errorMsg = response.data.errorMsg;
              }else{
              window.localStorage.setItem("userId", response.data.visitor.id);
              window.localStorage.setItem("username", self.user.username);
              window.localStorage.setItem("password", self.user.encrypted_password);
              $state.go('home');
            }
          });


          };

        self.login = function(){
            Db.loginVisitor(self.user).then(function(response){
                if(response.data.errorMsg == "Invalid email or password"){
                  self.errorMsg = response.data.errorMsg;
              }else{
              window.localStorage.setItem("userId", response.data.visitor.id);
              window.localStorage.setItem("username", self.user.username);
              window.localStorage.setItem("password", self.user.encrypted_password);
              $state.go('home');
            }
            });
        };

        self.isLoggedIn = function() {
        if(window.localStorage.getItem("username") != undefined && window.localStorage.getItem("password") != undefined) {
            return true;
        } else {
            return false;
        }
    };

        self.logout = function(){
              window.localStorage.removeItem("userId");
              window.localStorage.removeItem("username");
              window.localStorage.removeItem("password");
              
               $state.transitionTo($state.current)
        };

      }
})();
