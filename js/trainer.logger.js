function Logger (c) {
    var name = typeof (c) === "undefined" ? 'Logger' : c;
    
    var print = function (o, desc, color) {
        var log = function (msg) {console.log(msg)};
        if (typeof(color) !== "undefined")
            log = function (msg) {console.log ('%c ' + msg, 'color:' + color)};
        
        if (typeof(o) !== "object") {
            log(name + ' :: [' + desc + '] ' + o);
        } else {
            log(name + ' :: [' + desc + '] typeof === Object');
            console.log(o);
        }
    }
    
    this.debug = function (m) {
        if (Logger.level === 0)
            print(m, 'Debug', '#4387fd');
    }
    
    this.info = function (m) {
        if (Logger.level <= 1)
            print(m, 'Info', '#D4BB02');
    }
    
    this.catching = function (m) {
        if (Logger.level <= 2)
            print(m, 'Exception', '#FC1CEA');
    }
    
    this.error = function (m) {
        if (Logger.level <= 2)
            print(m, 'Error', '#FF0000');
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