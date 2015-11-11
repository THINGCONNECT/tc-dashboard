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
      for(var k in _sim) {
        this[k] = _sim[k];
      }
    }

    var baseUrl = '/api/sim';

    Sim.newSim = function(props) {
      return $http.post(baseUrl + '/verify', props).then(function(data) {
        return data.data;
      });
    };

    Sim.loadSims = function() {
      return $http.get(baseUrl).then(function(data) {
        var sims = data.data;
        sims = sims.map(function(d) {
          return new Sim(d);
        });
        return sims;
      })
      .catch(function() {
        return [];
      });
    };

    prototype.save = function() {
      return $http.post(baseUrl + this.simId, this).then(function(data) {
        return data.data;
      });
    };

    prototype.remove = function() {
      var self = this;
      return $http.delete(baseUrl + this.simId).then(function() {
        return self;
      });
    };

    return Sim;
  })();
  return Sim;
});