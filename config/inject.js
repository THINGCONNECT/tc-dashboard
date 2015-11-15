/**
 * Specifies where to inject from.
 */

module.exports = {
  dev: {
    'index.jade': [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-ui-router/build/angular-ui-router.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-material/angular-material.css',
    ],
  },
  dist: {
    'index.jade': [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-ui-router/build/angular-ui-router.min.js',
      'node_modules/angular-animate/angular-animate.min.js',
      'node_modules/angular-aria/angular-aria.min.js',
      'node_modules/angular-material/angular-material.min.js',
      'node_modules/angular-material/angular-material.min.css'
    ],
  }
};