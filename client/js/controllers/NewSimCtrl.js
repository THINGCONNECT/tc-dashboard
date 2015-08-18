var module = require('./module');
module.controller('NewSimCtrl', function($scope, UserState, $state, $mdDialog) {
  $scope.hideForm = false;
  UserState.loggedIn().then(function(user){
    $scope.verifySim = function() {
      // $state.go("verify-sim", {id: $scope.sim.simId});
      UserState.newSim($scope.sim).then(function(sim){
        console.log("WUT: ", sim);
        if(sim){
          $scope.verifyCode = sim.verifyCode;
          $scope.hideForm = true;
        }else{
          console.log("wtf ", sim);
        }
      }).catch(function(err){
        console.log(err);
      });

    };
  }).catch(function(){
    $state.go('login');
  });
});