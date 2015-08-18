var module = require('./module');
module.controller('NewSimCtrl', function($scope, UserState, $state) {
  UserState.loggedIn().then(function(user){
    $scope.newSim = function() {
      UserState.newSim($scope.sim).then(function(sim){
        //console.log("NEW SIM!" , sim.verifyCode);
        //$state.go('edit-sim', {id: sim.simId});

        console.log(sim.verifyCode);
      });
    };
  }).catch(function(){
    $state.go('login');
  });
});