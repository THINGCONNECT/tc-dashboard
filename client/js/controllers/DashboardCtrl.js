var module = require('./module');
module.controller('DashboardCtrl', function($scope, $state, UserState, Sim, $mdToast) {
  UserState.loggedIn().then(function(user){
    console.log("logged in user ", user);
    // user.logout();
    console.log("static version: ", UserState);

  }).catch(function(){
    $state.go('login');
  });
});