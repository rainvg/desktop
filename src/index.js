var path = require('path');
var potty = require('potty');

var pot = new potty.pot(path.resolve(process.env.HOME || process.env.HOMEPATH, '.rain'), 'https://rain.vg/releases/desktop/' + process.platform + '-' + process.arch + '/package', {ELECTRON_RUN_AS_NODE: false});

pot.on('shutdown', function()
{
  process.exit();
});

pot.start();
