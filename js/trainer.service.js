var Service;
var ScriptInvoker;

(function ($, _Scorer, _Logger) {
    /**
     * This object contains some service methods
     * @instance
     */
    Service = new
        (function () {
            var LOGGER = new _Logger();
            var CONFIG_FILE = 'trainer/settings/trainer.config.json';
            var trainerVersion = '1.9 build28022014';
            var trainerSetting = null;
            var reportUrl;

            /**
             * Sets trainer's config file path
             * @param p {String} path to trainer's config file
             * @returns {Service} current object (flow)
             */
            this.setConfigPath = function (p) {
                if (typeof p === "string")
                    CONFIG_FILE = p;
                return this;
            };

            /**
             * Gets trainer's settings, if they are loaded
             * @returns {*}
             */
            this.getTrainerConfig = function () {
                return trainerSetting;
            };

            /**
             * Loads trainer's config file
             * @param callback {function} callback to call after successful file loading
             */
            this.loadConfig = function (callback) {
                $.ajax({
                    url: CONFIG_FILE,
                    dataType: "JSON"
                }).done(function (data) {
                        trainerSetting = data;
                        if (typeof(callback) === "function")
                            callback();
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * Returns a value from URL query
             * @param name {String} query param's name
             * @returns {String} value of param
             */
            this.getUrlParam = function (name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            };

            /**
             * Loads external script file and appending it to DOM
             * @param url src prop of <script> tag
             * @param callback func
             */
            this.appendScript = function (url, callback) {
                var script = document.createElement("script")
                script.type = "text/javascript";
                if (script.readyState) {  //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" ||
                            script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {  //Others
                    script.onload = function () {
                        callback();
                    };
                }
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            }

            /**
             * About trainer alert
             */
            this.about = function () {
                alert('jTrainer v' + trainerVersion + '\nSumDU Distance Learning E-Trainer\nAuthor: Ilia Ovchinnikov');
            };

            /**
             * Sends data about trainer start to SSU server
             * @param callback func that will be called after notifying
             */
            this.notifyServer = function (callback) {
                LOGGER.debug("Notifying server...");
                var host = window.location.href;
                host = host.substring(0, host.lastIndexOf('/') + 1);
                LOGGER.debug("Host:" + host);
                var server_info_url, server_url, send_report_url;
                server_info_url = host + 'server_info.txt';
                LOGGER.debug('server_info_url: ' + server_info_url);
                $.get(server_info_url)
                    .done(function (data) {
                        server_url = 'http://' + window.location.host + data.replace('server_url=', '');
                        $.get(server_url)
                            .done(function (data) {
                                send_report_url = 'http://' + window.location.host + data.replace('send_report_url=', '');
                                $.get(send_report_url);
                                reportUrl = send_report_url;
                                if (typeof callback === "function")
                                    callback();
                            }).fail(function (jqxhr, settings, exception) {
                                throw new IllegalAsyncStateException(exception);
                            });
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * Pushes user's results to SSU server
             * @param callback func i'll call when transferring is done
             */
            this.pushResults = function (callback) {
                if (!reportUrl)
                    throw new IllegalStateException('Server is not notified yet');

                var uScore = _Scorer.getScore();
                var uScoreInPercent = (Math.floor(uScore / _Scorer.getTotalScore()) * 100).toFixed(2);
                ;
                $.post(reportUrl, {
                    total_points: _Scorer.getTotalScore(),
                    user_points: uScore,
                    is_done: 1,
                    is_passed: 1,
                    user_reply: uScoreInPercent >= 60 ? "YES - " + uScore : "NO - " + uScore
                }).done(function (data) {
                        LOGGER.debug("RESULT: " + data);
                        if (typeof callback === "function")
                            callback(data);
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };
        });
})(jQuery, Scorer, Logger);

(function ($, _Logger) {

    /**
     * This is a class to invoke functions by string including ability to
     * execute function from .js source file
     */
    ScriptInvoker = function () {
        var LOGGER = new _Logger();
        var clean = true;

        var sources = [];
        var loadedSources = [];
        var commands = [];

        /**
         * Auto clean invoker stack switch
         * @param b auto clean if true, otherwise saves stack values
         * @returns {ScriptInvoker} current object (flow)
         */
        this.autoClean = function(b) {
            clean = !!b;
            return this;
        };

        /**
         * Adds a source file to execute function from
         * @param src path to js file
         * @returns {ScriptInvoker} current object (flow)
         */
        this.addSource = function (src) {
            src = src + '';
            if (src.indexOf('.js') < 0)
                throw new IllegalArgumentException("Source must be a file with *.js extension");
            sources.push(src);
            return this;
        };

        /**
         * Adds a function and it's arguments to invoke
         * @param funct function name
         * @param args arguments of function
         * @returns {ScriptInvoker} current object (flow)
         */
        this.addCommand = function (funct, args) {
            commands.push([funct, $.makeArray(args)]);
            return this;
        };

        /**
         * Loads scripts from 'scripts' array
         * @param callback funct to call after loading
         * @param i pointer to current scr
         */
        var loadScripts = function (callback, i) {
            i = i || 0;
            if (sources.length == 0) {
                if (typeof callback == "function")
                    callback();
                return;
            }

            if ($.inArray(sources[i], loadedSources) >= 0) {
                if (i + 1 >= sources.length) {
                    if (typeof callback == "function")
                        callback();
                    return;
                }
                loadScripts(callback, ++i);
            }

            $.getScript(sources[i])
                .done(function () {
                    LOGGER.debug("Script from " + sources[i] + " loaded successfully");
                    loadedSources.push(sources[i]);
                    if (i >= (sources.length - 1)) {
                        if (typeof callback == "function")
                            callback();
                    } else {
                        loadScripts(callback, ++i);
                    }
                }).fail(function (jqxhr, settings, exception) {
                    LOGGER.error("Failed to load data from source: " + sources[i]);
                });
        };

        /**
         * Starts to invoking commands
         */
        this.invoke = function () {
            var cmd, f, gf, args;

            LOGGER.debug("Loading scripts from sources:", sources);
            var self = this;
            loadScripts(function () {
                LOGGER.debug('Invoking commands:', commands);
                for (var i in commands) {
                    cmd = commands[i];
                    f = cmd[0], args = cmd[1];
                    if (typeof f == "function")
                        f.apply(null, args);
                    else {
                        gf = window[(f + '')];
                        LOGGER.debug("Calling", f, gf);
                        if (gf)
                            gf.apply(null, args);
                        else
                            LOGGER.error("Tried to invoke not existing function " + f);
                    }
                }
                if (clean)
                    self.clear();
            });
        };

        /**
         * Clears sources and commands stacks
         * @returns {ScriptInvoker} current object (flow)
         */
        this.clear = function() {
            sources.length = 0;
            commands.length = 0;
            return this;
        }
    };
})(jQuery, Logger);

/**
 * This is an instance of ScriptInvoker used by engine, especially by rotator.
 * Rotator invokes all commands of StepInvoker after calling nextStep()
 *
 * Used for executing necessary scripts for elements etc
 * @type {ScriptInvoker}
 */
var StepInvoker = new ScriptInvoker();

function IllegalArgumentException(message) {
    this.name = 'IllegalArgumentException';
    this.message = message;
    this.stack = (new Error).stack;
    this.toString = function () {
        return this.name + (!!this.message ? ': ' + this.message : '');
    };
}

function IllegalStateException(message) {
    this.name = 'IllegalStateException';
    this.message = message;
    this.stack = (new Error).stack;
    this.toString = function () {
        return this.name + (!!this.message ? ': ' + this.message : '');
    };
}

function NoArgumentException(message) {
    this.name = 'NoArgumentException';
    this.message = message;
    this.stack = (new Error).stack;
    this.toString = function () {
        return this.name + (!!this.message ? ': ' + this.message : '');
    };
}

function IllegalDataException(message) {
    this.name = 'IllegalDataException';
    this.message = message;
    this.stack = (new Error).stack;
    this.toString = function () {
        return this.name + (!!this.message ? ': ' + this.message : '');
    };
}

function IllegalAsyncStateException(message) {
    this.name = 'IllegalAsyncStateException';
    this.message = message;
    this.stack = (new Error).stack;
    this.toString = function () {
        return this.name + (!!this.message ? ': ' + this.message : '');
    };
}