const Service = require('modules/rest/lib/interfaces/Service');

var opts = {
  // keepAlive: 30000,
  // connectTimeoutMS: 30000,
  useNewUrlParser: true
};

function SecurityTest(options) {
  this._route = function(router) {
    this.addHandler(router, '/', 'GET', (req) => {
      const drepo = options.dataRepo.ds.db.admin();
      let dbl;
      return options.dataRepo.getList('class_string@develop-and-test')
        .then(legal_list => drepo.listDatabases({})
          .then((dbs) => {
            return Promise.resolve(dbs.databases)
          }));
    });
  };
}
SecurityTest.prototype = new Service();
module.exports = SecurityTest;
