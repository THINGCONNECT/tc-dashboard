var module = require('./module');
module.service('Sim', function($http, $q, $compile, $sce) {
  var Sim = (function() {
    Sim.displayName = 'Sim';
    var prototype = Sim.prototype, constructor = Sim;
  
    /**
     * Constructor
     * @param {Sim}
     */
    function Sim(_sim) {
    }

    var b = '/api/sim/';

    Sim.newSim = function(props) {
      return $http.post(b, props)
        .then(function(data) {
          var sim = new Sim(data.data);
          UserState.addNewSim(sim);
          return sim;
        });
    };

    Sim.loadSims = function() {
      console.log("Load Sims");
      // if(UserState.simsLoaded) return $q.when(UserState.sims);
      // UserState.simsLoaded = true;
      // return $http.get(b)
      //   .then(function(data) {
      //     var sims = data.data;
      //     console.log(sims);
      //     sims = sims.map(function(d) {
      //       var rtn = new Sim(d);
      //       UserState.addNewSim(rtn);
      //       return rtn;
      //     });
      //     return sims;
      //   })
      //   .catch(function() {
      //     UserState.simsLoaded = false;
      //   });
    };

    prototype.save = function() {
      return $http.post(b + this._id, this)
        .then(function(data) {
          return data.data;
        });
    };

    prototype.remove = function() {
      var self = this;
      return $http.delete(b + this._id)
        .then(function() {
          UserState.removeSim(self);
          return self;
        });
    };

    return Sim;
  })();
  return Sim;
});