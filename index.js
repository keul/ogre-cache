var configuration_registry = {
  default: [{
    regex: /.+\.css($|\?.*$)/i,
    max_age: 604800
  }, {
    regex: /.+\.js($|\?.*$)/i,
    max_age: 604800
  }, {
    regex: /.+\.(png|jpe?g|png|svg)($|\?.*$)/i,
    max_age: 604800
  }, {
    regex: /.+\.(ttf|eot|woff)($|\?.*$)/i,
    max_age: 604800
  }]
};

/**
 * returns a middleware function able to manage cache headers.
 * Accept a sequence of named configuration or CacheConfiguration objects.
 * If no configuration is given, the "default" configuration will be used
 */
var cache_mid_generator = function() {
  var cache_configuration = arguments;
  if (cache_configuration.length === 0) {
    cache_configuration = ['default'];
  }

  return function(req, res, next) {
    var url = req.originalUrl,
      i,
      configurations = [];

    for (i = cache_configuration.length-1; i >= 0; i--) {
      if (typeof(cache_configuration[i]) === 'string') {
        configurations.push(configuration_registry[cache_configuration[i]]);
      } else {
        // nop
      }
    }
    for (i = 0; i < configurations.length; i++) {
      var configuration = configurations[i],
        j;
      for (j = 0; j < configuration.length; j++) {
        if (configuration[j].regex.test(url)) {
          res.setHeader("Cache-Control", "public, max-age=" + configuration[j].max_age);
          next();
          return;
        }
      }
    }
    // cache miss
    next();
  };

};

module.exports.cache = cache_mid_generator;
