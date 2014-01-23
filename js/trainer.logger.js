/**
 * Logger class is a simple extension to make logging and debugging
 * in Chrome easier and more eye-catching.
 * @constructor
 */
function Logger() {
    var _debug = 0;
    var _info = 1;
    var _error = 2;
    var _catching = 4;

    /**
     * Gets logger's caller from error stack
     * @returns {String} caller file and call pos
     */
    var getCaller = function () {
        var stack = (new Error).stack.match(/^(?!.*Logger).*$/gm);
        return stack[1].replace(/^\s+|\s+$/g, '');
    };

    /**
     * This method perform logging objects depending on message type.
     * All log messages are grouped into console.group
     * @param args {*} Objects to log
     * @param type {number} a type of log message
     */
    var consoleLog = function (args, type) {
        var logger;
        if (type == _debug) {
            logger = function (o) {
                console.log('%c ' + o, 'color: #4387fd')
            };
            grouper = function (s) {
                console.group('%c [DEBUG] [' + s + ']', 'color: #4387fd');
            }
        } else if (type == _info) {
            logger = function (o) {
                console.log('%c ' + o, 'color: #D4BB02')
            };
            grouper = function (s) {
                console.group('%c [INFO] [' + s + ']', 'color: #D4BB02');
            }
        } else if (type == _error) {
            logger = function (o) {
                console.error(o)
            };
            grouper = function (s) {
                console.group('%c [ERROR] [' + s + ']', 'color: #FF0000');
            }
        } else if (type == _catching) {
            logger = function (o) {
                console.log('%c ' + o, 'color: #FC1CEA')
            };
            grouper = function (s) {
                console.group('%c [CATCHING] [' + s + ']', 'color: #FC1CEA');
            }
        } else {
            logger = function (o) {
                console.log(o)
            };
        }

        grouper(getCaller());
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === "object") {
                console.log(args[i]);
            } else {
                logger(args[i]);
            }
        }
        console.groupEnd();
    };

    /**
     * Displays blue colored message
     * @param {*} {*} any amount of object to debug
     */
    this.debug = function () {
        if (Logger.level === 0)
            consoleLog(arguments, _debug);
    };

    /**
     * Displays mustard colored message
     * @param {*} {*} any amount of object to info
     */
    this.info = function () {
        if (Logger.level <= 1)
            consoleLog(arguments, _info);
    };

    /**
     * Displays pink colored message
     * @param {*} {*} any amount of object to catch
     */
    this.catching = function () {
        if (Logger.level <= 2)
            consoleLog(arguments, _catching);
    };

    /**
     * Displays red colored message
     * @param {*} any amount of object to show as error
     */
    this.error = function () {
        if (Logger.level <= 2)
            consoleLog(arguments, _error);
    };
};
Logger.level = 0;

Logger.debugging = function () {
    Logger.level = 0
}
Logger.informer = function () {
    Logger.level = 1;
}
Logger.production = function () {
    Logger.level = 2;
}
Logger.silent = function () {
    Logger.level = 3;
}