// modify folders in client/modules directory
// sample directory for this prefix would be client/modules/sample/
var modulePrefix = '/modules/user/';
var viewsPrefix = modulePrefix + 'views/';
var partialsPrefix = modulePrefix + 'partials/';

module.exports = [
  {
    name: 'dashboard',
    state: {
      url: '/dashboard',
      views: {
        content: {
          templateUrl: viewsPrefix + 'dashboard.html',
          controller: 'DashboardCtrl',
        },
      }
    }
  },
  {
    name: 'new-sim',
    state: {
      url: '/new-sim',
      views: {
        content: {
          templateUrl: viewsPrefix + 'new-sim.html',
          controller: 'NewSimCtrl',
        },
      }
    }
  },
  {
    name: 'edit-sim',
    state: {
      url: '/edit-sim/:id',
      views: {
        content: {
          templateUrl: viewsPrefix + 'edit-sim.html',
          controller: 'EditSimCtrl'
        },
      }
    }
  },
]
