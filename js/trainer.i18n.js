var I18N = null;
(function ($, _Logger) {
    /**
     * I18N is an object that provides translation of the trainer
     * @instance
     */
    I18N = new
        (function () {
            var LOGGER = new _Logger();
            var LANG_PATH = 'langs/';

            var langs = [];
            var currentLangData = null;
            var currentLangCode = null;

            /**
             * Sets a path to language files .json
             * @param p {String} path to language folder
             * @returns {I18N} current object (flow)
             */
            this.setPath = function (p) {
                LANG_PATH = p;
                return this;
            };

            /**
             * Sets an object of all available languages
             * @param a {Object} assoc array of allowed languages
             * @returns {I18N} current object (flow)
             */
            this.setAvailableLanguages = function (a) {
                if (typeof a !== "object")
                    throw new IllegalArgumentException("Langs should be an object (assoc array)");
                for (var key in a) {
                    if (a.hasOwnProperty(key)) {
                        langs[key] = a[key];
                    }
                }
                return this;
            };

            /**
             * Sets current language of trainer.
             * Language, specified by this setter, may be loaded with {@link I18N.loadLangugae}
             * @param l {String} language code
             * @returns {I18N} current object (flow)
             */
            this.setLanguage = function (l) {
                LOGGER.debug(langs);
                LOGGER.debug(langs.length);
                LOGGER.debug(typeof langs);

                if (!langs.hasOwnProperty(l)) {
                    LOGGER.info('Language is not one of available languages. I\'ll set another, ok?');
                    for (var code in langs) {
                        currentLangCode = code;
                        break;
                    }
                } else {
                    currentLangCode = l;
                }
                return this;
            };

            /**
             * Loads language data from json lang database
             * @param callback {function} a callback, that will be called after a successful download
             */
            this.loadLanguage = function (callback) {
                $.get(LANG_PATH + currentLangCode + '.json')
                    .done(function (data) {
                        LOGGER.info('Language data loaded...');
                        if (!data || !data.hasOwnProperty('lang') || !data.hasOwnProperty('local'))
                            throw new IllegalDataException('Language file looks bad');

                        LOGGER.info('Language file is good');
                        currentLangData = data;
                        if (typeof(callback) === "function")
                            callback();
                    }).fail(function (jqxhr, settings, exception) {
                        currentLangCode = null;
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * Gets the language strings
             * @returns {Object} assoc array of lang constants
             */
            this.getConstants = function () {
                if (!currentLangData)
                    throw new IllegalStateException('Language file is not loaded');
                return currentLangData['lang'];
            };

            /**
             * Gets language names from available languages
             * @returns {Array} array of language code-local name pairs
             */
            this.getLangNames = function () {
                return langs;
            };

            /**
             * Gets a language code of current language
             * @returns {String} language code
             */
            this.getCurrentLang = function () {
                return currentLangCode;
            };
        });
})
    (jQuery, Logger);