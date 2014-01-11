function Logger (c) {
    var name = typeof (c) === "undefined" ? 'Logger' : c;

    var _debug = 0;
    var _info = 1;
    var _error = 2;
    var _catching = 4;

    var getCaller = function () {
        var stack = (new Error).stack.match(/^(?!.*Logger).*$/gm);
        return stack[1].replace(/^\s+|\s+$/g, '');
    }

    var consoleLog = function (args, type) {
        var logger;
        if (type == _debug) {
            logger = function (o) {console.log ('%c ' + o, 'color: #4387fd')};
            grouper = function (s) {console.group('%c [DEBUG] [' + s + ']', 'color: #4387fd');}
        } else if (type == _info) {
            logger = function (o) {console.log ('%c ' + o, 'color: #D4BB02')};
            grouper = function (s) {console.group('%c [INFO] [' + s + ']', 'color: #D4BB02');}
        } else if (type == _error) {
            logger = function (o) {console.error(o)};
            grouper = function (s) {console.group('%c [ERROR] [' + s + ']', 'color: #FF0000');}
        } else if (type == _catching) {
            logger = function (o) {console.log ('%c ' + o, 'color: #FC1CEA')};
            grouper = function (s) {console.group('%c [CATCHING] [' + s + ']', 'color: #FC1CEA');}
        } else {
            logger = function (o) {console.log(o)};
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
    }

    this.debug = function () {
        if (Logger.level === 0)
            consoleLog(arguments, _debug);
    }

    this.info = function (m) {
        if (Logger.level <= 1)
            consoleLog(arguments, _info);
    }

    this.catching = function (m) {
        if (Logger.level <= 2)
            consoleLog(arguments, _catching);
    }

    this.error = function (m) {
        if (Logger.level <= 2)
            consoleLog(arguments, _error);
    }

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