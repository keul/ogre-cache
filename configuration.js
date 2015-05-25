var util = require('util');

/* Errors */
var CacheConfigurationTypeError = function(wrong_type) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = "Not a valid CacheConfiguration object: " + wrong_type;
};

var CacheConfigurationError = function(conf) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = "Bad configuration: " + conf;
};

util.inherits(CacheConfigurationTypeError, Error);
util.inherits(CacheConfigurationError, Error);


/* Configuration */
var CacheConfiguration = function() {
  this.local_configuration_registry = [];
};

CacheConfiguration.prototype.getConfiguration = function() {
  return this.local_configuration_registry;
};
CacheConfiguration.prototype.add = function(conf, max_age) {
  if (typeof(conf) === 'string' && conf.substr(0, 2) === "*.") {
    regex = new RegExp('/[^?]+\.(' + conf.substr(1, conf.length - 1) + ')($|\?.*$)', 'i');
  } else if (typeof(conf) === 'string') {
    regex = new RegExp(conf, 'i');
  } else {
    regex = conf;
  }

  this.local_configuration_registry.push({
    regex: regex,
    max_age: max_age
  });

  return this;
};


module.exports.CacheConfiguration = CacheConfiguration;
module.exports.CacheConfigurationTypeError = CacheConfigurationTypeError;
module.exports.CacheConfigurationError = CacheConfigurationError;