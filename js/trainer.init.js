$(document).ready(function () {
    Cogwheel.setCogWheelElement($('#cogwheel-modal'))
        .setCogWheelDescElement($('#cogwheel-desc'))
        .setText('Init started')
        .show();

    $.ajaxSetup ({cache: false});
    var LOGGER = new Logger('INIT');
    var Tpl = new Templatetor();

    Cogwheel.setText('Setting up step rotator');
    Rotator.setStepSpace($('section.stepspace'));
    Rotator.setNextButton($('#nextController'))
           .setPrevButton($('#prevController'))
           .enableNextButton();

    Cogwheel.setText('Loading trainer settings');
    Service.loadConfig(function () {
        var config = Service.getTrainerConfig();

        Cogwheel.setText('Setting up i18n');
        I18N.setAvailbleLanguages(config['LANGUAGES']);
        var langParam = Service.getUrlParam('lang');
        if (langParam != '')
            I18N.setLanguage(langParam);
        else
            I18N.setLanguage(config['DEFAULT_LANG']);

        Cogwheel.setText('Loading language file');
        I18N.loadLanguage(function () {
            Cogwheel.setText('Reading language file');
            Templatetor.extendConstView(I18N.getConstants());
            Tpl.replace(true).setTemplate($('html')).render();
            Cogwheel.setText('Starting trainer');
            Rotator.init(function () {
                Scorer.start();
                Cogwheel.hide();
            });
        });
    });
});