var path = require('path');
var potty = require('potty');
var os = require('os');
var fs = require('fs-extra');
var sheriff = require('sheriff');
var electron = require('electron');
var date_format = require('dateformat');
var genocide = require('genocide');

var logfile = require('./logfile.js');
var pkg = require('../package.json');

var rain_path = {root: path.resolve(os.homedir(), '.rain')};
rain_path.app = path.resolve(rain_path.root, 'app');
rain_path.lockfile = path.resolve(rain_path.root, 'singleton.lock');

rain_path.log = {};
rain_path.log.folder = path.resolve(rain_path.root, 'logs');
rain_path.log.file = path.resolve(rain_path.log.folder, date_format(new Date(), 'yyyymmddHHMM', true));

if(process.argv[1] === 'app')
{
  try
  {
    var app = new potty.app(rain_path.app);

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
  fs.mkdirsSync(rain_path.root);

  sheriff.lock(rain_path.lockfile).then(function()
  {
    if(pkg.scheme === 'development' || pkg.scheme === 'buggy')
    {
      fs.mkdirsSync(rain_path.log.folder);
      logfile.path.set(rain_path.log.file);
    }

    potty.logger.set(function log()
    {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(date_format(new Date(), '[yyyy-mm-dd HH:MM:ss]', true));
      args.unshift('[log]');
      logfile.log.apply(console.log, args);
    }, function warn()
    {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(date_format(new Date(), '[yyyy-mm-dd HH:MM:ss]', true));
      args.unshift('[warn]');
      logfile.log.apply(console.log, args);
    }, function error()
    {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(date_format(new Date(), '[yyyy-mm-dd HH:MM:ss]', true));
      args.unshift('[error]');
      logfile.log.apply(console.log, args);
    });

    var pot = new potty.pot('https://rain.vg/releases/desktop-daemon/' + os.type().toLowerCase() + '-' + os.arch().toLowerCase() + '/' + pkg.scheme + '/package', rain_path.root, {command: process.argv[0], args: ['app'], env: {ELECTRON_RUN_AS_NODE: undefined}}, {parent: {version: pkg.version}});

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
