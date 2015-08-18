
var module = require('./module');

module.service('UserState', function($state, $stateParams, $q, $rootScope, $http) {

  var UserState = (function() {
    UserState.displayName = 'UserState';
    var prototype = UserState.prototype, constructor = UserState;

    /**
     * Constructor
     * @param {UserState}
     */
    function UserState() {
      this.sim = [];
      $http.get("/api/users/keys")
        .then(function(data) {
          $rootScope.maxKeys = data.data;
        });
    }

    Object.defineProperties(prototype, {
      user: {
        get: function() {
          return this._user;
        },

        set: function(user) {
          this._user = user;
          $state.go('dashboard');
        }
      }
    });

    prototype.copyOverDevice = function(device) {
      var found = this.sim.map(function(d) {
        return d._id;
      }).indexOf(device._id);

      if(found > -1) {
        this.sim[found] = device;
      }
    }

    prototype.getDevice = function() {
      return this.sim.filter(function(d) {
          return d._id == $stateParams.id;
        })[0];
    };

    prototype.editDevice = function(device) {
      $state.go('edit-device', {id: device._id});
    }

    prototype.addNewDevice = function(device) {
      this.sim.push(device);
    };

    prototype.removeDevice = function(device) {

      var found = -1;
      for (var i = 0; i < this.sim.length; i++) {
        if(this.sim[i]._id == device._id) {
          found = i;
          break;
        }
      };

      if(found > -1) {
        this.sim.splice(found, 1);
      }
      $state.go('dashboard');
    };

    prototype.reset = function() {
      this.sim = [];
      this._user = null;
      this.simLoaded = false;
    };

    prototype.logout = function() {
      var self = this;
      this._user.logout()
        .finally(function() {
          $state.go('home');
        });

    };


    return UserState;
  })();


  var _userState = new UserState();


  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    var toName = toState.name;

    // switch(toName) {
    //   case 'edit-device':
    //     UserState.device = UserState.sim.filter(function(d) {
    //       return d._id == toParams.id;
    //     })[0];
    //     break;
    // }
  });

  return new UserState();


});
