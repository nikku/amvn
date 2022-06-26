#!/usr/bin/env node

var kleur = require('kleur');
var which = require('which');

// or use another library to detect support
kleur.enabled = require('color-support').level > 0;

var {
  AwesomeMaven,
  log,
  logError
} = require('..');

var args = process.argv.slice(2);

function parseOptions(args) {

  var watch = false,
      reload = false,
      poll = false;

  args = args.filter(function(a) {

    if (/^(--help)$/.test(a)) {
      log('usage: amvn [special options] [maven arguments...]');
      log();
      log('Options: ');
      log(' -w, --watch                     Watch src/main/resources for changes and');
      log('                                 update target directory');
      log(' -r, --reload                    Reload app on src/main/java changes');
      log(' --poll                          Use polling during watch');
      log();
      log('Example: ');
      log(' amvn test --watch');
      log();
      log();
      log('mvn help follows...');
      log();
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