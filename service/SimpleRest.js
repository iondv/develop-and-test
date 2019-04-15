function SimpleRest() {
  this.handle = function (req) {
    return Promise.resolve({
      yohoho: "And a bottle of rum!"
    });
  };
}

module.exports = SimpleRest;
