var path = require('path');
var potty = require('potty');
var os = require('os');

var pot = new potty(path.resolve(process.env.HOME || process.env.HOMEPATH, '.rain'), 'https://rain.vg/releases/desktop-daemon/' + os.type().toLowerCase() + '-' + os.arch().toLowerCase() + '/production/package', {ELECTRON_RUN_AS_NODE: false});

pot.on('shutdown', function()
{
  process.exit();
});

pot.start();
