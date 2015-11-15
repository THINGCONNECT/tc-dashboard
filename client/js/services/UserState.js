
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
      this.sims = [];
      this.simId = {};
      this.user;
    }

    prototype.loadSims = function(){
      var self = this;
      return Sim.loadSims().then(function(sims){
        self.sims = sims;
        self.simId = {};
        for(var i in sims){
          var sim = sims[i];
          self.simId[sim.simId] = sim;
        }
        return sims;
      })
    }

    prototype.handleUserLogin = function(q){
      var self = this;
      return q.then(function(user){
        self.user = user;
        console.log("set user ", self);

        return self.loadSims().then(function(){
          return self.user;
        });
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

    prototype.delete = function(credentials){
      return this.handleUserLogin(User.delete(credentials));
    }

    prototype.newSim = function(sim) {
      return Sim.newSim(sim);
      // console.log("Add new sim ", sim);
      // this.sim.push(sim);
    };

    // prototype.getDevice = function() {
    //   return this.sim.filter(function(d) {
    //       return d._id == $stateParams.id;
    //     })[0];
    // };

    // prototype.editDevice = function(device) {
    //   $state.go('edit-device', {id: device._id});
    // }



    return UserState;
  })();

  return new UserState();
});
