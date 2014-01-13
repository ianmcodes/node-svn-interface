'use strict;';
var xml2js = require('xml2js');
var spawn = require('child_process').spawn;
var path = require('path');

var COMMAND = "svn";

/**
 * This is a dummy function for the features
 * I have not impelmented yet.
 */
function NOTDONE() {
  throw "Not implemented.";
}

/**
 * Most function take 3 arguments
 * working copy (wc) or files: (String|Array)
 *   Required.
 * options: (Object)
 *   Required for some functions
 * callback (cb): (Function)
 *   Optional. Receives (error, result)
 */

function add(files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('add', files, options, cb);
}

function blame(files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('blame', files, options, cb);
}

function cat(files, options, cb) {
  _execSVN('cat', files, options, cb);
}

function changelist(files, name, options, cb) { //needs to handle change-list name
  options = (!options) ? {} : options;
  options[name] = true;
  _execSVN('cl', files, options, cb);
}

function checkout (url, path, options, cb) {
  options = (!options) ? {} : options;
  options[url] = true;
  options[path] = (!path) ? options.cwd : path;
  _execSVN('co', "", options, cb);
}

function cleanup (wc, options, cb) {
  _execSVN('cleanup', wc, options, cb);
}

function commit (files, options, cb) {
  _execSVN('ci', files, options, cb);
}

function copy (src, dest, options, cb) {
  _execSVN('ci', [src, dest], options, cb);
}

function svnDelete (files, options, cb) {
  _execSVN('rm', files, options, cb);
}

function diff (files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('di', files, options, cb);
}

function svnExport (files, options, cb) {
  _execSVN('export', files, options, cb);
}

function svnImport (files, options, cb) {
  _execSVN('import', files, options, cb);
}

function info (files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('info', files, options, cb);
}

function list (files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('list', files, options, cb);
}

function lock (files, options, cb) {
  _execSVN('lock', files, options, cb);
}

function log (files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('log', files, options, cb);
}

function merge (src, target, options, cb) {
  target = (!target) ? options.cwd : target;
  target = (!target) ? "" : target;
  if(src.split) {
    src = src.split(" ");
  }
  src.push(target);
  _execSVN('merge', src, options, cb);
}

function mergeinfo (src, target, options, cb) {
  target = (!target) ? options.cwd : target;
  target = (!target) ? "" : target;
  if(src.split) {
    src = src.split(" ");
  }
  src.push(target);
  _execSVN('mergeinfo', src, options, cb);
}

function mkdir (files, options, cb) {
  _execSVN('mkdir', files, options, cb);
}

function move (src, dest, options, cb) {
  dest = (!dest) ? options.cwd : dest;
  dest = (!dest) ? "" : dest;
  if(src.split) {
    src = src.split(" ");
  }
  src.push(dest);
  _execSVN('merge', src, options, cb);
}

function status(files, options, cb) {
  options = (!options) ? {} : options;
  options.xml = true;
  _execSVN('st', files, options, cb);
}

function patch(file, wc, options, cb) {
  _execSVN('patch', [file, wc], options, cb);
}

function revert (files, options, cb) {
  _execSVN('revert', files, options, cb);
}

function update (files, options, cb) {
  _execSVN('update', files, options, cb);
}

function _execSVN(cmd, files, options, cb) {
  cb = (!cb) ? function empty() {} : cb;
  options = (!options) ? {} : options;
  files = _fixFiles(files, options);
  delete options.cwd;
  files = files.join(" ");
  var args = _getArgs(options);
  args.unshift(cmd);
  args.push(files);
  _process(args, cb);
}

function _process(args, cb) {
  var stdout = "", stderr = "";
  // console.log(COMMAND, args);
  var child = spawn(COMMAND, args);
  child.stdout.on("data", function appendData(data) {
    stdout += data.toString();
  });
  child.stderr.on("data", function appendData(data) {
    stderr += data.toString();
  });

  child.on('exit', function childExit(code, sig) {
    if(code == 0) {
      // console.log(stdout);
      if(args.indexOf('--xml') > -1) {
        xml2js.parseString(stdout, {
            attrkey: "_attribute",
            charkey: "_text",
            explicitCharkey: true,
            explicitArray: false
          },
          function parse(err, result) {
            cb(null, result);
          }
        );
      } else {
        cb(null, stdout);
      }
    } else {
      cb(code, stderr);
    }
  });
  return child;
}

function _getArgs(options) {
  var args = [];
  for(var key in options) {
    if(options[key]) {
      if(key.length > 1) {
        args.push("--" + key);
      } else {
        args.push("-" + key);
      }
      if(options[key] !== true) {
        args.push(options[key]);
      }
    }
  }
  return args;
}

function _fixFiles(files, options) {
  if(files.split) {
    files = files.split(" ");
  }
  if (options.cwd) {
    // for each file get absolute path
    for(var i = 0; i < files.length; i++) {
      if(!/:\/\//.test(files[i])) {
        files[i] = path.resolve(options.cwd, files[i]);
      }
    }
  }
  return files;
}

var svn = { // Long names
  add: add,
  blame: blame,
  cat: cat,
  changelist: changelist,
  checkout: checkout,
  cleanup: cleanup,
  commit: commit,
  copy: copy,
  "delete": svnDelete,
  diff: diff,
  "export": svnExport,
  //help: NOTDONE,
  "import": svnImport,
  info: info,
  list: list,
  lock: lock,
  log: log,
  merge: merge,
  mergeinfo: mergeinfo,
  mkdir: mkdir,
  move: move,
  patch: patch,
  propdel: NOTDONE,
  propedit: NOTDONE,
  propget: NOTDONE,
  proplist: NOTDONE,
  propset: NOTDONE,
  relocate: NOTDONE,
  resolve: NOTDONE,
  resolved: NOTDONE,
  revert: revert,
  status: status,
  "switch": NOTDONE,
  unlock: NOTDONE,
  update: update,
  upgrade: NOTDONE,
  _execSVN: _execSVN
};
// Aliases
svn.praise = svn.annotate = svn.ann = svn.blame;
svn.cl = svn.changelist;
svn.co = svn.checkout;
svn.ci = svn.commit;
svn.cp = svn.copy;
svn.del = svn.remove = svn.rm = svn["delete"];
svn.di = svn.diff;
//svn.? = svn.h = svn.help;
svn.ls = svn.list;
svn.mv = svn.rename = svn.ren = svn.move;
svn.pdel = svn.pd = svn.propdel;
svn.pedit = svn.pe = svn.propedit;
svn.pget = svn.pg = svn.propget;
svn.plist = svn.pl = svn.proplist;
svn.pset = svn.ps = svn.propset;
svn.stat = svn.st = svn.status;
svn.sw = svn["switch"];
svn.up = svn.update;

module.exports = svn;

