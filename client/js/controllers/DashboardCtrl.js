var module = require('./module');
module.controller('DashboardCtrl', function($scope, $state, UserState, Sim, $mdToast) {
  UserState.loggedIn().then(function(user){
  }).catch(function(){
    $state.go('login');
  });


  var socket = io();
  // socket.emit('event', {data:"test"});
  $scope.socketData = [];
  socket.on('incoming', function (data) {
    console.log("INCOMING SIM DATA ", data);
    var message = data.simId + ":" + data.payload
    data.timestamp = new Date().getTime();
    $scope.socketData.push(data);

    $mdToast.show(
      $mdToast.simple()
      .content(message)
      .position('top right')
      .hideDelay(5000)
    );
  });

});