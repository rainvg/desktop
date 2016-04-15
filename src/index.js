var path = require('path');
var potty = require('potty');
var os = require('os');
var fs = require('fs');
var sheriff = require('sheriff');
var electron = require('electron');
var date_format = require('dateformat');
var genocide = require('genocide');

var pkg = require('../package.json');

var scheme = pkg.scheme;
var version = pkg.version;

var rain_path = {root: path.resolve(os.homedir(), '.rain')};
rain_path.lockfile = path.resolve(rain_path.root, 'singleton.lock');

rain_path.log = {};
rain_path.log.folder = path.resolve(rain_path.root, 'logs');
rain_path.log.file = path.resolve(rain_path.log.folder, date_format(new Date(), 'yyyymmddHHMM', true));

if(process.argv[1] === 'app')
{
  try
  {
    var app = new potty.app(path.resolve(process.env.HOME || process.env.HOMEPATH, '.rain', 'app'));

    app.on('die', function()
    {
      genocide.seppuku();
    });

    electron.app.on('ready', function()
    {
      app.start();
    });
  } catch(error)
  {
    genocide.seppuku();
  }
}
else
{
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

    var pot = new potty.pot(path.resolve(process.env.HOME || process.env.HOMEPATH, '.rain'), 'https://rain.vg/releases/desktop-daemon/' + os.type().toLowerCase() + '-' + os.arch().toLowerCase() + '/' + scheme + '/package', {command: process.argv[0], args: ['app'], env: {ELECTRON_RUN_AS_NODE: undefined}}, {log: function()
    {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(date_format(new Date(), '[yyyy-mm-dd HH:MM:ss]', true));
      console.log.apply(console.log, args);
    }, version: version});

    pot.on('shutdown', function()
    {
      electron.app.exit(0);
    });

    pot.start();
  });

  process.once('SIGINT', function ()
  {
    electron.app.exit(0);
  }).once('SIGTERM', function ()
  {
    electron.app.exit(0);
  });
}
