System.register(["@firebase/component", "@firebase/logger", "@firebase/util", "idb"], function (_export, _context) {
  "use strict";

  var Component, ComponentContainer, Logger, setUserLogHandler, setLogLevel$1, ErrorFactory, getDefaultAppConfig, deepEqual, isBrowser, FirebaseError, base64urlEncodeWithoutPadding, isIndexedDBAvailable, validateIndexedDBOpenable, openDB, PlatformLoggerServiceImpl, FirebaseAppImpl, FirebaseServerAppImpl, HeartbeatServiceImpl, HeartbeatStorageImpl, name$p, version$1, logger, name$o, name$n, name$m, name$l, name$k, name$j, name$i, name$h, name$g, name$f, name$e, name$d, name$c, name$b, name$a, name$9, name$8, name$7, name$6, name$5, name$4, name$3, name$2, name$1, name, version, DEFAULT_ENTRY_NAME, PLATFORM_LOG_STRING, _apps, _serverApps, _components, ERRORS, ERROR_FACTORY, SDK_VERSION, DB_NAME, DB_VERSION, STORE_NAME, dbPromise, MAX_HEADER_BYTES, STORED_HEARTBEAT_RETENTION_MAX_MILLIS;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  /**
   *
   * @param provider check if this provider provides a VersionService
   *
   * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
   * provides VersionService. The provider is not necessarily a 'app-version'
   * provider.
   */
  function isVersionServiceProvider(provider) {
    var component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION"
    /* ComponentType.VERSION */
    ;
  }

  /**
   * @param component - the component being added to this app's container
   *
   * @internal
   */
  function _addComponent(app, component) {
    try {
      app.container.addComponent(component);
    } catch (e) {
      logger.debug("Component " + component.name + " failed to register with FirebaseApp " + app.name, e);
    }
  }
  /**
   *
   * @internal
   */


  function _addOrOverwriteComponent(app, component) {
    app.container.addOrOverwriteComponent(component);
  }
  /**
   *
   * @param component - the component to register
   * @returns whether or not the component is registered successfully
   *
   * @internal
   */


  function _registerComponent(component) {
    var componentName = component.name;

    if (_components.has(componentName)) {
      logger.debug("There were multiple attempts to register component " + componentName + ".");
      return false;
    }

    _components.set(componentName, component); // add the component to existing app instances


    for (var app of _apps.values()) {
      _addComponent(app, component);
    }

    for (var serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }

    return true;
  }
  /**
   *
   * @param app - FirebaseApp instance
   * @param name - service name
   *
   * @returns the provider for the service with the matching name
   *
   * @internal
   */


  function _getProvider(app, name) {
    var heartbeatController = app.container.getProvider('heartbeat').getImmediate({
      optional: true
    });

    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }

    return app.container.getProvider(name);
  }
  /**
   *
   * @param app - FirebaseApp instance
   * @param name - service name
   * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
   *
   * @internal
   */


  function _removeServiceInstance(app, name, instanceIdentifier) {
    if (instanceIdentifier === void 0) {
      instanceIdentifier = DEFAULT_ENTRY_NAME;
    }

    _getProvider(app, name).clearInstance(instanceIdentifier);
  }
  /**
   *
   * @param obj - an object of type FirebaseApp or FirebaseOptions.
   *
   * @returns true if the provide object is of type FirebaseApp.
   *
   * @internal
   */


  function _isFirebaseApp(obj) {
    return obj.options !== undefined;
  }
  /**
   *
   * @param obj - an object of type FirebaseApp.
   *
   * @returns true if the provided object is of type FirebaseServerAppImpl.
   *
   * @internal
   */


  function _isFirebaseServerApp(obj) {
    return obj.settings !== undefined;
  }
  /**
   * Test only
   *
   * @internal
   */


  function _clearComponents() {
    _components.clear();
  }
  /**
   * @license
   * Copyright 2019 Google LLC
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


  function initializeApp(_options, rawConfig) {
    if (rawConfig === void 0) {
      rawConfig = {};
    }

    var options = _options;

    if (typeof rawConfig !== 'object') {
      var _name = rawConfig;
      rawConfig = {
        name: _name
      };
    }

    var config = Object.assign({
      name: DEFAULT_ENTRY_NAME,
      automaticDataCollectionEnabled: false
    }, rawConfig);
    var name = config.name;

    if (typeof name !== 'string' || !name) {
      throw ERROR_FACTORY.create("bad-app-name"
      /* AppError.BAD_APP_NAME */
      , {
        appName: String(name)
      });
    }

    options || (options = getDefaultAppConfig());

    if (!options) {
      throw ERROR_FACTORY.create("no-options"
      /* AppError.NO_OPTIONS */
      );
    }

    var existingApp = _apps.get(name);

    if (existingApp) {
      // return the existing app if options and config deep equal the ones in the existing app.
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app"
        /* AppError.DUPLICATE_APP */
        , {
          appName: name
        });
      }
    }

    var container = new ComponentContainer(name);

    for (var component of _components.values()) {
      container.addComponent(component);
    }

    var newApp = new FirebaseAppImpl(options, config, container);

    _apps.set(name, newApp);

    return newApp;
  }

  function initializeServerApp(_options, _serverAppConfig) {
    if (isBrowser()) {
      // FirebaseServerApp isn't designed to be run in browsers.
      throw ERROR_FACTORY.create("invalid-server-app-environment"
      /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
      );
    }

    if (_serverAppConfig.automaticDataCollectionEnabled === undefined) {
      _serverAppConfig.automaticDataCollectionEnabled = false;
    }

    var appOptions;

    if (_isFirebaseApp(_options)) {
      appOptions = _options.options;
    } else {
      appOptions = _options;
    } // Build an app name based on a hash of the configuration options.


    var nameObj = Object.assign(Object.assign({}, _serverAppConfig), appOptions); // However, Do not mangle the name based on releaseOnDeref, since it will vary between the
    // construction of FirebaseServerApp instances. For example, if the object is the request headers.

    if (nameObj.releaseOnDeref !== undefined) {
      delete nameObj.releaseOnDeref;
    }

    var hashCode = s => {
      return [...s].reduce((hash, c) => Math.imul(31, hash) + c.charCodeAt(0) | 0, 0);
    };

    if (_serverAppConfig.releaseOnDeref !== undefined) {
      if (typeof FinalizationRegistry === 'undefined') {
        throw ERROR_FACTORY.create("finalization-registry-not-supported"
        /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
        , {});
      }
    }

    var nameString = '' + hashCode(JSON.stringify(nameObj));

    var existingApp = _serverApps.get(nameString);

    if (existingApp) {
      existingApp.incRefCount(_serverAppConfig.releaseOnDeref);
      return existingApp;
    }

    var container = new ComponentContainer(nameString);

    for (var component of _components.values()) {
      container.addComponent(component);
    }

    var newApp = new FirebaseServerAppImpl(appOptions, _serverAppConfig, nameString, container);

    _serverApps.set(nameString, newApp);

    return newApp;
  }
  /**
   * Retrieves a {@link @firebase/app#FirebaseApp} instance.
   *
   * When called with no arguments, the default app is returned. When an app name
   * is provided, the app corresponding to that name is returned.
   *
   * An exception is thrown if the app being retrieved has not yet been
   * initialized.
   *
   * @example
   * ```javascript
   * // Return the default app
   * const app = getApp();
   * ```
   *
   * @example
   * ```javascript
   * // Return a named app
   * const otherApp = getApp("otherApp");
   * ```
   *
   * @param name - Optional name of the app to return. If no name is
   *   provided, the default is `"[DEFAULT]"`.
   *
   * @returns The app corresponding to the provided app name.
   *   If no app name is provided, the default app is returned.
   *
   * @public
   */


  function getApp(name) {
    if (name === void 0) {
      name = DEFAULT_ENTRY_NAME;
    }

    var app = _apps.get(name);

    if (!app && name === DEFAULT_ENTRY_NAME && getDefaultAppConfig()) {
      return initializeApp();
    }

    if (!app) {
      throw ERROR_FACTORY.create("no-app"
      /* AppError.NO_APP */
      , {
        appName: name
      });
    }

    return app;
  }
  /**
   * A (read-only) array of all initialized apps.
   * @public
   */


  function getApps() {
    return Array.from(_apps.values());
  }
  /**
   * Renders this app unusable and frees the resources of all associated
   * services.
   *
   * @example
   * ```javascript
   * deleteApp(app)
   *   .then(function() {
   *     console.log("App deleted successfully");
   *   })
   *   .catch(function(error) {
   *     console.log("Error deleting app:", error);
   *   });
   * ```
   *
   * @public
   */


  function deleteApp(_x) {
    return _deleteApp.apply(this, arguments);
  }
  /**
   * Registers a library's name and version for platform logging purposes.
   * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
   * @param version - Current version of that library.
   * @param variant - Bundle variant, e.g., node, rn, etc.
   *
   * @public
   */


  function _deleteApp() {
    _deleteApp = _asyncToGenerator(function* (app) {
      var cleanupProviders = false;
      var name = app.name;

      if (_apps.has(name)) {
        cleanupProviders = true;

        _apps.delete(name);
      } else if (_serverApps.has(name)) {
        var firebaseServerApp = app;

        if (firebaseServerApp.decRefCount() <= 0) {
          _serverApps.delete(name);

          cleanupProviders = true;
        }
      }

      if (cleanupProviders) {
        yield Promise.all(app.container.getProviders().map(provider => provider.delete()));
        app.isDeleted = true;
      }
    });
    return _deleteApp.apply(this, arguments);
  }

  function registerVersion(libraryKeyOrName, version, variant) {
    var _a; // TODO: We can use this check to whitelist strings when/if we set up
    // a good whitelist system.


    var library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;

    if (variant) {
      library += "-" + variant;
    }

    var libraryMismatch = library.match(/\s|\//);
    var versionMismatch = version.match(/\s|\//);

    if (libraryMismatch || versionMismatch) {
      var warning = ["Unable to register library \"" + library + "\" with version \"" + version + "\":"];

      if (libraryMismatch) {
        warning.push("library name \"" + library + "\" contains illegal characters (whitespace or \"/\")");
      }

      if (libraryMismatch && versionMismatch) {
        warning.push('and');
      }

      if (versionMismatch) {
        warning.push("version name \"" + version + "\" contains illegal characters (whitespace or \"/\")");
      }

      logger.warn(warning.join(' '));
      return;
    }

    _registerComponent(new Component(library + "-version", () => ({
      library,
      version
    }), "VERSION"
    /* ComponentType.VERSION */
    ));
  }
  /**
   * Sets log handler for all Firebase SDKs.
   * @param logCallback - An optional custom log handler that executes user code whenever
   * the Firebase SDK makes a logging call.
   *
   * @public
   */


  function onLog(logCallback, options) {
    if (logCallback !== null && typeof logCallback !== 'function') {
      throw ERROR_FACTORY.create("invalid-log-argument"
      /* AppError.INVALID_LOG_ARGUMENT */
      );
    }

    setUserLogHandler(logCallback, options);
  }
  /**
   * Sets log level for all Firebase SDKs.
   *
   * All of the log types above the current log level are captured (i.e. if
   * you set the log level to `info`, errors are logged, but `debug` and
   * `verbose` logs are not).
   *
   * @public
   */


  function setLogLevel(logLevel) {
    setLogLevel$1(logLevel);
  }
  /**
   * @license
   * Copyright 2021 Google LLC
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


  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion) => {
          // We don't use 'break' in this switch statement, the fall-through
          // behavior is what we want, because if there are multiple versions between
          // the old version and the current version, we want ALL the migrations
          // that correspond to those versions to run, not only the last one.
          // eslint-disable-next-line default-case
          switch (oldVersion) {
            case 0:
              try {
                db.createObjectStore(STORE_NAME);
              } catch (e) {
                // Safari/iOS browsers throw occasional exceptions on
                // db.createObjectStore() that may be a bug. Avoid blocking
                // the rest of the app functionality.
                console.warn(e);
              }

          }
        }
      }).catch(e => {
        throw ERROR_FACTORY.create("idb-open"
        /* AppError.IDB_OPEN */
        , {
          originalErrorMessage: e.message
        });
      });
    }

    return dbPromise;
  }

  function readHeartbeatsFromIndexedDB(_x2) {
    return _readHeartbeatsFromIndexedDB.apply(this, arguments);
  }

  function _readHeartbeatsFromIndexedDB() {
    _readHeartbeatsFromIndexedDB = _asyncToGenerator(function* (app) {
      try {
        var db = yield getDbPromise();
        var tx = db.transaction(STORE_NAME);
        var result = yield tx.objectStore(STORE_NAME).get(computeKey(app)); // We already have the value but tx.done can throw,
        // so we need to await it here to catch errors

        yield tx.done;
        return result;
      } catch (e) {
        if (e instanceof FirebaseError) {
          logger.warn(e.message);
        } else {
          var idbGetError = ERROR_FACTORY.create("idb-get"
          /* AppError.IDB_GET */
          , {
            originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
          });
          logger.warn(idbGetError.message);
        }
      }
    });
    return _readHeartbeatsFromIndexedDB.apply(this, arguments);
  }

  function writeHeartbeatsToIndexedDB(_x3, _x4) {
    return _writeHeartbeatsToIndexedDB.apply(this, arguments);
  }

  function _writeHeartbeatsToIndexedDB() {
    _writeHeartbeatsToIndexedDB = _asyncToGenerator(function* (app, heartbeatObject) {
      try {
        var db = yield getDbPromise();
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var objectStore = tx.objectStore(STORE_NAME);
        yield objectStore.put(heartbeatObject, computeKey(app));
        yield tx.done;
      } catch (e) {
        if (e instanceof FirebaseError) {
          logger.warn(e.message);
        } else {
          var idbGetError = ERROR_FACTORY.create("idb-set"
          /* AppError.IDB_WRITE */
          , {
            originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
          });
          logger.warn(idbGetError.message);
        }
      }
    });
    return _writeHeartbeatsToIndexedDB.apply(this, arguments);
  }

  function computeKey(app) {
    return app.name + "!" + app.options.appId;
  }
  /**
   * @license
   * Copyright 2021 Google LLC
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


  function getUTCDateString() {
    var today = new Date(); // Returns date format 'YYYY-MM-DD'

    return today.toISOString().substring(0, 10);
  }

  function extractHeartbeatsForHeader(heartbeatsCache, maxSize) {
    if (maxSize === void 0) {
      maxSize = MAX_HEADER_BYTES;
    }

    // Heartbeats grouped by user agent in the standard format to be sent in
    // the header.
    var heartbeatsToSend = []; // Single date format heartbeats that are not sent.

    var unsentEntries = heartbeatsCache.slice();

    var _loop = function _loop(singleDateHeartbeat) {
      // Look for an existing entry with the same user agent.
      var heartbeatEntry = heartbeatsToSend.find(hb => hb.agent === singleDateHeartbeat.agent);

      if (!heartbeatEntry) {
        // If no entry for this user agent exists, create one.
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });

        if (countBytes(heartbeatsToSend) > maxSize) {
          // If the header would exceed max size, remove the added heartbeat
          // entry and stop adding to the header.
          heartbeatsToSend.pop();
          return 0; // break
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date); // If the header would exceed max size, remove the added date
        // and stop adding to the header.

        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          return 0; // break
        }
      } // Pop unsent entry from queue. (Skipped if adding the entry exceeded
      // quota and the loop breaks early.)


      unsentEntries = unsentEntries.slice(1);
    },
        _ret;

    for (var singleDateHeartbeat of heartbeatsCache) {
      _ret = _loop(singleDateHeartbeat);
      if (_ret === 0) break;
    }

    return {
      heartbeatsToSend,
      unsentEntries
    };
  }

  /**
   * Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
   * in a platform logging header JSON object, stringified, and converted
   * to base 64.
   */
  function countBytes(heartbeatsCache) {
    // base64 has a restricted set of characters, all of which should be 1 byte.
    return base64urlEncodeWithoutPadding( // heartbeatsCache wrapper properties
    JSON.stringify({
      version: 2,
      heartbeats: heartbeatsCache
    })).length;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
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


  function registerCoreComponents(variant) {
    _registerComponent(new Component('platform-logger', container => new PlatformLoggerServiceImpl(container), "PRIVATE"
    /* ComponentType.PRIVATE */
    ));

    _registerComponent(new Component('heartbeat', container => new HeartbeatServiceImpl(container), "PRIVATE"
    /* ComponentType.PRIVATE */
    )); // Register `app` package.


    registerVersion(name$p, version$1, variant); // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation

    registerVersion(name$p, version$1, 'esm2017'); // Register platform SDK identifier (no version).

    registerVersion('fire-js', '');
  }
  /**
   * Firebase App
   *
   * @remarks This package coordinates the communication between the different Firebase components
   * @packageDocumentation
   */


  _export({
    _addComponent: _addComponent,
    _addOrOverwriteComponent: _addOrOverwriteComponent,
    _clearComponents: _clearComponents,
    _getProvider: _getProvider,
    _isFirebaseApp: _isFirebaseApp,
    _isFirebaseServerApp: _isFirebaseServerApp,
    _registerComponent: _registerComponent,
    _removeServiceInstance: _removeServiceInstance,
    deleteApp: deleteApp,
    getApp: getApp,
    getApps: getApps,
    initializeApp: initializeApp,
    initializeServerApp: initializeServerApp,
    onLog: onLog,
    registerVersion: registerVersion,
    setLogLevel: setLogLevel
  });

  return {
    setters: [function (_firebaseComponent) {
      Component = _firebaseComponent.Component;
      ComponentContainer = _firebaseComponent.ComponentContainer;
    }, function (_firebaseLogger) {
      Logger = _firebaseLogger.Logger;
      setUserLogHandler = _firebaseLogger.setUserLogHandler;
      setLogLevel$1 = _firebaseLogger.setLogLevel;
    }, function (_firebaseUtil) {
      ErrorFactory = _firebaseUtil.ErrorFactory;
      getDefaultAppConfig = _firebaseUtil.getDefaultAppConfig;
      deepEqual = _firebaseUtil.deepEqual;
      isBrowser = _firebaseUtil.isBrowser;
      FirebaseError = _firebaseUtil.FirebaseError;
      base64urlEncodeWithoutPadding = _firebaseUtil.base64urlEncodeWithoutPadding;
      isIndexedDBAvailable = _firebaseUtil.isIndexedDBAvailable;
      validateIndexedDBOpenable = _firebaseUtil.validateIndexedDBOpenable;

      _export("FirebaseError", _firebaseUtil.FirebaseError);
    }, function (_idb) {
      openDB = _idb.openDB;
    }],
    execute: function () {
      /**
       * @license
       * Copyright 2019 Google LLC
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
      PlatformLoggerServiceImpl = class PlatformLoggerServiceImpl {
        constructor(container) {
          this.container = container;
        } // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.


        getPlatformInfoString() {
          var providers = this.container.getProviders(); // Loop through providers and get library/version pairs from any that are
          // version components.

          return providers.map(provider => {
            if (isVersionServiceProvider(provider)) {
              var service = provider.getImmediate();
              return service.library + "/" + service.version;
            } else {
              return null;
            }
          }).filter(logString => logString).join(' ');
        }

      };
      name$p = "@firebase/app";
      version$1 = "0.10.3";
      /**
       * @license
       * Copyright 2019 Google LLC
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

      logger = new Logger('@firebase/app');
      name$o = "@firebase/app-compat";
      name$n = "@firebase/analytics-compat";
      name$m = "@firebase/analytics";
      name$l = "@firebase/app-check-compat";
      name$k = "@firebase/app-check";
      name$j = "@firebase/auth";
      name$i = "@firebase/auth-compat";
      name$h = "@firebase/database";
      name$g = "@firebase/database-compat";
      name$f = "@firebase/functions";
      name$e = "@firebase/functions-compat";
      name$d = "@firebase/installations";
      name$c = "@firebase/installations-compat";
      name$b = "@firebase/messaging";
      name$a = "@firebase/messaging-compat";
      name$9 = "@firebase/performance";
      name$8 = "@firebase/performance-compat";
      name$7 = "@firebase/remote-config";
      name$6 = "@firebase/remote-config-compat";
      name$5 = "@firebase/storage";
      name$4 = "@firebase/storage-compat";
      name$3 = "@firebase/firestore";
      name$2 = "@firebase/vertexai-preview";
      name$1 = "@firebase/firestore-compat";
      name = "firebase";
      version = "10.12.0";
      /**
       * @license
       * Copyright 2019 Google LLC
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

      /**
       * The default app name
       *
       * @internal
       */

      _export("_DEFAULT_ENTRY_NAME", DEFAULT_ENTRY_NAME = '[DEFAULT]');

      PLATFORM_LOG_STRING = {
        [name$p]: 'fire-core',
        [name$o]: 'fire-core-compat',
        [name$m]: 'fire-analytics',
        [name$n]: 'fire-analytics-compat',
        [name$k]: 'fire-app-check',
        [name$l]: 'fire-app-check-compat',
        [name$j]: 'fire-auth',
        [name$i]: 'fire-auth-compat',
        [name$h]: 'fire-rtdb',
        [name$g]: 'fire-rtdb-compat',
        [name$f]: 'fire-fn',
        [name$e]: 'fire-fn-compat',
        [name$d]: 'fire-iid',
        [name$c]: 'fire-iid-compat',
        [name$b]: 'fire-fcm',
        [name$a]: 'fire-fcm-compat',
        [name$9]: 'fire-perf',
        [name$8]: 'fire-perf-compat',
        [name$7]: 'fire-rc',
        [name$6]: 'fire-rc-compat',
        [name$5]: 'fire-gcs',
        [name$4]: 'fire-gcs-compat',
        [name$3]: 'fire-fst',
        [name$1]: 'fire-fst-compat',
        [name$2]: 'fire-vertex',
        'fire-js': 'fire-js',
        [name]: 'fire-js-all'
      };
      /**
       * @license
       * Copyright 2019 Google LLC
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

      /**
       * @internal
       */

      _export("_apps", _apps = new Map());
      /**
       * @internal
       */


      _export("_serverApps", _serverApps = new Map());
      /**
       * Registered components.
       *
       * @internal
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any


      _export("_components", _components = new Map());

      ERRORS = {
        ["no-app"
        /* AppError.NO_APP */
        ]: "No Firebase App '{$appName}' has been created - " + 'call initializeApp() first',
        ["bad-app-name"
        /* AppError.BAD_APP_NAME */
        ]: "Illegal App name: '{$appName}'",
        ["duplicate-app"
        /* AppError.DUPLICATE_APP */
        ]: "Firebase App named '{$appName}' already exists with different options or config",
        ["app-deleted"
        /* AppError.APP_DELETED */
        ]: "Firebase App named '{$appName}' already deleted",
        ["server-app-deleted"
        /* AppError.SERVER_APP_DELETED */
        ]: 'Firebase Server App has been deleted',
        ["no-options"
        /* AppError.NO_OPTIONS */
        ]: 'Need to provide options, when not being deployed to hosting via source.',
        ["invalid-app-argument"
        /* AppError.INVALID_APP_ARGUMENT */
        ]: 'firebase.{$appName}() takes either no argument or a ' + 'Firebase App instance.',
        ["invalid-log-argument"
        /* AppError.INVALID_LOG_ARGUMENT */
        ]: 'First argument to `onLog` must be null or a function.',
        ["idb-open"
        /* AppError.IDB_OPEN */
        ]: 'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-get"
        /* AppError.IDB_GET */
        ]: 'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-set"
        /* AppError.IDB_WRITE */
        ]: 'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-delete"
        /* AppError.IDB_DELETE */
        ]: 'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
        ["finalization-registry-not-supported"
        /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
        ]: 'FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.',
        ["invalid-server-app-environment"
        /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
        ]: 'FirebaseServerApp is not for use in browser environments.'
      };
      ERROR_FACTORY = new ErrorFactory('app', 'Firebase', ERRORS);
      /**
       * @license
       * Copyright 2019 Google LLC
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

      FirebaseAppImpl = class FirebaseAppImpl {
        constructor(options, config, container) {
          this._isDeleted = false;
          this._options = Object.assign({}, options);
          this._config = Object.assign({}, config);
          this._name = config.name;
          this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
          this._container = container;
          this.container.addComponent(new Component('app', () => this, "PUBLIC"
          /* ComponentType.PUBLIC */
          ));
        }

        get automaticDataCollectionEnabled() {
          this.checkDestroyed();
          return this._automaticDataCollectionEnabled;
        }

        set automaticDataCollectionEnabled(val) {
          this.checkDestroyed();
          this._automaticDataCollectionEnabled = val;
        }

        get name() {
          this.checkDestroyed();
          return this._name;
        }

        get options() {
          this.checkDestroyed();
          return this._options;
        }

        get config() {
          this.checkDestroyed();
          return this._config;
        }

        get container() {
          return this._container;
        }

        get isDeleted() {
          return this._isDeleted;
        }

        set isDeleted(val) {
          this._isDeleted = val;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */


        checkDestroyed() {
          if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted"
            /* AppError.APP_DELETED */
            , {
              appName: this._name
            });
          }
        }

      };
      /**
       * @license
       * Copyright 2023 Google LLC
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

      FirebaseServerAppImpl = class FirebaseServerAppImpl extends FirebaseAppImpl {
        constructor(options, serverConfig, name, container) {
          // Build configuration parameters for the FirebaseAppImpl base class.
          var automaticDataCollectionEnabled = serverConfig.automaticDataCollectionEnabled !== undefined ? serverConfig.automaticDataCollectionEnabled : false; // Create the FirebaseAppSettings object for the FirebaseAppImp constructor.

          var config = {
            name,
            automaticDataCollectionEnabled
          };

          if (options.apiKey !== undefined) {
            // Construct the parent FirebaseAppImp object.
            super(options, config, container);
          } else {
            var appImpl = options;
            super(appImpl.options, config, container);
          } // Now construct the data for the FirebaseServerAppImpl.


          this._serverConfig = Object.assign({
            automaticDataCollectionEnabled
          }, serverConfig);
          this._finalizationRegistry = new FinalizationRegistry(() => {
            this.automaticCleanup();
          });
          this._refCount = 0;
          this.incRefCount(this._serverConfig.releaseOnDeref); // Do not retain a hard reference to the dref object, otherwise the FinalizationRegisry
          // will never trigger.

          this._serverConfig.releaseOnDeref = undefined;
          serverConfig.releaseOnDeref = undefined;
          registerVersion(name$p, version$1, 'serverapp');
        }

        toJSON() {
          return undefined;
        }

        get refCount() {
          return this._refCount;
        } // Increment the reference count of this server app. If an object is provided, register it
        // with the finalization registry.


        incRefCount(obj) {
          if (this.isDeleted) {
            return;
          }

          this._refCount++;

          if (obj !== undefined) {
            this._finalizationRegistry.register(obj, this);
          }
        } // Decrement the reference count.


        decRefCount() {
          if (this.isDeleted) {
            return 0;
          }

          return --this._refCount;
        } // Invoked by the FinalizationRegistry callback to note that this app should go through its
        // reference counts and delete itself if no reference count remain. The coordinating logic that
        // handles this is in deleteApp(...).


        automaticCleanup() {
          void deleteApp(this);
        }

        get settings() {
          this.checkDestroyed();
          return this._serverConfig;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */


        checkDestroyed() {
          if (this.isDeleted) {
            throw ERROR_FACTORY.create("server-app-deleted"
            /* AppError.SERVER_APP_DELETED */
            );
          }
        }

      };
      /**
       * @license
       * Copyright 2019 Google LLC
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

      /**
       * The current SDK version.
       *
       * @public
       */

      _export("SDK_VERSION", SDK_VERSION = version);

      DB_NAME = 'firebase-heartbeat-database';
      DB_VERSION = 1;
      STORE_NAME = 'firebase-heartbeat-store';
      dbPromise = null;
      MAX_HEADER_BYTES = 1024; // 30 days

      STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;
      HeartbeatServiceImpl = class HeartbeatServiceImpl {
        constructor(container) {
          this.container = container;
          /**
           * In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
           * the header string.
           * Stores one record per date. This will be consolidated into the standard
           * format of one record per user agent string before being sent as a header.
           * Populated from indexedDB when the controller is instantiated and should
           * be kept in sync with indexedDB.
           * Leave public for easier testing.
           */

          this._heartbeatsCache = null;
          var app = this.container.getProvider('app').getImmediate();
          this._storage = new HeartbeatStorageImpl(app);
          this._heartbeatsCachePromise = this._storage.read().then(result => {
            this._heartbeatsCache = result;
            return result;
          });
        }
        /**
         * Called to report a heartbeat. The function will generate
         * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
         * to IndexedDB.
         * Note that we only store one heartbeat per day. So if a heartbeat for today is
         * already logged, subsequent calls to this function in the same day will be ignored.
         */


        triggerHeartbeat() {
          var _this = this;

          return _asyncToGenerator(function* () {
            var _a, _b;

            var platformLogger = _this.container.getProvider('platform-logger').getImmediate(); // This is the "Firebase user agent" string from the platform logger
            // service, not the browser user agent.


            var agent = platformLogger.getPlatformInfoString();
            var date = getUTCDateString();

            if (((_a = _this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
              _this._heartbeatsCache = yield _this._heartbeatsCachePromise; // If we failed to construct a heartbeats cache, then return immediately.

              if (((_b = _this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
                return;
              }
            } // Do not store a heartbeat if one is already stored for this day
            // or if a header has already been sent today.


            if (_this._heartbeatsCache.lastSentHeartbeatDate === date || _this._heartbeatsCache.heartbeats.some(singleDateHeartbeat => singleDateHeartbeat.date === date)) {
              return;
            } else {
              // There is no entry for this date. Create one.
              _this._heartbeatsCache.heartbeats.push({
                date,
                agent
              });
            } // Remove entries older than 30 days.


            _this._heartbeatsCache.heartbeats = _this._heartbeatsCache.heartbeats.filter(singleDateHeartbeat => {
              var hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
              var now = Date.now();
              return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
            });
            return _this._storage.overwrite(_this._heartbeatsCache);
          })();
        }
        /**
         * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
         * It also clears all heartbeats from memory as well as in IndexedDB.
         *
         * NOTE: Consuming product SDKs should not send the header if this method
         * returns an empty string.
         */


        getHeartbeatsHeader() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            var _a;

            if (_this2._heartbeatsCache === null) {
              yield _this2._heartbeatsCachePromise;
            } // If it's still null or the array is empty, there is no data to send.


            if (((_a = _this2._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null || _this2._heartbeatsCache.heartbeats.length === 0) {
              return '';
            }

            var date = getUTCDateString(); // Extract as many heartbeats from the cache as will fit under the size limit.

            var {
              heartbeatsToSend,
              unsentEntries
            } = extractHeartbeatsForHeader(_this2._heartbeatsCache.heartbeats);
            var headerString = base64urlEncodeWithoutPadding(JSON.stringify({
              version: 2,
              heartbeats: heartbeatsToSend
            })); // Store last sent date to prevent another being logged/sent for the same day.

            _this2._heartbeatsCache.lastSentHeartbeatDate = date;

            if (unsentEntries.length > 0) {
              // Store any unsent entries if they exist.
              _this2._heartbeatsCache.heartbeats = unsentEntries; // This seems more likely than emptying the array (below) to lead to some odd state
              // since the cache isn't empty and this will be called again on the next request,
              // and is probably safest if we await it.

              yield _this2._storage.overwrite(_this2._heartbeatsCache);
            } else {
              _this2._heartbeatsCache.heartbeats = []; // Do not wait for this, to reduce latency.

              void _this2._storage.overwrite(_this2._heartbeatsCache);
            }

            return headerString;
          })();
        }

      };
      HeartbeatStorageImpl = class HeartbeatStorageImpl {
        constructor(app) {
          this.app = app;
          this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }

        runIndexedDBEnvironmentCheck() {
          return _asyncToGenerator(function* () {
            if (!isIndexedDBAvailable()) {
              return false;
            } else {
              return validateIndexedDBOpenable().then(() => true).catch(() => false);
            }
          })();
        }
        /**
         * Read all heartbeats.
         */


        read() {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            var canUseIndexedDB = yield _this3._canUseIndexedDBPromise;

            if (!canUseIndexedDB) {
              return {
                heartbeats: []
              };
            } else {
              var idbHeartbeatObject = yield readHeartbeatsFromIndexedDB(_this3.app);

              if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
                return idbHeartbeatObject;
              } else {
                return {
                  heartbeats: []
                };
              }
            }
          })();
        } // overwrite the storage with the provided heartbeats


        overwrite(heartbeatsObject) {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            var _a;

            var canUseIndexedDB = yield _this4._canUseIndexedDBPromise;

            if (!canUseIndexedDB) {
              return;
            } else {
              var existingHeartbeatsObject = yield _this4.read();
              return writeHeartbeatsToIndexedDB(_this4.app, {
                lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: heartbeatsObject.heartbeats
              });
            }
          })();
        } // add heartbeats


        add(heartbeatsObject) {
          var _this5 = this;

          return _asyncToGenerator(function* () {
            var _a;

            var canUseIndexedDB = yield _this5._canUseIndexedDBPromise;

            if (!canUseIndexedDB) {
              return;
            } else {
              var existingHeartbeatsObject = yield _this5.read();
              return writeHeartbeatsToIndexedDB(_this5.app, {
                lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: [...existingHeartbeatsObject.heartbeats, ...heartbeatsObject.heartbeats]
              });
            }
          })();
        }

      };
      registerCoreComponents('');
    }
  };
});
//# sourceMappingURL=ab7d1521a1ffbbf304a2c63276fe6063e4e1ad88.js.map