var plan = require('flightplan');

var appName = 'tc-dashboard';
var username = 'ubuntu';

var tmpDir = appName+'-' + new Date().getTime();

//From this tutorial
//https://gist.github.com/learncodeacademy/3a96aa1226c769adba39
//https://gist.github.com/learncodeacademy/35045e64d2bbe6eb14f9

// configuration
plan.target('staging', [
  {
    host: 'my-dev.thingconnect.cc',
    username: username,
    agent: process.env.SSH_AUTH_SOCK
  }
]);

plan.target('production', [
  {
    host: 'my.thingconnect.cc',
    username: username,
    agent: process.env.SSH_AUTH_SOCK
  }
]);

// run commands on localhost
plan.local(function(local) {
  local.log('Copying files to remote host');
  local.with('cd dist', function() {
    // rsync files to all the destination's hosts
    var filesToCopy = local.exec("find .", {follow: true});
    console.log(filesToCopy);
    local.transfer(filesToCopy, '/tmp/' + tmpDir);
  });

});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
  remote.log('Move folder to root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');
  remote.sudo('sudo npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {user: username});

  remote.log('Reload application');
  remote.sudo('ln -snf ~/' + tmpDir + ' ~/'+appName, {user: username});
  remote.exec('sudo restart ' + appName);
});