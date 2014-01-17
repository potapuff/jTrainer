var introduction = function () {
    this.preDispatch = function () {
    }

    this.postDispatch = function () {
    }

    this.mustache = function () {
        var langList = new Select().addAttribute('onchange', 'window.location.href = \'/?lang=\' + $(this).val()');
        var langs = I18N.getLangNames();
        for (var code in langs) {
            if (langs.hasOwnProperty(code)) {
                langList.addOption(langs[code], code);
            }
        }

        return {LANG_LIST: langList.setDefaultValue(I18N.getCurrentLang()).render()}
    }
}