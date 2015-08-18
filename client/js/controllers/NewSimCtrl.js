var module = require('./module');
module.controller('NewSimCtrl', function($scope, UserState, $state, $mdDialog) {
  $scope.hideForm = false;

  UserState.loggedIn().then(function(user){
    $scope.verifySim = function(ev) {
      UserState.newSim($scope.sim).then(function(sim){
        if(sim){
          $scope.verifyCode = sim.verifyCode;
          $scope.hideForm = true;
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