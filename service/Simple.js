/**
 * Created by kras on 11.11.16.
 */
function SimpleService() {
  this.getMeta = function () {
    return {
      types: {
        ololoType: {
          foo: 'String',
          bar: 'String'
        },
        inObject: {
          a: 'Integer',
          b: 'String',
          c: 'ololoType'
        },
        outObject: {
          x: 'String'
        }
      },
      messages: {
        methodIn: [{name: 'param', type: 'inObject'}],
        methodOut: ['outObject']
      },
      operations: {
        method: {
          input: 'methodIn',
          output: 'methodOut'
        },
        method2: {
          input: 'methodIn',
          output: 'methodOut'
        }
      }
    };
  };

  this.method = function (param) {
    return {
      x: param.a
    };
  };

  this.method2 = function (param) {
    return new Promise(function (resolve) {
      resolve({x: param.c.foo});
    });
  };
}

module.exports = SimpleService;
