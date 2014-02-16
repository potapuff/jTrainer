$(document).ready(function () {
    Cogwheel.setCogWheelElement($('#cogwheel-modal'))
            .setCogWheelDescElement($('#cogwheel-desc'))
            .setText('Init started')
            .show();

    Cogwheel.setText('Loading trainer settings');
    Service.loadConfig(function () {
        var config = Service.getTrainerConfig();
        if (config['STAGE'] == 'development') {
            $.ajaxSetup({cache: false});
            Logger.debugging();
        } else if (config['STAGE'] == 'production') {
            Logger.production();
        }

        Cogwheel.setText('Setting up step rotator');
        Rotator.setStepSpace($('section.stepspace'));
        Rotator.setNextButton($('#nextController'))
               .setPrevButton($('#prevController'))
               .enableNextButton();

        Cogwheel.setText('Setting up i18n');
        I18N.setAvailableLanguages(config['LANGUAGES']);
        var langParam = Service.getUrlParam('lang');
        if (langParam != '')
            I18N.setLanguage(langParam);
        else
            I18N.setLanguage(config['DEFAULT_LANG']);

        Cogwheel.setText('Loading language file');
        I18N.loadLanguage(function () {
            Cogwheel.setText('Reading language file');
            Templatetor.extendConstView(I18N.getConstants());
            Templatetor.extendConstView({TRAINER_SCORE: config['TRAINER_SCORE']});
            Scorer.setTotalScore(config['TRAINER_SCORE']);
            var Tpl = new Templatetor();
            Tpl.replace(true).setTemplate($('html')).render();
            Cogwheel.setText('Starting trainer');
            Rotator.init(function () {
                Scorer.start();
                Cogwheel.setText('Notifying server');
                Cogwheel.hide();
                /*Service.notifyServer(function() {
                    Cogwheel.hide();
                })*/
            });
        });
    });
});