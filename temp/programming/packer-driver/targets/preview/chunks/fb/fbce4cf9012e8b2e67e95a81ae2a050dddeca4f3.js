System.register(["__unresolved_0", "@firebase/app-compat"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _cjsExports, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_firebaseAppCompat) {
      _req = _firebaseAppCompat.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        'use strict';

        var firebase = require('@firebase/app-compat');

        function _interopDefaultLegacy(e) {
          return e && typeof e === 'object' && 'default' in e ? e : {
            'default': e
          };
        }

        var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

        var name = "firebase";
        var version = "10.12.0";
        /**
         * @license
         * Copyright 2020 Google LLC
         *
         * Licensed under the Apache License, Version 2.0 (the "License");
         * you may not use this file except in compliance with the License.
         * You may obtain a copy of the License at
         *
         *   http://www.apache.org/licenses/LICENSE-2.0
         *
         * Unless required by applicable law or agreed to in writing, software
         * distributed under the License is distributed on an "AS IS" BASIS,
         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         * See the License for the specific language governing permissions and
         * limitations under the License.
         */

        firebase__default["default"].registerVersion(name, version, 'app-compat');
        module.exports = firebase__default["default"]; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);
      }, () => ({
        '@firebase/app-compat': _req
      }));
    }
  };
});
//# sourceMappingURL=fbce4cf9012e8b2e67e95a81ae2a050dddeca4f3.js.map