var path=require("path"),potty=require("potty"),os=require("os"),fs=require("fs-extra"),sheriff=require("sheriff"),electron=require("electron"),date_format=require("dateformat"),genocide=require("genocide"),logfile=require("./logfile.js"),pkg=require("../package.json"),scheme=pkg.scheme,version=pkg.version,rain_path={root:path.resolve(os.homedir(),".rain")};if(rain_path.app=path.resolve(rain_path.root,"app"),rain_path.lockfile=path.resolve(rain_path.root,"singleton.lock"),rain_path.log={},rain_path.log.folder=path.resolve(rain_path.root,"logs"),rain_path.log.file=path.resolve(rain_path.log.folder,date_format(new Date,"yyyymmddHHMM",!0)),"app"===process.argv[1])try{var app=new potty.app(rain_path.app);app.on("die",function(){genocide.seppuku()}),electron.app.on("ready",function(){app.start()})}catch(error){genocide.seppuku()}else fs.mkdirsSync(rain_path.root),sheriff.lock(rain_path.lockfile).then(function(){"development"===scheme&&(fs.mkdirsSync(rain_path.log.folder),logfile.path.set(rain_path.log.file)),potty.logger.set(function(){var e=Array.prototype.slice.call(arguments);e.unshift(date_format(new Date,"[yyyy-mm-dd HH:MM:ss]",!0)),e.unshift("[log]"),logfile.log.apply(console.log,e)},function(){var e=Array.prototype.slice.call(arguments);e.unshift(date_format(new Date,"[yyyy-mm-dd HH:MM:ss]",!0)),e.unshift("[warn]"),logfile.log.apply(console.log,e)},function(){var e=Array.prototype.slice.call(arguments);e.unshift(date_format(new Date,"[yyyy-mm-dd HH:MM:ss]",!0)),e.unshift("[error]"),logfile.log.apply(console.log,e)});var e=new potty.pot("https://rain.vg/releases/desktop-daemon/"+os.type().toLowerCase()+"-"+os.arch().toLowerCase()+"/"+scheme+"/package",rain_path.root,{command:process.argv[0],args:["app"],env:{ELECTRON_RUN_AS_NODE:void 0}},{parent:{version:version}});e.on("shutdown",function(){electron.app.exit(0)}),e.start()}),process.once("SIGINT",function(){electron.app.exit(0)}).once("SIGTERM",function(){electron.app.exit(0)});