var I18N = null;
(function ($, Log) {
    I18N =
        function () {
            var LOGGER = new Log('I18N');
            var LANGPATH = 'langs/';

            var langs = [];
            var currentLangData = null;
            var currentLangCode = null;

            this.setPath = function (p) {
                LANGPATH = p;
                return this;
            }

            this.setAvailbleLanguages = function (a) {
                if ((typeof a === "object")) {
                    for (var key in a) {
                        if (a.hasOwnProperty(key)) {
                            langs[key] = a[key];
                        }
                    }
                }
                return this;
            }

            this.setLanguage = function (l) {
                LOGGER.debug(langs);
                LOGGER.debug(langs.length);
                LOGGER.debug(typeof langs);
                if (!langs.hasOwnProperty(l)) {
                    LOGGER.error('Language is not one of available languages')
                }
                currentLangCode = l;
                return this;
            }

            this.loadLanguage = function (callback) {
                $.get(LANGPATH + currentLangCode + '.json')
                    .done(function (data) {
                        LOGGER.info('Language data loaded...');
                        if (!data || !data.hasOwnProperty('lang') || !data.hasOwnProperty('local')) {
                            LOGGER.error('Language file looks bad');
                            currentLangCode = null;
                            return;
                        }
                        LOGGER.info('Language file is good');
                        currentLangData = data;
                        if (typeof(callback) === "function")
                            callback();
                    }).fail(function (jqxhr, settings, exception) {
                        LOGGER.catching(exception);
                        currentLangCode = null;
                    });
            }

            this.getConstants = function () {
                if (!currentLangData) {
                    LOGGER.error('Language file is not loaded');
                    return false;
                }
                return currentLangData['lang'];
            }

            this.getLangNames = function () {
                return langs;
            }

            this.getCurrentLang = function () {
                return currentLangCode;
            }
        }
})(jQuery, Logger);

I18N = new I18N();