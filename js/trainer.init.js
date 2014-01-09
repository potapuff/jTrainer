$(document).ready(function () {
    var LOGGER = new Logger('INIT');
    var TEMPLATETOR = new Templatetor();

    Rotator.setStepSpace($('section.stepspace'))

    // Starting...
    Service.loadConfig(function () {
        var config = Service.getTrainerConfig();
        if (config['TRAINER_NAME'])
            Templatetor.extendConstView(config['vars']);

        I18N.setAvailbleLanguages(config['LANGUAGES']);
        var hash = window.location.hash;
        if (hash.indexOf('lang=') != -1)
            I18N.setLanguage(hash.substr(6,2));
        else
            I18N.setLanguage(config['DEFAULT_LANG']);

        I18N.loadLanguage(function () {
            Templatetor.extendConstView(I18N.getConstants());
            var LList = new LangList().setLangs(I18N.getLangNames()).render();
            TEMPLATETOR.extendView({LANG_LIST: LList});
            TEMPLATETOR.replace(true).setTemplate($('html')).render();
            Rotator.init();
        });
    });
});