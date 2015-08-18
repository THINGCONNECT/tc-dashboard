var module = require('./module');
module.controller('NewDeviceCtrl', function($scope, Sim, $state) {
  UserState.loggedIn().then(function(user){
    $scope.newSim = function() {
      UserState.newSim($scope.sim).then(function(sim){
        $state.go('edit-sim', {id: sim.simId});
      });
    };
  }).catch(function(){
    $state.go('login');
  });
});