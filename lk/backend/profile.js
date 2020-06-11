/**
 * Created by kalias_90 on 09.08.17.
 */
const __ = require('core/strings').unprefix('i18n');

/**
 * @param {{}} options
 * @param {Auth} options.auth
 * @param {DataSource} options.ds
 * @param {express} options.module
 * @constructor
 */
function ProfileEditor(options) {
  let module = options.module;

  this.init = function () {
    module.get('/' + module.locals.module + '/lk-profile', function (req, res) {
      let user = options.auth.getUser(req);
      res.render('lk-profile', {
        title: __('Profile editor'),
        user: user,
        name: user.name(),
        properties: user.properties() || {}
      });
    });

    module.post('/' + module.locals.module + '/lk-profile', function (req, res) {
      let user = options.auth.getUser(req);
      let uid = user.id().split('@');
      let updates = {};
      for (let nm in req.body) {
        if (req.body.hasOwnProperty(nm)) {
          updates['properties.' + nm] = req.body[nm];
        }
      }
      options.ds.update('ion_user', {id: uid[0], type: uid[1]}, updates)
        .then((u)=>{
          res.redirect('/' + module.locals.module + '/lk-profile');
        });
    });
    return Promise.resolve();
  };
}

module.exports = ProfileEditor;
