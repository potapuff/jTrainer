var Service;

(function ($, _Scorer) {
    /**
     * This object contains some service methods
     * @instance
     */
    Service = new
        (function () {
            var CONFIG_FILE = 'trainer/settings/trainer.config.json';
            var trainerVersion = '1.6 build23012014';
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
                $.get(CONFIG_FILE)
                    .done(function (data) {
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
             * About trainer alert
             */
            this.about = function () {
                alert('jTrainer v' + trainerVersion + '\nSumDU Distance Learning E-Trainer\nAuthor: Ilia Ovchinnikov');
            };

            this.notifyServer = function (callback) {
                var host = window.location.href;
                if (host.indexOf('index.html') != '-1')
                    host = host.substring(0, host.indexOf('index.html'));
                var server_info_url, server_url, send_report_url;
                server_info_url = host + 'server_info.txt';
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
                return host;
            };

            this.pushResults = function (callback) {
                if (!reportUrl)
                    throw new IllegalStateException('Server is not notified yet');
                $.post(reportUrl,
                    {
                        total_points: _Scorer.getTotalScore(),
                        user_points: _Scorer.getScore(),
                        is_done: 1,
                        user_reply: "Прохождение тренажера закончено"
                    }).done(function () {
                        if (typeof callback === "function")
                            callback();
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };
        });
})(jQuery, Scorer);

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