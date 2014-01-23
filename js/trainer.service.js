var Service;

(function ($) {
    /**
     * This object contains some service methods
     * @instance
     */
    Service = new
        (function () {
            var CONFIG_FILE = 'trainer/settings/trainer.config.json';
            var trainerVersion = '1.6 build23012014';
            var trainerSetting = null;

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
        });
})(jQuery);

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