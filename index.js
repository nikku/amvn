'use strict';


var JAVA_SOURCES = 'src/main/java',
    JAVA_RESOURCES = 'src/main/resources',
    JAVA_CLASSES = 'target/classes';

var spawn = require('child_process').spawn;
var path = require('path');

var chokidar = require('chokidar'),
    colors = require('colors'),
    cp = require('cp'),
    mkdirp = require('mkdirp');


var log = console.log.bind(console);

function now() {
  return new Date().getTime();
}

function AwesomeMaven(mvnPath, options) {

  if (!(this instanceof AwesomeMaven)) {
    return new AwesomeMaven(mvnPath, options);
  }


  var mvn;

  var starting = 0;

  function runMaven(cleanStart) {
    starting = starting || now();

    if (!cleanStart) {
      log('[AMVN] restarting mvn...'.yellow);
    }

    mvn = spawn(mvnPath, options.mvnArgs, { stdio: 'inherit' });

    if (cleanStart) {
      mvn.on('exit', function(code) {

        if (code && code !== 143) {
          log('[AMVN] mvn exited unexpectedly (code=%s)'.red, code);

          process.exit(1);
        }
      });
    }

    starting = 0;
  }

  function reloadMaven() {

    // already starting
    if (starting) {
      return;
    }

    starting = now();

    if (mvn) {
      log('[AMVN] sending KILL to mvn...'.yellow);

      try {
        process.kill(mvn.pid);
      } catch (e) {
        log(('[AMVN] received <' + e.message + '>. Already dead?').yellow);
      }
    }

    var timer = setInterval(function() {
      try {
        process.kill(mvn.pid, 0);
      } catch (e) {
        // does not exist

        log('[AMVN] mvn gone'.yellow);

        // clear timer
        clearInterval(timer);

        // restart
        runMaven();
      }
    }, 500);
  }


  function registerWatch() {

    log('[AMVN] watching for %s changes...'.yellow, JAVA_RESOURCES);

    var watcher = chokidar.watch(JAVA_RESOURCES + '/**/*', { usePolling: options.poll });

    watcher.on('change', function(srcPath) {

      var relativePath = path.relative(JAVA_RESOURCES, srcPath);

      var targetPath = path.join(JAVA_CLASSES, relativePath);
      var targetDirectory = path.dirname(targetPath);

      log('[AMVN] %s changed, updating in %s'.yellow, srcPath, JAVA_CLASSES);

      mkdirp.sync(targetDirectory);
      cp.sync(srcPath, targetPath);
    });

    return watcher;
  }


  function registerReload() {
    log('[AMVN] reloading mvn on %s changes...'.yellow, JAVA_SOURCES);

    // One-liner for current directory, ignores .dotfiles
    var watcher = chokidar.watch(JAVA_SOURCES + '/**/*', { usePolling: options.poll });

    watcher.on('change', reloadMaven);
  }



  if (options.watch) {
    registerWatch();
  }

  if (options.reload) {
    registerReload();
  }

  runMaven(true);
}

module.exports = AwesomeMaven;