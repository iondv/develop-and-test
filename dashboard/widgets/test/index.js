'use strict';

let Base = require('modules/dashboard/base-widget');

module.exports = class Widget extends Base {
  
  job (cb) {
    try {
      let result = {
        percent: Math.floor(Math.random() * (100 - 10 + 1)) + 10
      };
      cb(null, result);
    } catch (err) {
      this.logError(err);
      cb(err);
    }    
  }
};

module.exports.init(module);
