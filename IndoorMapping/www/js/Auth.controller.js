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
        self.login = function() {
          
            
        };

        self.isAuthenticated = function() {
          //return Auth.isAuthenticated();
        }



        self.register = function() {
            console.log(self.user);
          Db.registerVisitor(self.user).then(function(response){
              console.log(response);
              //$state.go('home');
          });


          };
      }
})();
