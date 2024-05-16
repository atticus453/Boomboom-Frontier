System.register(["@firebase/app"], function (_export, _context) {
  "use strict";

  var registerVersion, name, version;
  return {
    setters: [function (_firebaseApp) {
      registerVersion = _firebaseApp.registerVersion;
      var _exportObj = {};

      for (var _key in _firebaseApp) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _firebaseApp[_key];
      }

      _export(_exportObj);
    }],
    execute: function () {
      name = "firebase";
      version = "10.12.0";
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

      registerVersion(name, version, 'app');
    }
  };
});
//# sourceMappingURL=71fa8cc1cf618958a5109c597642bce8a3005583.js.map