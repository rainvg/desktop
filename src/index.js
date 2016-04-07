var path = require('path');
var potty = require('potty');
var os = require('os');
var fs = require('fs');
var child_process = require('child_process');
var sheriff = require('sheriff');

var pkg = require('../package.json');
var scheme = pkg.scheme;
var version = pkg.version;

if(!(process.env.ELECTRON_RUN_AS_NODE))
{
  process.env.ELECTRON_RUN_AS_NODE = true;
  var child = child_process.spawn(process.argv[0], [__filename], {detached: true, stdio: ['ignore', 'ignore', 'ignore']});
  child.unref();

  setTimeout(function()
  {
    require('electron').app.exit(0);
  }, 10000);
}
else
{
  var __date__ = function()
  {
    var __fill__ = function(data)
    {
      return (data < 10 ? '0' : '') + data;
    };

    var date = new Date();

    var result = date.getUTCFullYear();
    result += __fill__(date.getUTCMonth() + 1);
    result += __fill__(date.getUTCDate());
    result += __fill__(date.getUTCHours());
    result += __fill__(date.getUTCMinutes());

    return result;
  };

  var rain_path = {root: path.resolve(os.homedir(), '.rain')};
  rain_path.lockfile = path.resolve(rain_path.root, 'singleton.lock');

  rain_path.log = {};
  rain_path.log.folder = path.resolve(rain_path.root, 'logs');
  rain_path.log.file = path.resolve(rain_path.log.folder, __date__());

  if(!fs.existsSync(rain_path.root))
    fs.mkdirSync(rain_path.root);

  sheriff.lock(rain_path.lockfile).then(function()
  {
    if(scheme === 'development')
    {
      if(!fs.existsSync(rain_path.log.folder))
        fs.mkdirSync(rain_path.log.folder);

      var __oldout__ = process.stdout.write;

      process.stdout.write = function(data)
      {
        __oldout__.apply(this, arguments);
        fs.appendFileSync(rain_path.log.file, data);
      };
    }

    var pot = new potty(path.resolve(process.env.HOME || process.env.HOMEPATH, '.rain'), 'https://rain.vg/releases/desktop-daemon/' + os.type().toLowerCase() + '-' + os.arch().toLowerCase() + '/' + scheme + '/package', {ELECTRON_RUN_AS_NODE: false, log: console.log, version: version});

    pot.on('shutdown', function()
    {
      process.exit();
    });

    pot.start();
  });

  process.once('SIGINT', function ()
  {
    process.exit();
  }).once('SIGTERM', function ()
  {
    process.exit();
  });
}
