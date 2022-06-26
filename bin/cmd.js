#!/usr/bin/env node

var args = process.argv;

if (/node(js)?(\.exe)?$/.test(args[0])) {
  args = args.slice(2);
}

function parseOptions(args) {

  var watch = false,
      reload = false,
      poll = false;

  args = args.filter(function(a) {

    if (/^(--help)$/.test(a)) {
      console.log();
      console.log('usage: amvn [special options] [maven arguments...]'.yellow);
      console.log();
      console.log('Special Options: '.yellow);
      console.log(' -w,--watch                        Watch src/main/resources for changes and'.yellow);
      console.log('                                   update target directory'.yellow);
      console.log(' -r,--reload                       Reload app on src/main/java changes'.yellow);
      console.log(' --poll                            Use polling during watch'.yellow);
      console.log();
      console.log('mvn help follows...'.yellow);
    }

    if (/^(--poll)$/.test(a)) {
      return !(poll = true);
    }

    if (/^(--reload|-r)$/.test(a)) {
      return !(reload = true);
    }

    if (/^(--watch|-w)$/.test(a)) {
      return !(watch = true);
    }

    // must be maven argument
    return true;
  });

  return {
    mvnArgs: args,
    watch: watch,
    poll: poll,
    reload: reload
  };
}

var which = require('which');

var {
  AwesomeMaven,
  log,
  logError
} = require('..');

var options = parseOptions(args);

async function run() {

  try {
    const mvnPath = await which('mvn');

    log('make maven awesome');
    AwesomeMaven(mvnPath, options);
  } catch (err) {
    logError('failed to grab mvn. do you have maven on your path?');
    logError(err);

    process.exit(1);
  }
}

run().catch(err => {
  logError(err);

  process.exit(1);
});