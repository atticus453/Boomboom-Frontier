System.register([], function (_export, _context) {
  "use strict";

  var Logger, instances, LogLevel, levelStringToEnum, defaultLogLevel, ConsoleMethod, defaultLogHandler;

  function setLogLevel(level) {
    instances.forEach(inst => {
      inst.setLogLevel(level);
    });
  }

  function setUserLogHandler(logCallback, options) {
    var _loop = function _loop() {
      var customLogLevel = null;

      if (options && options.level) {
        customLogLevel = levelStringToEnum[options.level];
      }

      if (logCallback === null) {
        instance.userLogHandler = null;
      } else {
        instance.userLogHandler = function (instance, level) {
          for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
            args[_key7 - 2] = arguments[_key7];
          }

          var message = args.map(arg => {
            if (arg == null) {
              return null;
            } else if (typeof arg === 'string') {
              return arg;
            } else if (typeof arg === 'number' || typeof arg === 'boolean') {
              return arg.toString();
            } else if (arg instanceof Error) {
              return arg.message;
            } else {
              try {
                return JSON.stringify(arg);
              } catch (ignored) {
                return null;
              }
            }
          }).filter(arg => arg).join(' ');

          if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance.logLevel)) {
            logCallback({
              level: LogLevel[level].toLowerCase(),
              message,
              args,
              type: instance.name
            });
          }
        };
      }
    };

    for (var instance of instances) {
      _loop();
    }
  }

  _export({
    setLogLevel: setLogLevel,
    setUserLogHandler: setUserLogHandler,
    LogLevel: void 0
  });

  return {
    setters: [],
    execute: function () {
      /**
       * @license
       * Copyright 2017 Google LLC
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
       * A container for all of the Logger instances
       */
      instances = [];
      /**
       * The JS SDK supports 5 log levels and also allows a user the ability to
       * silence the logs altogether.
       *
       * The order is a follows:
       * DEBUG < VERBOSE < INFO < WARN < ERROR
       *
       * All of the log types above the current log level will be captured (i.e. if
       * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
       * `VERBOSE` logs will not)
       */

      (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["WARN"] = 3] = "WARN";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
      })(LogLevel || _export("LogLevel", LogLevel = {}));

      levelStringToEnum = {
        'debug': LogLevel.DEBUG,
        'verbose': LogLevel.VERBOSE,
        'info': LogLevel.INFO,
        'warn': LogLevel.WARN,
        'error': LogLevel.ERROR,
        'silent': LogLevel.SILENT
      };
      /**
       * The default log level
       */

      defaultLogLevel = LogLevel.INFO;
      /**
       * By default, `console.debug` is not displayed in the developer console (in
       * chrome). To avoid forcing users to have to opt-in to these logs twice
       * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
       * logs to the `console.log` function.
       */

      ConsoleMethod = {
        [LogLevel.DEBUG]: 'log',
        [LogLevel.VERBOSE]: 'log',
        [LogLevel.INFO]: 'info',
        [LogLevel.WARN]: 'warn',
        [LogLevel.ERROR]: 'error'
      };
      /**
       * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
       * messages on to their corresponding console counterparts (if the log method
       * is supported by the current log level)
       */

      defaultLogHandler = function defaultLogHandler(instance, logType) {
        if (logType < instance.logLevel) {
          return;
        }

        var now = new Date().toISOString();
        var method = ConsoleMethod[logType];

        if (method) {
          for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }

          console[method]("[" + now + "]  " + instance.name + ":", ...args);
        } else {
          throw new Error("Attempted to log a message with an invalid logType (value: " + logType + ")");
        }
      };

      _export("Logger", Logger = class Logger {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        constructor(name) {
          this.name = name;
          /**
           * The log level of the given Logger instance.
           */

          this._logLevel = defaultLogLevel;
          /**
           * The main (internal) log handler for the Logger instance.
           * Can be set to a new function in internal package code but not by user.
           */

          this._logHandler = defaultLogHandler;
          /**
           * The optional, additional, user-defined log handler for the Logger instance.
           */

          this._userLogHandler = null;
          /**
           * Capture the current instance for later use
           */

          instances.push(this);
        }

        get logLevel() {
          return this._logLevel;
        }

        set logLevel(val) {
          if (!(val in LogLevel)) {
            throw new TypeError("Invalid value \"" + val + "\" assigned to `logLevel`");
          }

          this._logLevel = val;
        } // Workaround for setter/getter having to be the same type.


        setLogLevel(val) {
          this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
        }

        get logHandler() {
          return this._logHandler;
        }

        set logHandler(val) {
          if (typeof val !== 'function') {
            throw new TypeError('Value assigned to `logHandler` must be a function');
          }

          this._logHandler = val;
        }

        get userLogHandler() {
          return this._userLogHandler;
        }

        set userLogHandler(val) {
          this._userLogHandler = val;
        }
        /**
         * The functions below are all based on the `console` interface
         */


        debug() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);

          this._logHandler(this, LogLevel.DEBUG, ...args);
        }

        log() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);

          this._logHandler(this, LogLevel.VERBOSE, ...args);
        }

        info() {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);

          this._logHandler(this, LogLevel.INFO, ...args);
        }

        warn() {
          for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);

          this._logHandler(this, LogLevel.WARN, ...args);
        }

        error() {
          for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);

          this._logHandler(this, LogLevel.ERROR, ...args);
        }

      });
    }
  };
});
//# sourceMappingURL=f9e346cbdaa34d1ccbb9d4bdac906b465df2874c.js.map