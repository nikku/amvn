'use strict';

var JAVA_SOURCES = 'src/main/java',
    JAVA_RESOURCES = 'src/main/resources',
    JAVA_CLASSES = 'target/classes';

var color = require('kleur');

var spawn = require('child_process').spawn;
var path = require('path');

var chokidar = require('chokidar'),
    cp = require('cp'),
    mkdirp = require('mkdirp');

var prefix = '[AMVN]';

function log(msg = '', ...args) {
  console.log(color.yellow(`${prefix} ${msg}`), ...args);
}

function logError(msg, ...args) {

  if (msg instanceof Error) {
    console.error(msg, ...args);
  } else {
    console.error(color.red(`${prefix} ${msg}`), ...args);
  }
}

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
      log('restarting mvn...');
    }

    mvn = spawn(mvnPath, options.mvnArgs, { stdio: 'inherit' });

    if (cleanStart) {
      mvn.on('exit', function(code) {

        if (code && code !== 143) {
          logError('mvn exited unexpectedly (code=%s)', code);

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
      log('sending KILL to mvn...');

      try {
        process.kill(mvn.pid);
      } catch (e) {
        log('received <' + e.message + '>. Already dead?');
      }
    }

    var timer = setInterval(function() {
      try {
        process.kill(mvn.pid, 0);
      } catch (e) {

        // does not exist

        log('mvn gone');

        // clear timer
        clearInterval(timer);

        // restart
        runMaven();
      }
    }, 500);
  }


  function registerWatch() {

    log('watching for %s changes...', JAVA_RESOURCES);

    var watcher = chokidar.watch(JAVA_RESOURCES + '/**/*', { usePolling: options.poll });

    watcher.on('change', function(srcPath) {

      var relativePath = path.relative(JAVA_RESOURCES, srcPath);

      var targetPath = path.join(JAVA_CLASSES, relativePath);
      var targetDirectory = path.dirname(targetPath);

      log('%s changed, updating in %s', srcPath, JAVA_CLASSES);

      mkdirp.sync(targetDirectory);
      cp.sync(srcPath, targetPath);
    });

    return watcher;
  }


  function registerReload() {
    log('reloading mvn on %s changes...', JAVA_SOURCES);

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

module.exports = {
  log,
  logError,
  AwesomeMaven
};