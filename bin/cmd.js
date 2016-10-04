#!/usr/bin/env node

var args = process.argv;

if (/node(\.exe)?$/.test(args[0])) {
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

var which = require('which'),
    amvn = require('../');

var options = parseOptions(args);

which('mvn', function(err, mvnPath) {

  if (err) {
    console.error('failed to grab mvn. do you have maven on your path?'.red);
    console.error(err.message);
    return process.exit(1);
  }

  console.log('[AMVN] make maven awesome'.yellow);
  amvn(mvnPath, options);
});
