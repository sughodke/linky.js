/*!
 * index.js
 * 
 * Copyright (c) 2016
 */

// Core
var spawn = require('child_process').spawn,
    path  = require('path');

/**
 * @global
 * @public
 * @constructor
 *
 * @name Linky
 * @desc Link Layer proxy with APIs to enable loss
 *
 * @example
 * var networkLink = new Linky({from: '9995', to: '9998'});
 *
 * @param {object} opts - Linky config instance.
 */
var Linky = function(opts) {
  /*
  var defaults = {
    host : 'localhost',
    to   : '9995',
    from : '9998'
  };

  this.options = defaults.extend(opts);
  */
  this.linkProcess = null;

  //this.createLinkLayer();
};

/**
 * @public
 * @memberof Linky
 *
 * @desc Initialize the link layer by spawning the link task and listening for
 *   any command requests.
 *
 * @example
 * networkLink.createLinkLayer();
 */
Linky.prototype.createLinkLayer = function() {
  var linkPath = path.join(__dirname, 'link.js');

  this.linkProcess = spawn('node', [linkPath], { stdio: ['pipe', process.stdout, process.stderr] });
  this.linkProcess.stdin.setEncoding('utf-8');
};

/**
 * @public
 * @memberof Linky
 *
 * @desc Destroy the link layer process 
 *
 * @example
 * networkLink.destroyLinkLayer();
 */
Linky.prototype.destroyLinkLayer = function() {
  this.linkProcess.kill('SIGINT');
};

/**
 * @public
 * @memberof Linky
 *
 * @desc Helper function that sends a command to a running
 *
 * @example
 * networkLink.sendCommand({
 *   op: 'shimmy',
 *   amount: 1234
 * });
 *
 * @param {object} cmd - Command attributes to pass to the Link process
 */
Linky.prototype.sendCommand = function(cmd) {
  this.linkProcess.stdin.write(JSON.stringify(cmd));
}

/**
 * @public
 * @memberof Linky
 *
 * @desc Stalls the link, all packets will be dropped
 *
 * @example
 * networkLink.stallLinkLayer();
 */
Linky.prototype.stallLinkLayer = function() {
  this.sendCommand({
    op: 'drop',
    drop: 100        // tell the link to drop all packets
  });
};

/**
 * @public
 * @memberof Linky
 *
 * @desc Set a loss to the link, the loss value will determine how many 
 * packets will be dropped
 *
 * @example
 * networkLink.lossyLinkLayer();
 *
 * @param {int} loss - Integer value from 0 to 100 that informs the link of 
 * how much loss to set
 */
Linky.prototype.lossyLinkLayer = function(loss) {
  this.sendCommand({
    op: 'drop',
    rate: loss || 5
  });
};

/**
 * @public
 * @memberof Linky
 *
 * @desc Resets the link, all packets will be allowed to flow through
 *
 * @example
 * networkLink.resetLinkLayer();
 */
Linky.prototype.resetLinkLayer = function() {
  this.sendCommand({
    op: 'drop',
    rate: 0
  });
};

module.exports = Linky;
