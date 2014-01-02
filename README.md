SVN Interface for Node.js
=========================

A programing interface to Subverstion for Node.js. Uses child process spawning to run commands. 
For SVN commands that support it, this library uses the `--xml` option and parses the xml returned with 
[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js).

Most functions take 3 arguments
------------------------------

 * working copy (wc) or files: (String|Array)
  * Required. 
 * options: (Object)
  * Required for some functions
 * callback (cb): (Function)
  * Optional. Receives (error, result)

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
