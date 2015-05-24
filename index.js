var ogreConf = require('./configuration');

var configuration_registry = {
  default: [{
    regex: /[^?]+\.(css|js|png|jpe?g|png|svg|ttf|eot|woff)($|\?.*$)/i,
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

    for (i = cache_configuration.length - 1; i >= 0; i--) {
      if (typeof(cache_configuration[i]) === 'string') {
        configurations = configurations.concat(configuration_registry[cache_configuration[i]]);
      } else if (cache_configuration[i] instanceof ogreConf.CacheConfiguration) {
        configurations = configurations.concat(cache_configuration[i].getConfiguration());
      } else {
        throw new ogreConf.CacheConfigurationTypeError(typeof(cache_configuration[i]));
      }
    }
    for (i = 0; i < configurations.length; i++) {
      var configuration = configurations[i];
      if (configuration.regex.test(url)) {
        res.setHeader("Cache-Control", "public, max-age=" + configuration.max_age);
        next();
        return;
      }
    }
    // cache miss
    next();
  };

};

/**
 * Save a CacheConfiguration in the global registry
 */
var register_named_configuration = function(name, conf) {
  configuration_registry[name] = conf.getConfiguration();
};

module.exports.cache = cache_mid_generator;
module.exports.configuration = ogreConf;
module.exports.register = register_named_configuration;