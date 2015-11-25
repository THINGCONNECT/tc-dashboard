var module = require('./module');

module.controller('LoginCtrl', function($scope, $state, UserState, $mdDialog) {
  UserState.loggedIn().then(function(user){
    $state.go('dashboard');
  });
  $scope.loginForm = {};
  $scope.login = function(ev) {
    UserState.login($scope.loginForm).then(function() {
      console.log("LOGGED IN");
      $state.go('dashboard');
    }).catch(function() {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Could not log in')
          .content('Invalid username/password')
          .ok('Alrighty I\'ll try again')
          .targetEvent(ev)
      );
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
<<<<<<< HEAD
// D
// E
=======
// A
// B
// C
>>>>>>> 189910c9bf9e6a056fe9daa40ab02c9f2cf1b2a6
});