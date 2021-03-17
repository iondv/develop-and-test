const Service = require('@iondv/rest/lib/interfaces/Service');

/** Simple app service - REST module
 * @param {{dataRepo: DataRepository, metaRepo: MetaRepository}} options
 * @constructor
 */
function EchoRest(options) {
  this._route = function(router) {
    this.addHandler(router, '/', 'POST', (req) => {
      return Promise.resolve({
        echo: 'peekaboo'
      });
    });
    this.addHandler(router, '/', 'GET', (req) => {
      return Promise.resolve({
        echo: 'peekaboo'
      });
    });
  };
}
EchoRest.prototype = new Service();
module.exports = EchoRest;
