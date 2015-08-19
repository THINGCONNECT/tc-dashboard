var module = require('./module');

module.controller('LoginCtrl', function($scope, $state, UserState, $mdDialog) {
  $scope.loginForm = {};
  $scope.login = function(ev) {
    UserState.login($scope.loginForm).then(function() {
      console.log("LOGGED IN");
      $state.go('dashboard');
    }).catch(function() {
      console.log("NOT LOGGED IN");
    });
  };

  $scope.signupForm = {};
  $scope.signup = function(ev) {
    UserState.signup($scope.signupForm).then(function(){
      $state.go('dashboard');
    }).catch(function() {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Could not sign up')
          .content('Probably someone else signed up before you, or something really broke. Sorry :(.')
          .ok('Alrighty I\'ll try again')
          .targetEvent(ev)
      );
    })
  }
});