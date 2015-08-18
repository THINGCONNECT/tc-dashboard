var module = require('./module');
module.controller('NewSimCtrl', function($scope, UserState, $state, $mdDialog, $interval) {
  $scope.hideForm = false;

  UserState.loggedIn().then(function(user){
    $scope.verifySim = function(ev) {
      var addSimId = $scope.sim.simId;
      UserState.newSim($scope.sim).then(function(sim){
        if(sim){
          $scope.verifyCode = sim.verifyCode;
          $scope.hideForm = true;

          //Check if the SIM has been added
          var timer = $interval(function() {
            //Refresh sim cards
            UserState.loadSims().then(function(sims){
              for(var i in sims){
                var sim = sims[i];
                if(sim.simId == addSimId){
                  $state.go('edit-sim', {id: addSimId});
                }
              }
            });
          }, 2000);
          //Cancel timer on page change
          $scope.$on('$destroy', function () { if(timer) $interval.cancel(timer); });

        }else{
          console.log("something bad happened");
        }
      }).catch(function(err){
        console.log(err.data.message);
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#container')))
            .clickOutsideToClose(true)
            .title('Error')
            .content(err.data.message)
            .ariaLabel('Alert Dialog Demo')
            .ok('Ok')
            .targetEvent(ev)
        );
        
        $scope.hideForm = false;
      });

    };
  }).catch(function(){
    $state.go('login');
  });
});