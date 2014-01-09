var Service;

(function ($) {
    Service = function () {
        var CONFIGFILE = 'trainer/settings/trainer.config.json';
        var trainerSetting = null;

        this.setConfigPath = function (p) {
            if (typeof p === "string")
                CONFIGFILE = p;
            return this;
        }

        this.getTrainerConfig = function () {
            return trainerSetting;
        }

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

        this.hashCode = function (s) {
            if (!s)
                return 0;
            return s.split("").reduce(function (a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0);
        }
    }
})(jQuery);

Service = new Service();