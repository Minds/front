export const featuresServiceMock = new (function() {
  const _values = {};

  this.mock = function(key, value) {
    _values[key] = value;
  };

  this.has = jasmine.createSpy('has').and.callFake(function(feature) {
    let negate = false;

    if (feature.indexOf('!') === 0) {
      feature = feature.substr(1);
      negate = true;
    }

    if (typeof _values[feature] === 'undefined') {
      throw new Error(`Unknown feature: ${feature}`);
    }

    return negate ? !_values[feature] : _values[feature];
  });

  this.check = jasmine.createSpy('check').and.callFake(function(feature) {
    let negate = false;

    if (feature.indexOf('!') === 0) {
      feature = feature.substr(1);
      negate = true;
    }

    if (typeof _values[feature] === 'undefined') {
      throw new Error(`Unknown feature: ${feature}`);
    }

    return negate ? !_values[feature] : _values[feature];
  });
})();
