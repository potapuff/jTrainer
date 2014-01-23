var introduction = function () {
    this.preDispatch = function () {
    }

    this.postDispatch = function () {
    }

    this.mustache = function () {
        var langList = new Select('languageSelect').addAttribute('onchange', 'window.location.href = \'/?lang=\' + $(this).val()');
        var langs = I18N.getLangNames();
        var currentLang = I18N.getCurrentLang();
        for (var code in langs) {
            if (langs.hasOwnProperty(code)) {
                if (code == currentLang)
                    langList.addOption(langs[code], code, true);
                else
                    langList.addOption(langs[code], code, false);
            }
        }

        return {LANG_LIST: langList.render()}
    }
}