// modify folders in client/modules directory
// default directory for this prefix would be client/modules/default/
var modulePrefix = '/modules/default/';
var viewsPrefix = modulePrefix + 'views/';
var partialsPrefix = modulePrefix + 'partials/';

module.exports = [
  // {
  //   name: 'home',
  //   state: {
  //     url: '/',
  //     views: {
  //       header: {
  //         templateUrl: partialsPrefix + 'header.html',
  //       },
  //       content: {
  //         templateUrl: viewsPrefix + 'home.html',
  //         // controller: 'SampleCtrl',
  //       },
  //     }
  //   }
  // },
  {
    name: 'login',
    state: {
      url: '/',
      views: {
        header: {
          templateUrl: partialsPrefix + 'header.html',
        },
        content: {
          templateUrl: viewsPrefix + 'login.html',
          controller: 'LoginCtrl',
        },
      }
    }
  },
]
