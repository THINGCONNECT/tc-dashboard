var async = require('async');

function keysExist(obj, array, cb){
  async.each(array, function(item, callback){
    if(obj[item]){
      callback();
    }else{
      callback(item + " does not exist");
    }
  }, cb);
};

module.exports = {
  keysExist: keysExist
};