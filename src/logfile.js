var fs = require('fs');

var formatRegExp = /%[sdj]/g;

var _path = null;

function format(f)
{
  var util = require('util');

  if (typeof f !== 'string')
  {
    var objects = [];
    for (var i = 0; i < arguments.length; i++)
      objects.push(util.inspect(arguments[i]));

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var str = String(f).replace(formatRegExp, function(x)
  {
    switch (x)
    {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });

  for (var len = args.length, x = args[i]; i < len; x = args[++i])
  {
    if (x === null || typeof x !== 'object')
      str += ' ' + x;
    else
      str += ' ' + util.inspect(x);
  }

  return str;
}

module.exports = {
  log: function()
  {
    var string = format.apply(this, arguments) + '\n';
    var res = process.stdout.write(string);

    if(_path)
      fs.appendFileSync(_path, string);

    if (!res && !process.stdout.pendingWrite)
    {
      process.stdout.pendingWrite = true;

      process.stdout.once('drain', function ()
      {
        process.stdout.pendingWrite = false;
      });
    }
  },
  path: {
    get: function()
    {
      return _path;
    },
    set: function(path)
    {
      _path = path;
    }
  }
};
