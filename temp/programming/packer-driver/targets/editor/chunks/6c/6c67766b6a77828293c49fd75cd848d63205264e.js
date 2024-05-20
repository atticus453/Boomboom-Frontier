System.register(["__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var wrap, replaceTraps, readMethods, writeMethods, cachedMethods;

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
    const openPromise = wrap(request);

    if (upgrade) {
      request.addEventListener('upgradeneeded', event => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
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

    return wrap(request).then(() => undefined);
  }

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

  _export({
    deleteDB: deleteDB,
    openDB: openDB
  });

  return {
    setters: [function (_unresolved_) {
      wrap = _unresolved_.w;
      replaceTraps = _unresolved_.r;
    }, function (_unresolved_2) {
      _export({
        unwrap: _unresolved_2.u,
        wrap: _unresolved_2.w
      });
    }],
    execute: function () {
      readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
      writeMethods = ['put', 'add', 'delete', 'clear'];
      cachedMethods = new Map();
      replaceTraps(oldTraps => ({ ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
      }));
    }
  };
});
//# sourceMappingURL=6c67766b6a77828293c49fd75cd848d63205264e.js.map