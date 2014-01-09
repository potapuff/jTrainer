$(document).ready(function () {
    var LOGGER = new Logger('INIT');
    var TEMPLATETOR = new Templatetor();

    Rotator.setStepSpace($('section.stepspace'))

    // Starting...
    Service.loadConfig(function () {
        var config = Service.getTrainerConfig();
        if (config['TRAINER_NAME'])
            Templatetor.extendConstView({TRAINER_NAME: config['TRAINER_NAME']});
        console.log(window.location.hash.find);
        I18N.setAvailbleLanguages(config['LANGUAGES']).setLanguage(config['DEFAULT_LANG']);
        I18N.loadLanguage(function () {
            Templatetor.extendConstView(I18N.getConstants());
            var LList = new LangList().setLangs(I18N.getLangNames()).render();
            TEMPLATETOR.extendView({LANG_LIST: LList});
            TEMPLATETOR.replace(true).setTemplate($('html')).render();
            Rotator.init();
        });
    });

});