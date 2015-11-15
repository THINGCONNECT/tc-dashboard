var module = require('./module');
module.controller('DashboardCtrl', function($scope, $state, UserState, Sim, $mdToast) {
  UserState.loggedIn().then(function(user){
  }).catch(function(){
    $state.go('login');
  });
  // console.log("Remove User!");
  UserState.delete();
});