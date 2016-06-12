(function() {
    'use strict';

    angular
        .module('IndoorMapping')
        .controller('AuthCtrl', authCtrl);

    authCtrl.$inject = ['$state', 'Auth'];

    /* @ngInject */
    function authCtrl($state, Auth) {
        var self = this;
        self.login = function() {
          Auth.login(self.user).then(function() {
            //console.log(data);
            $state.go('home');
          }, function(err) {
            alert(JSON.stringify(err));
          });
        };

        self.isAuthenticated = function() {
          return Auth.isAuthenticated();
        }



        self.register = function() {
          Auth.register(self.user).then(function() {
            $state.go('home');
          });
        };
      }
})();
