
var module = require('./module');

module.service('User', function($http, $q) {
  var User = (function() {
    User.displayName = 'User';
    var prototype = User.prototype, constructor = User;
  
    /**
     * Constructor
     * @param {User}
     */
    function User(_user) {
      this._user = _user;
      for(var k in _user) {
        this[k] = _user[k];
      }
    }

    var baseUrl = '/api/user';

    var userCallback = function(data){
      return new User(data.data);
    }
    var userCallbackFail = function(data){
      return $q.reject("Failed to get user");
    }
    var handleUserPromise = function(q){
      return q.then(userCallback).catch(userCallbackFail);
    }
    // Static Methods
    User.login = function(loginData) {
      return handleUserPromise($http.post(baseUrl + '/login', loginData));
    };
    User.signup = function(signupData) {
      return handleUserPromise($http.post(baseUrl + '/signup', signupData));
    };
    User.status = function() {
      return handleUserPromise($http.get(baseUrl));
    };
    User.delete = function(loginData) {
      return handleUserPromise($http.delete(baseUrl, loginData));
    };

    // Class Methods
    prototype.logout = function() {
      return $http.post(baseUrl + '/logout', {});
    };


    return User;
  })();
  return User;
})