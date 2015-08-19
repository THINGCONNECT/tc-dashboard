var module = require('./module');
module.controller('EditSimCtrl', function($scope, $state, UserState, $mdDialog, $mdToast, $animate) {
  UserState.loggedIn().then(function(user){
    var simId = $state.params.id;
    var sim = UserState.simId[simId];
    $scope.sim = sim;
    $scope.updateSim = function(ev) {
      console.log("Update");
    };
  }).catch(function(){
    $state.go('login');
  });

  // Device.loadDevices()
  //   .then(function() {
  //     $scope.device = new Device(UserState.getDevice());
  //   });

  // $scope.updateDevice = function(ev) {
  //   $scope.device.save()
  //     .then(function() {
  //       UserState.copyOverDevice($scope.device);
  //       $scope.device = new Device(UserState.getDevice());
  //       $mdToast.show(
  //         $mdToast.simple()
  //         .content('Updated!')
  //         .position('top right')
  //         .hideDelay(5000)
  //       );
  //     })
  //     .catch(function() {
  //       $mdDialog.show(
  //         $mdDialog.alert()
  //         .parent(angular.element(document.body))
  //         .title('Could not update device')
  //         .content('Sorry :(')
  //         .ok('Alrighty')
  //         .targetEvent(ev)
  //       );
  //     })
  // };

  // $scope.removeDevice = function(device) {
  //   $scope.device.remove();
  // };

  // $scope.addNewApi = function(api) {
  //   $scope.device.API.push({
  //     details: {

  //     },
  //     creds: {

  //     },
  //     name: api,
  //   });
  // };

  // $scope.removeApi = function(idx) {
  //   $scope.device.API.splice(idx, 1);
  // }
})