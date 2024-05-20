System.register(["__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _cjsExports, ___esModule, _unwrap, _wrap, _deleteDB, _openDB, __cjsMetaURL;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var wrapIdbValue = require('./wrap-idb-value.cjs');
        /**
         * Open a database.
         *
         * @param name Name of the database.
         * @param version Schema version.
         * @param callbacks Additional callbacks.
         */


        function openDB(name, version, _temp) {
          var {
            blocked,
            upgrade,
            blocking,
            terminated
          } = _temp === void 0 ? {} : _temp;
          var request = indexedDB.open(name, version);
          var openPromise = wrapIdbValue.wrap(request);

          if (upgrade) {
            request.addEventListener('upgradeneeded', event => {
              upgrade(wrapIdbValue.wrap(request.result), event.oldVersion, event.newVersion, wrapIdbValue.wrap(request.transaction), event);
            });
          }

          if (blocked) {
            request.addEventListener('blocked', event => blocked( // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event.newVersion, event));
          }

          openPromise.then(db => {
            if (terminated) db.addEventListener('close', () => terminated());

            if (blocking) {
              db.addEventListener('versionchange', event => blocking(event.oldVersion, event.newVersion, event));
            }
          }).catch(() => {});
          return openPromise;
        }
        /**
         * Delete a database.
         *
         * @param name Name of the database.
         */


        function deleteDB(name, _temp2) {
          var {
            blocked
          } = _temp2 === void 0 ? {} : _temp2;
          var request = indexedDB.deleteDatabase(name);

          if (blocked) {
            request.addEventListener('blocked', event => blocked( // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event));
          }

          return wrapIdbValue.wrap(request).then(() => undefined);
        }

        var readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
        var writeMethods = ['put', 'add', 'delete', 'clear'];
        var cachedMethods = new Map();

        function getMethod(target, prop) {
          if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
            return;
          }

          if (cachedMethods.get(prop)) return cachedMethods.get(prop);
          var targetFuncName = prop.replace(/FromIndex$/, '');
          var useIndex = prop !== targetFuncName;
          var isWrite = writeMethods.includes(targetFuncName);

          if ( // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
          !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
            return;
          }

          var method = /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(function* (storeName) {
              // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
              var tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
              var target = tx.store;

              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }

              if (useIndex) target = target.index(args.shift()); // Must reject if op rejects.
              // If it's a write operation, must reject if tx.done rejects.
              // Must reject with op rejection first.
              // Must resolve with op value.
              // Must handle both promises (no unhandled rejections)

              return (yield Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
            });

            return function method(_x) {
              return _ref.apply(this, arguments);
            };
          }();

          cachedMethods.set(prop, method);
          return method;
        }

        wrapIdbValue.replaceTraps(oldTraps => _extends({}, oldTraps, {
          get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
          has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
        }));
        exports.unwrap = wrapIdbValue.unwrap;
        exports.wrap = wrapIdbValue.wrap;
        exports.deleteDB = deleteDB;
        exports.openDB = openDB; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _unwrap = module.exports.unwrap;
        _wrap = module.exports.wrap;
        _deleteDB = module.exports.deleteDB;
        _openDB = module.exports.openDB;
      }, () => ({
        './wrap-idb-value.cjs': _req
      }));
    }
  };
});
//# sourceMappingURL=440a2a2646f830c14deb2c1cb36fd6c1c16c8e88.js.map