System.register(["__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _cjsExports, ___esModule, _unwrap, _wrap, _deleteDB, _openDB, __cjsMetaURL;

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


        function openDB(name, version, {
          blocked,
          upgrade,
          blocking,
          terminated
        } = {}) {
          const request = indexedDB.open(name, version);
          const openPromise = wrapIdbValue.wrap(request);

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


        function deleteDB(name, {
          blocked
        } = {}) {
          const request = indexedDB.deleteDatabase(name);

          if (blocked) {
            request.addEventListener('blocked', event => blocked( // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event));
          }

          return wrapIdbValue.wrap(request).then(() => undefined);
        }

        const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
        const writeMethods = ['put', 'add', 'delete', 'clear'];
        const cachedMethods = new Map();

        function getMethod(target, prop) {
          if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
            return;
          }

          if (cachedMethods.get(prop)) return cachedMethods.get(prop);
          const targetFuncName = prop.replace(/FromIndex$/, '');
          const useIndex = prop !== targetFuncName;
          const isWrite = writeMethods.includes(targetFuncName);

          if ( // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
          !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
            return;
          }

          const method = async function (storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            let target = tx.store;
            if (useIndex) target = target.index(args.shift()); // Must reject if op rejects.
            // If it's a write operation, must reject if tx.done rejects.
            // Must reject with op rejection first.
            // Must resolve with op value.
            // Must handle both promises (no unhandled rejections)

            return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
          };

          cachedMethods.set(prop, method);
          return method;
        }

        wrapIdbValue.replaceTraps(oldTraps => ({ ...oldTraps,
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