var module = require('./module');
module.controller('NewDeviceCtrl', function($scope, Sim, $state) {
  Sim.loadSims();
  $scope.sim = {};
  $scope.newSim = function() {
    Sim.newSim($scope.sim).then(function(sim){
      $state.go('edit-sim', {id: sim._id});
    });
  };
});