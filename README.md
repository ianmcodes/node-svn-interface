SVN Interface for Node.js
=========================

A programing interface to Subverstion for Node.js. Uses child process spawning to run commands. 
For SVN commands that support it, this library uses the `--xml` option and parses the xml returned with 
[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js).

[![NPM](https://nodei.co/npm/svn-interface.png)](https://nodei.co/npm/svn-interface/)

Most functions take 3 arguments
------------------------------

 * working copy (wc) or files: (String|Array)
 * options: (Object)
  * The keys should match the options from `svn help cmd` (without the - or --). The value will be the argument to the command. If an option does not take an argument (like `--dry-run`) the value should be `true`.
  * Example: `{ "username": "bob", "password": "a-secret", 'dry-run': true }`
  * If the value is an Array, the values in the array will be joined with a comma (,)
  * There is one exception, the `cwd` option. The `cwd` option will be used for resolving relitive paths for files and working coppies.
 * callback (cb): (Function)
  * Optional. Receives (error, result). 

All of the functions now return the child process that is spawned.

Currently Implemented svn commands
----------------------------------

 * add (files, options, cb) 
 * blame (files, options, cb) 
 * cat (files, options, cb) 
 * changelist (files, name, options, cb) 
 * checkout (url, path, options, cb) 
 * cleanup (wc, options, cb) 
 * commit (files, options, cb) 
 * copy (src, dest, options, cb) 
 * delete (files, options, cb) 
 * diff (files, options, cb) 
 * export (files, options, cb) 
 * import (files, options, cb) 
 * info (files, options, cb) 
 * list (files, options, cb) 
 * lock (files, options, cb) 
 * log (files, options, cb) 
 * merge (src, target, options, cb) 
 * mergeinfo (src, target, options, cb) 
 * mkdir (files, options, cb) 
 * move (src, dest, options, cb) 
 * patch (file, wc, options, cb) 
 * revert (files, options, cb) 
 * status (files, options, cb) 
 * update (files, options, cb) 

For any commands that have not been implemented yet, the `_execSVN` function is available. `_execSVN` takes the following:
 * cmd: (String). The svn command you want to use.
 * files: (String|Array). A list of files that will be added to the end (in order).
 * options: (Object) See above
 * callback (cb): (Function) Ditto
