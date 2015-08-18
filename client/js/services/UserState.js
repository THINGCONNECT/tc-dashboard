
var module = require('./module');

module.service('UserState', function($q, User, Sim) {

  var UserState = (function() {
    UserState.displayName = 'UserState';
    var prototype = UserState.prototype, constructor = UserState;

    /**
     * Constructor
     * @param {UserState}
     */
    function UserState() {
      this.sim = [];
      this.user;
    }

    prototype.handleUserLogin = function(q){
      var self = this;
      return q.then(function(user){
        self.user = user;
        console.log("set user ", self);
        Sim.loadSims().then(function(sims){
          console.log("SIMS LOADED", sims);
          self.sims = sims;
        })

        return self.user;
      }).catch(function(e){
        return $q.reject();
      });
    }

    prototype.login = function(credentials){
      return this.handleUserLogin(User.login(credentials));
    }

    prototype.signup = function(credentials){
      return this.handleUserLogin(User.signup(credentials));
    }

    prototype.loggedIn = function(){
      if(this.user) return $q.when(this.user);
      return this.handleUserLogin(User.status());
    }

    prototype.logout = function(){
      if(this.user){
        this.user.logout();
        this.user = null;
      }
    }
    // Object.defineProperties(prototype, {
    //   user: {
    //     get: function() {
    //       return this._user;
    //     },

    //     set: function(user) {
    //       this._user = user;
    //       $state.go('dashboard');
    //     }
    //   }
    // });

    // prototype.getDevice = function() {
    //   return this.sim.filter(function(d) {
    //       return d._id == $stateParams.id;
    //     })[0];
    // };

    // prototype.editDevice = function(device) {
    //   $state.go('edit-device', {id: device._id});
    // }

    // prototype.addNewSim = function(sim) {
    //   console.log("Add new sim ", sim);
    //   this.sim.push(sim);
    // };

    // prototype.removeDevice = function(device) {

    //   var found = -1;
    //   for (var i = 0; i < this.sim.length; i++) {
    //     if(this.sim[i]._id == device._id) {
    //       found = i;
    //       break;
    //     }
    //   };

    //   if(found > -1) {
    //     this.sim.splice(found, 1);
    //   }
    //   $state.go('dashboard');
    // };

    // prototype.reset = function() {
    //   this.sim = [];
    //   this._user = null;
    //   this.simLoaded = false;
    // };

    // prototype.logout = function() {
    //   var self = this;
    //   this._user.logout()
    //     .finally(function() {
    //       $state.go('home');
    //     });
    // };

    return UserState;
  })();

  return new UserState();
});
