$(function() {
	var roles;

	function getUserRoles(cb) {
		if (roles) {
			cb(roles);
		} else {
			$.ajax({
	      url: '/pm-widget/user-roles',
	      success: function (data) {
	      	roles = data;
	      	cb(roles);
	      },
	      error: function(err) {
	      	console.error(err);
	      	roles = {project: {}, eventBasic: {}};
	      	cb(roles);
	      }
    	});
		}
	}

	window.getUserRoles = getUserRoles;

	function produceFilterByRoles(roles, rolesParams) {
		var i, key, rfilter, rprop, rolesList, uniqueIds;
    var tmp = {}, nestedConditions = [];

    if (roles && rolesParams) {
      for (key in rolesParams) {
        if (rolesParams.hasOwnProperty(key) && roles[key]) {
          rfilter = rolesParams[key] || {};
          rolesList = rfilter.roles || [];
          rprop = rfilter.property;
          if (rfilter.append) {
          	nestedConditions.push(rfilter.append);
          }
          tmp[rprop] = [];
          for (i = 0; i < rolesList.length; i++) {
            tmp[rprop].push.apply(tmp[rprop], roles[key][rolesList[i]]);
          }
        }
      }

      for (key in tmp) {
        if (tmp.hasOwnProperty(key)) {
          uniqueIds = [];
          $.each(tmp[key], function(i, el){
              if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
          });
          nestedConditions.push({
            property: key,
            operation: 9,
            value: uniqueIds,
            nestedConditions: []
          })
        }
      }

      if (!nestedConditions.length) {
      	return {
	        property: null,
	        operation: null,
	        value: false,
	        nestedConditions: []
      	};
      }

      return {
        property: null,
        operation: 1,
        value: null,
        nestedConditions: nestedConditions
      };
    } 
	}

	window.rolesFilter = rolesFilter;

	function rolesFilter(roles, filter) {
		if(!roles || !filter || !filter.length) {
			return;
		}
		var i;
		for (i = 0; i < filter.length; i++) {
			if (filter[i]._rolesFilter) {
				filter[i] = produceFilterByRoles(roles, filter[i]._rolesFilter);
			} else {
				rolesFilter(roles, filter[i].nestedConditions);
			}
		}
	}

});
