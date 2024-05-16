System.register([], function (_export, _context) {
  "use strict";

  var instanceOfAny, idbProxyableTypes, cursorAdvanceMethods, cursorRequestMap, transactionDoneMap, transactionStoreNamesMap, transformCache, reverseTransformCache, idbProxyTraps, unwrap;

  // This is a function to prevent it throwing up in node environments.
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
  } // This is a function to prevent it throwing up in node environments.


  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
  }

  function promisifyRequest(request) {
    var promise = new Promise((resolve, reject) => {
      var unlisten = () => {
        request.removeEventListener('success', success);
        request.removeEventListener('error', error);
      };

      var success = () => {
        resolve(wrap(request.result));
        unlisten();
      };

      var error = () => {
        reject(request.error);
        unlisten();
      };

      request.addEventListener('success', success);
      request.addEventListener('error', error);
    });
    promise.then(value => {
      // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
      // (see wrapFunction).
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      } // Catching to avoid "Uncaught Promise exceptions"

    }).catch(() => {}); // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.

    reverseTransformCache.set(promise, request);
    return promise;
  }

  function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx)) return;
    var done = new Promise((resolve, reject) => {
      var unlisten = () => {
        tx.removeEventListener('complete', complete);
        tx.removeEventListener('error', error);
        tx.removeEventListener('abort', error);
      };

      var complete = () => {
        resolve();
        unlisten();
      };

      var error = () => {
        reject(tx.error || new DOMException('AbortError', 'AbortError'));
        unlisten();
      };

      tx.addEventListener('complete', complete);
      tx.addEventListener('error', error);
      tx.addEventListener('abort', error);
    }); // Cache it for later retrieval.

    transactionDoneMap.set(tx, done);
  }

  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }

  function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction && !('objectStoreNames' in IDBTransaction.prototype)) {
      return function (storeNames) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    } // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.


    if (getCursorAdvanceMethods().includes(func)) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }

    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
      // the original object.
      return wrap(func.apply(unwrap(this), args));
    };
  }

  function transformCachableValue(value) {
    if (typeof value === 'function') return wrapFunction(value); // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).

    if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps); // Return the same value back if we're not going to transform it.

    return value;
  }

  function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest) return promisifyRequest(value); // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.

    if (transformCache.has(value)) return transformCache.get(value);
    var newValue = transformCachableValue(value); // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.

    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }

    return newValue;
  }

  _export({
    r: replaceTraps,
    w: wrap
  });

  return {
    setters: [],
    execute: function () {
      _export("i", instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c));

      cursorRequestMap = new WeakMap();
      transactionDoneMap = new WeakMap();
      transactionStoreNamesMap = new WeakMap();
      transformCache = new WeakMap();

      _export("a", reverseTransformCache = new WeakMap());

      idbProxyTraps = {
        get(target, prop, receiver) {
          if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done') return transactionDoneMap.get(target); // Polyfill for objectStoreNames because of Edge.

            if (prop === 'objectStoreNames') {
              return target.objectStoreNames || transactionStoreNamesMap.get(target);
            } // Make tx.store return the only store in the transaction, or undefined if there are many.


            if (prop === 'store') {
              return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
            }
          } // Else transform whatever we get back.


          return wrap(target[prop]);
        },

        set(target, prop, value) {
          target[prop] = value;
          return true;
        },

        has(target, prop) {
          if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store')) {
            return true;
          }

          return prop in target;
        }

      };

      _export("u", unwrap = value => reverseTransformCache.get(value));
    }
  };
});
//# sourceMappingURL=5fc59129dce47b71d3bbe5b8165fbc21fcb18145.js.map