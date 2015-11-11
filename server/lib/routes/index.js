var router = require('express').Router();
var fs = require('fs');
var path = require('path');

var routes = require('./api');
loadRoutes(routes, router, '/api');

module.exports = router;

function loadRoutes(routes, router, pathAcc) {
  pathAcc = pathAcc || '';
  if(typeof routes === 'object' && Object.keys(routes).length) {
    for (var path in routes) {
      if (routes.hasOwnProperty(path)) {
        var originalPath = path;
        // special handling for root, bind to `/`
        if(path == 'root') {
          path = '';
        }
        // convert directories with preceding underscore to colon for params
        if(path.charAt(0) == '_') {
          path = ':' + path.substring(1);
        }
        loadRoutes(routes[originalPath], router, pathAcc + '/' + path);
      }
    }
  } else {
    console.log('DEFINED ROUTE: ' + pathAcc);
    router.use(pathAcc, routes);
  }
}
