var path = require('path');
var potty = require('potty');
var os = require('os');
var fs = require('fs');
var child_process = require('child_process');
var locker = require('proper-lockfile');

if(!(process.env.ELECTRON_RUN_AS_NODE))
{
  process.env.ELECTRON_RUN_AS_NODE = true;
  child_process.spawn(process.argv[0], [__filename], {detached: true, stdio: ['inherit', 'inherit', 'inherit']});
  require('electron').app.exit(0);
}

var rain_path = {root: path.resolve(os.homedir(), '.rain')};
rain_path.lockfile = path.resolve(rain_path.root, 'singleton.lock');

if(!fs.existsSync(rain_path.root))
  fs.mkdirSync(rain_path.root);

fs.openSync(rain_path.lockfile, 'w');

var pot;
locker.lock(rain_path.lockfile, function(error)
{
  if(error)
    process.exit();
  else
  {
    pot = new potty(path.resolve(process.env.HOME || process.env.HOMEPATH, '.rain'), 'https://rain.vg/releases/desktop-daemon/' + os.type().toLowerCase() + '-' + os.arch().toLowerCase() + '/production/package', {ELECTRON_RUN_AS_NODE: false});

    pot.on('shutdown', function()
    {
      process.exit();
    });

    pot.start();
  }
});

process.once('SIGINT', function ()
{
  process.exit();
}).once('SIGTERM', function ()
{
  process.exit();
});
