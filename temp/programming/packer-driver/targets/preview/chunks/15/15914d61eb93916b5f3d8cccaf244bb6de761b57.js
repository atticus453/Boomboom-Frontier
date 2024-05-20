System.register(["@firebase/util"], function (_export, _context) {
  "use strict";

  var Deferred, Component, Provider, ComponentContainer, DEFAULT_ENTRY_NAME;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  // undefined should be passed to the service factory for the default instance
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
  }

  function isComponentEager(component) {
    return component.instantiationMode === "EAGER"
    /* InstantiationMode.EAGER */
    ;
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

  /**
   * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
   */


  return {
    setters: [function (_firebaseUtil) {
      Deferred = _firebaseUtil.Deferred;
    }],
    execute: function () {
      /**
       * Component for service name T, e.g. `auth`, `auth-internal`
       */
      _export("Component", Component = class Component {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        constructor(name, instanceFactory, type) {
          this.name = name;
          this.instanceFactory = instanceFactory;
          this.type = type;
          this.multipleInstances = false;
          /**
           * Properties to be added to the service namespace
           */

          this.serviceProps = {};
          this.instantiationMode = "LAZY"
          /* InstantiationMode.LAZY */
          ;
          this.onInstanceCreated = null;
        }

        setInstantiationMode(mode) {
          this.instantiationMode = mode;
          return this;
        }

        setMultipleInstances(multipleInstances) {
          this.multipleInstances = multipleInstances;
          return this;
        }

        setServiceProps(props) {
          this.serviceProps = props;
          return this;
        }

        setInstanceCreatedCallback(callback) {
          this.onInstanceCreated = callback;
          return this;
        }

      });
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


      DEFAULT_ENTRY_NAME = '[DEFAULT]';
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
       * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
       * NameServiceMapping[T] is an alias for the type of the instance
       */

      _export("Provider", Provider = class Provider {
        constructor(name, container) {
          this.name = name;
          this.container = container;
          this.component = null;
          this.instances = new Map();
          this.instancesDeferred = new Map();
          this.instancesOptions = new Map();
          this.onInitCallbacks = new Map();
        }
        /**
         * @param identifier A provider can provide mulitple instances of a service
         * if this.component.multipleInstances is true.
         */


        get(identifier) {
          // if multipleInstances is not supported, use the default name
          var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);

          if (!this.instancesDeferred.has(normalizedIdentifier)) {
            var deferred = new Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);

            if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
              // initialize the service if it can be auto-initialized
              try {
                var instance = this.getOrInitializeService({
                  instanceIdentifier: normalizedIdentifier
                });

                if (instance) {
                  deferred.resolve(instance);
                }
              } catch (e) {// when the instance factory throws an exception during get(), it should not cause
                // a fatal error. We just return the unresolved promise in this case.
              }
            }
          }

          return this.instancesDeferred.get(normalizedIdentifier).promise;
        }

        getImmediate(options) {
          var _a; // if multipleInstances is not supported, use the default name


          var normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
          var optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;

          if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
              return this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
            } catch (e) {
              if (optional) {
                return null;
              } else {
                throw e;
              }
            }
          } else {
            // In case a component is not initialized and should/can not be auto-initialized at the moment, return null if the optional flag is set, or throw
            if (optional) {
              return null;
            } else {
              throw Error("Service " + this.name + " is not available");
            }
          }
        }

        getComponent() {
          return this.component;
        }

        setComponent(component) {
          if (component.name !== this.name) {
            throw Error("Mismatching Component " + component.name + " for Provider " + this.name + ".");
          }

          if (this.component) {
            throw Error("Component for " + this.name + " has already been provided");
          }

          this.component = component; // return early without attempting to initialize the component if the component requires explicit initialization (calling `Provider.initialize()`)

          if (!this.shouldAutoInitialize()) {
            return;
          } // if the service is eager, initialize the default instance


          if (isComponentEager(component)) {
            try {
              this.getOrInitializeService({
                instanceIdentifier: DEFAULT_ENTRY_NAME
              });
            } catch (e) {// when the instance factory for an eager Component throws an exception during the eager
              // initialization, it should not cause a fatal error.
              // TODO: Investigate if we need to make it configurable, because some component may want to cause
              // a fatal error in this case?
            }
          } // Create service instances for the pending promises and resolve them
          // NOTE: if this.multipleInstances is false, only the default instance will be created
          // and all promises with resolve with it regardless of the identifier.


          for (var [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            var normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);

            try {
              // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
              var instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
              instanceDeferred.resolve(instance);
            } catch (e) {// when the instance factory throws an exception, it should not cause
              // a fatal error. We just leave the promise unresolved.
            }
          }
        }

        clearInstance(identifier) {
          if (identifier === void 0) {
            identifier = DEFAULT_ENTRY_NAME;
          }

          this.instancesDeferred.delete(identifier);
          this.instancesOptions.delete(identifier);
          this.instances.delete(identifier);
        } // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?


        delete() {
          var _this = this;

          return _asyncToGenerator(function* () {
            var services = Array.from(_this.instances.values());
            yield Promise.all([...services.filter(service => 'INTERNAL' in service) // legacy services
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(service => service.INTERNAL.delete()), ...services.filter(service => '_delete' in service) // modularized services
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(service => service._delete())]);
          })();
        }

        isComponentSet() {
          return this.component != null;
        }

        isInitialized(identifier) {
          if (identifier === void 0) {
            identifier = DEFAULT_ENTRY_NAME;
          }

          return this.instances.has(identifier);
        }

        getOptions(identifier) {
          if (identifier === void 0) {
            identifier = DEFAULT_ENTRY_NAME;
          }

          return this.instancesOptions.get(identifier) || {};
        }

        initialize(opts) {
          if (opts === void 0) {
            opts = {};
          }

          var {
            options = {}
          } = opts;
          var normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);

          if (this.isInitialized(normalizedIdentifier)) {
            throw Error(this.name + "(" + normalizedIdentifier + ") has already been initialized");
          }

          if (!this.isComponentSet()) {
            throw Error("Component " + this.name + " has not been registered yet");
          }

          var instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
          }); // resolve any pending promise waiting for the service instance

          for (var [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            var normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);

            if (normalizedIdentifier === normalizedDeferredIdentifier) {
              instanceDeferred.resolve(instance);
            }
          }

          return instance;
        }
        /**
         *
         * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
         * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
         *
         * @param identifier An optional instance identifier
         * @returns a function to unregister the callback
         */


        onInit(callback, identifier) {
          var _a;

          var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          var existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
          existingCallbacks.add(callback);
          this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
          var existingInstance = this.instances.get(normalizedIdentifier);

          if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
          }

          return () => {
            existingCallbacks.delete(callback);
          };
        }
        /**
         * Invoke onInit callbacks synchronously
         * @param instance the service instance`
         */


        invokeOnInitCallbacks(instance, identifier) {
          var callbacks = this.onInitCallbacks.get(identifier);

          if (!callbacks) {
            return;
          }

          for (var callback of callbacks) {
            try {
              callback(instance, identifier);
            } catch (_a) {// ignore errors in the onInit callback
            }
          }
        }

        getOrInitializeService(_ref) {
          var {
            instanceIdentifier,
            options = {}
          } = _ref;
          var instance = this.instances.get(instanceIdentifier);

          if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
              instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
              options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            /**
             * Invoke onInit listeners.
             * Note this.component.onInstanceCreated is different, which is used by the component creator,
             * while onInit listeners are registered by consumers of the provider.
             */

            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            /**
             * Order is important
             * onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
             * makes `isInitialized()` return true.
             */

            if (this.component.onInstanceCreated) {
              try {
                this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
              } catch (_a) {// ignore errors in the onInstanceCreatedCallback
              }
            }
          }

          return instance || null;
        }

        normalizeInstanceIdentifier(identifier) {
          if (identifier === void 0) {
            identifier = DEFAULT_ENTRY_NAME;
          }

          if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
          } else {
            return identifier; // assume multiple instances are supported before the component is provided.
          }
        }

        shouldAutoInitialize() {
          return !!this.component && this.component.instantiationMode !== "EXPLICIT"
          /* InstantiationMode.EXPLICIT */
          ;
        }

      });

      _export("ComponentContainer", ComponentContainer = class ComponentContainer {
        constructor(name) {
          this.name = name;
          this.providers = new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */


        addComponent(component) {
          var provider = this.getProvider(component.name);

          if (provider.isComponentSet()) {
            throw new Error("Component " + component.name + " has already been registered with " + this.name);
          }

          provider.setComponent(component);
        }

        addOrOverwriteComponent(component) {
          var provider = this.getProvider(component.name);

          if (provider.isComponentSet()) {
            // delete the existing provider from the container, so we can register the new component
            this.providers.delete(component.name);
          }

          this.addComponent(component);
        }
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */


        getProvider(name) {
          if (this.providers.has(name)) {
            return this.providers.get(name);
          } // create a Provider for a service that hasn't registered with Firebase


          var provider = new Provider(name, this);
          this.providers.set(name, provider);
          return provider;
        }

        getProviders() {
          return Array.from(this.providers.values());
        }

      });
    }
  };
});
//# sourceMappingURL=15914d61eb93916b5f3d8cccaf244bb6de761b57.js.map