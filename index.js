'use strict';

var JAVA_SOURCES = 'src/main/java';
var JAVA_TEST_SOURCES = 'src/test/java';
var JAVA_RESOURCES = 'src/main/resources';
var JAVA_TEST_RESOURCES = 'src/test/resources';
var JAVA_CLASSES = 'target/classes';

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

  function isTest() {
    return options.mvnArgs.some(arg => arg.includes('test'));
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

    var timer = setInterval(function() {
      var killed = !mvn;

      try {
        options.verbose && log('sending KILL to mvn...');
        killed || process.kill(mvn.pid);
      } catch (e) {
        options.verbose && log('received <' + e.message + '>. Already dead?');

        killed = true;
      }

      if (!killed) {
        return;
      }

      // clear timer
      clearInterval(timer);

      // restart
      runMaven();
    }, 500);
  }


  function copyResource(srcPath) {
    var relativePath = path.relative(JAVA_RESOURCES, srcPath);

    var targetPath = path.join(JAVA_CLASSES, relativePath);
    var targetDirectory = path.dirname(targetPath);

    log('%s changed, updating in %s', srcPath, JAVA_CLASSES);

    mkdirp.sync(targetDirectory);
    cp.sync(srcPath, targetPath);
  }

  function watchResources() {

    var watcher = chokidar.watch([], { usePolling: options.poll });

    watcher.on('change', copyResource);

    log('watching %s for changes...', JAVA_RESOURCES);
    watcher.add(JAVA_RESOURCES + '/**/*');

    if (isTest()) {
      log('watching %s for changes...', JAVA_TEST_RESOURCES);
      watcher.add(JAVA_TEST_RESOURCES + '/**/*');
    }

    return watcher;
  }


  function watchSources() {

    var watcher = chokidar.watch([], { usePolling: options.poll });

    watcher.on('change', reloadMaven);

    log('watching %s for changes...', JAVA_SOURCES);
    watcher.add(JAVA_SOURCES + '/**/*');

    if (isTest()) {
      log('watching %s for changes...', JAVA_TEST_SOURCES);
      watcher.add(JAVA_TEST_SOURCES + '/**/*');
    }

    return watcher;
  }


  if (options.watch) {
    watchResources();
  }

  if (options.reload) {
    watchSources();
  }

  runMaven(true);
}

module.exports = {
  log,
  logError,
  AwesomeMaven
};