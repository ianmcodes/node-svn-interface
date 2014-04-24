'use strict;';
var xml2js = require('xml2js');
var spawn = require('child_process').spawn;
var path = require('path');

var COMMAND = "svn";

process.setMaxListeners(0);

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
  if(typeof options === 'function') {
    cb = options; options = {};
  }
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('add', files, opt, cb);
}

function blame(files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('blame', files, opt, cb);
}

function cat(files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  return _execSVN('cat', files, options, cb);
}

function changelist(files, name, options, cb) { //needs to handle change-list name
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  options[name] = true;
  return _execSVN('cl', files, options, cb);
}

function checkout (url, path, options, cb) {
  // debugger;
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  // options[url] = true;
  // options[path] = (!path) ? options.cwd : path;
  var files = [ url ];
  files.push((!path) ? options.cwd : path);
  return _execSVN('co', files, options, cb);
}

function cleanup (wc, options, cb) {
  return _execSVN('cleanup', wc, options, cb);
}

function commit (files, options, cb) {
  return _execSVN('ci', files, options, cb);
}

function copy (src, dest, options, cb) {
  return _execSVN('cp', [src, dest], options, cb);
}

function svnDelete (files, options, cb) {
  return _execSVN('rm', files, options, cb);
}

function diff (files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('di', files, opt, cb);
}

function svnExport (files, options, cb) {
  return _execSVN('export', files, options, cb);
}

function svnImport (files, options, cb) {
  return _execSVN('import', files, options, cb);
}

function info (files, options, cb) {
  //debugger;
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('info', files, opt, cb);
}

function list (files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('list', files, opt, cb);
}

function lock (files, options, cb) {
  return _execSVN('lock', files, options, cb);
}

function log (files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('log', files, opt, cb);
}

function merge (src, target, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  target = (!target) ? options.cwd : target;
  target = (!target) ? "" : target;
  if(src.split) {
    src = src.split(" ");
  }
  src.push(target);
  return _execSVN('merge', src, options, cb);
}

function mergeinfo (src, target, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  target = (!target) ? options.cwd : target;
  target = (!target) ? "" : target;
  if(src.split) {
    src = src.split(" ");
  }
  src.push(target);
  return _execSVN('mergeinfo', src, options, cb);
}

function mkdir (files, options, cb) {
  return _execSVN('mkdir', files, options, cb);
}

function move (src, dest, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  dest = (!dest) ? options.cwd : dest;
  dest = (!dest) ? "" : dest;
  if(src.split) {
    src = src.split(" ");
  }
  src.push(dest);
  return _execSVN('move', src, options, cb);
}

function status(files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  options = (!options) ? {} : options;
  var opt = { xml: true };
  opt = _extend(opt, options);
  return _execSVN('st', files, opt, cb);
}

function patch(file, wc, options, cb) {
  return _execSVN('patch', [file, wc], options, cb);
}

function revert (files, options, cb) {
  return _execSVN('revert', files, options, cb);
}

function update (files, options, cb) {
  return _execSVN('update', files, options, cb);
}

function _execSVN(cmd, files, options, cb) {
  if(typeof options === 'function') {
    cb = options; options = {};
  } 
  cb = (!cb) ? function empty() {} : cb;
  options = (!options) ? {} : options;
  files = _fixFiles(files, options);
  delete options.cwd;
  //files = files.join(" ");
  var args = _getArgs(options);
  args.unshift(cmd);
  //args.push(files);
  args = args.concat(files);
  return _process(args, cb);
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

  function parentExit(code, sig) {
    if(child.connected) {
      child.kill(sig);
    }
  }
  process.on('exit', parentExit);
  
  child.on('exit', function childExit(code, sig) {
    process.removeListener('exit', parentExit); 
    if(code === 0) {
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
        var val = (options[key].join) ? options[key].join(",") : options[key];
        args.push(val);
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

/*********
 * Utils *
 *********/
/*
 * simple extend.
 */
function _extend(obj, src) {
  if(src) {
    for(var key in src) {
      obj[key] = src[key];
    }
  }
  return obj;
}
