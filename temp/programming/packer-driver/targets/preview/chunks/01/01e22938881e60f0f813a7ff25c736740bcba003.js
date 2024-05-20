System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var req, loader, d;
  return {
    setters: [function (_unresolved_) {
      req = _unresolved_.__cjsMetaURL;
    }, function (_unresolved_2) {
      loader = _unresolved_2.default;
    }, function (_unresolved_3) {
      var _exportObj = {};

      for (var _key in _unresolved_3) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _unresolved_3[_key];
      }

      _export(_exportObj);
    }, function (_unresolved_4) {
      d = _unresolved_4.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './index.esm2017.js'~
      if (!req) {
        loader.throwInvalidWrapper('./index.esm2017.js', _context.meta.url);
      }

      loader.require(req);

      _export("default", d);
    }
  };
});
//# sourceMappingURL=01e22938881e60f0f813a7ff25c736740bcba003.js.map