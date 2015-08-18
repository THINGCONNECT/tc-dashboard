var module = require('./module');
module.controller('DashboardCtrl', function($scope, Sim, $mdToast) {
  Sim.loadSims().then(function(devices) {
  })
});