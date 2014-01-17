var Service;

(function ($) {
    /**
     * This object contains some service methods
     * @instance
     */
    Service = new
        (function () {
            var CONFIGFILE = 'trainer/settings/trainer.config.json';
            var trainerVersion = '1.2';
            var trainerSetting = null;

            /**
             * Sets trainer's config file path
             * @param p {String} path to trainer's config file
             * @returns {Service} current object (flow)
             */
            this.setConfigPath = function (p) {
                if (typeof p === "string")
                    CONFIGFILE = p;
                return this;
            }

            /**
             * Gets trainer's settings, if they are loaded
             * @returns {*}
             */
            this.getTrainerConfig = function () {
                return trainerSetting;
            }

            /**
             * Loads trainer's config file
             * @param callback {function} callback to call after successful file loading
             */
            this.loadConfig = function (callback) {
                $.get(CONFIGFILE)
                    .done(function (data) {
                        trainerSetting = data;
                        if (typeof(callback) === "function")
                            callback();
                    }).fail(function (jqxhr, settings, exception) {
                        LOGGER.catching(exception);
                    });
            }

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
            }

            /**
             * About trainer alert
             */
            this.about = function () {
                alert('jTrainer v' + trainerVersion + '\nSumDU Distance Learning E-Trainer\nAuthor: Ilia Ovchinnikov');
            }
        });
})(jQuery);