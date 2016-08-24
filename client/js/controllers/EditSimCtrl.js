var module = require('./module');
module.controller('EditSimCtrl', function($scope, $state, UserState, $mdDialog, $mdToast, $animate, $timeout) {
  UserState.loggedIn().then(function(user){
    var simId = $state.params.id;
    var sim = UserState.simId[simId];
    $scope.sim = sim;
    $scope.payload = "Example Payload";

    $scope.updateSim = function(ev) {
      sim.save().then(function(){
        UserState.loadSims();
      });
    };
    $scope.removeSim = function(ev) {
      sim.remove().then(function(){
        UserState.loadSims();
        $state.go('dashboard');
      });
    };
    $scope.$on('$destroy', function () { 
      //Revert changes
      UserState.loadSims();
    });

    $scope.testCallbackURL = function(){
      sim.sendToCallbackURL(sim.callbackType, sim.callbackUrl, $scope.payload);
    }

    $scope.testSendSim = function(){
      sim.sendToSim($scope.payload);
    }

    $scope.$watch('sim.callbackType', function(){
      $timeout(function(){
        PR && PR.prettyPrint();
      });
    });

  }).catch(function(){
    $state.go('login');
  });
})