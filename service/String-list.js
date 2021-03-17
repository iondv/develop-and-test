const Service = require('@iondv/rest/lib/interfaces/Service');

/**
 * @param {{dataRepo: DataRepository, echoClassName: String}} options
 * @constructor
 */
function listClassString(options) {
    this._route = function(router) {
    /**
     * @param {Request} req
     * @returns {Promise}
     * @private
     */
    this.addHandler(router, '/', 'POST', (req) => {
      return new Promise(function (resolve, reject) {
        try {
          let filter = [];
          if (req.body.string_text)
            filter.push({string_text: {$eq: req.body.string_text}});
          if (req.body.string_miltilinetext)
            filter.push({string_miltilinetext: {$eq: req.body.string_miltilinetext}});
          if (filter.length === 0)
            filter = {};
          else if (filter.length === 1)
            filter = filter[0];
           else
            filter = {$and: filter};
          options.dataRepo.getList(options.stringClassName, {filter: filter}).then(function (results) {
            let items = [];
            for (let i = 0; i < results.length; i++) {
              const props = results[i].getProperties();
              const item = {};
              for (let p in props) {
                if (props.hasOwnProperty(p))
                  item[props[p].getName()] = props[p].getValue();
              }
              items.push(item);
            }
            resolve({data: items});
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  };
}

listClassString.prototype = new Service();

module.exports = listClassString;