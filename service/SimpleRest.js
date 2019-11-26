const Service = require('modules/rest/lib/interfaces/Service');

/** Simple app service - REST module
 * @param {{dataRepo: DataRepository, metaRepo: MetaRepository}} options
 * @constructor
 */
function SimpleRest(options) {
  this._route = function(router) {
    this.addHandler(router, '/', 'POST', (req) => {
      return Promise.resolve({
        yohoho: 'And a bottle of rum!'
      });
    });
    this.addHandler(router, '/', 'GET', (req) => {
      return Promise.resolve({
        yohoho: 'And a bottle of rum!'
      });
    });
  };
}
SimpleRest.prototype = new Service();
module.exports = SimpleRest;
