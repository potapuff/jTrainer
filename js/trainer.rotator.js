var Rotator = null;

(function($, Log, Tpl) {
    Rotator = 
        function () {
            var LOGGER = new Log('Rotator');
            var TEMPLATETOR = new Tpl();

            var STEPPATH = 'trainer/';
            var SCRIPTSPATH = STEPPATH + 'scripts/';
            var SETTINGSPATH = STEPPATH + 'settings/trainer.steps.json';
            var settings = null;
            var stepSpace = null;
            
            var lastLoadedStep = 0;
            var visibleStep = 0;
            
            var onLoad = function() {};
            var onChange = function() {};
            
            this.setStepsPath = function (p) {
                STEPPATH = p;
                return this;
            }
            
            this.setScriptsPath = function (p) {
                SCRIPTSPATH = p;
                return this;
            }
            
            this.setSettingsPath = function (p) {
                SETTINGSPATH = p;
                return this;
            }
            
            this.setOnLoadCallback = function(c) {
                if (typeof(c) !== 'function')
                    LOGGER.error('OnLoad callback should be a function');
                onLoad = c;
                return this;
            }
            
            this.setOnChangeCallback = function(c) {
                if (typeof(c) !== 'function')
                    LOGGER.error('OnChange callback should be a function');
                onChange = c;
                return this;
            }
            
            this.setStepSpace = function (ss) {
                if (!(ss instanceof $))
                    LOGGER.error('Step\'s space should be an instance if jQuery');
                else if (ss.length == 0)
                    LOGGER.error('There is no such element in DOM');
                else
                    stepSpace = ss;
                return this;
            }
            
            var toStepSpace = function (data) {
                if (!stepSpace || stepSpace.length == 0) {
                    LOGGER.error('Step space is undefined');
                    return false;
                } else {
                    stepSpace.append(data);
                    return true;
                }
            }
            
            var loadStepsSettings = function (callback) {
                $.get(SETTINGSPATH)
                    .done(function (data, textStatus) {
                        LOGGER.info('Settings data loaded...');
                        settings = data;
                        LOGGER.debug(settings);
                        if (typeof(callback) === "function")
                            callback();
                    }).fail(function(jqxhr, settings, exception) {
                        LOGGER.catching(exception);
                });
            }
            var getStepScript = function (step, callback) {
                var view = {};
                if (!settings[step]['hasScript']) {
                    LOGGER.info('Step <' + step + '> doesn\'t has own script');
                    callback(view);
                    return;
                }
                $.getScript(SCRIPTSPATH + settings[step]['filename'] + '.js')
                    .done(function (script, textStatus) {
                        LOGGER.info('Step\'s script loaded...');
                        var stepJSObject = window[settings[step]['filename']];
                        LOGGER.debug(stepJSObject);
                        if (typeof (stepJSObject) === "function") {
                            var instance = new stepJSObject();
                            var mustache = instance.mustache();
                            if (typeof(mustache) === "object") {
                                LOGGER.info('Mustache view presents.')
                                view = mustache;
                            }
                            if (typeof instance.preDispatch === "function")
                                instance.preDispatch();
                        }
                        callback(view, instance);
                    }).fail(function(jqxhr, settings, exception) {
                        LOGGER.catching(exception);
                });
            }
            
            var getStepData = function (step, callback) {
                $.get(STEPPATH + settings[step]['filename'] + '.html')
                    .done(function (data, textStatus) {
                        LOGGER.info('Step loaded...');
                        data = '<div data-step="' + step + '" class="step">' + data + '</div>';
                        LOGGER.debug(data);
                        onLoad();
                        callback(data);
                    }).fail(function(jqxhr, settings, exception) {
                        LOGGER.catching(exception);
                });
            }
            
            var loadStep = function (step, callback) {
                // get step's html -> load step's script -> execute sctipt -> append new tpl view (if is) -> compile
                if (!settings || settings.length === 0) {
                    LOGGER.error('Step\'s settings haven\'t been loaded yet or is empty');
                    return;
                }
                getStepData(step, function (html) {
                    TEMPLATETOR.setTemplate(html);
                    getStepScript(step, function (mustache, scriptInstance) {
                        var data = TEMPLATETOR.extendView(mustache).render();
                        lastLoadedStep = step;
                        toStepSpace(data);
                        console.log(scriptInstance)
                        if (scriptInstance && typeof scriptInstance.postDispatch === "function")
                            scriptInstance.postDispatch();
                        if (typeof(callback) === "function")
                            callback(data, scriptInstance);
                    });
                });
            }
            
            var fadeStepIn = function (id) {
                if (id >= settings.length) {
                    LOGGER.error('Step <' + id + '> is not loaded');
                    return;
                }
                var old = stepSpace.find('div[data-step="' + visibleStep + '"]');
                if (old.is(':visible')) {
                    old.slideToggle().promise()
                        .done(function () {
                            old.removeClass('current');
                    });
                } else
                    old.removeClass('current');
                
                var current = stepSpace.find('div.step[data-step="' + id +'"]');
                current.slideToggle().promise()
                    .done(function() {
                        current.addClass('current');
                        visibleStep = id;
                        onChange();
                });
            }
            
            this.switchStep = function (step) {
                fadeStepIn(step);
            }
            
            this.getStepScore = function (step) {
                if ($.isNumeric(step) && step < settings.length)
                    return settings[step]['score'];
                else
                    return settings[visibleStep]['score'];
            }

            this.nextStep = function (callback) {
                var next = visibleStep + 1;
                if (next >= settings.length) {
                    LOGGER.info('No next step');
                    return false;
                }
                if (next > lastLoadedStep) {
                    loadStep (next, function () {
                        fadeStepIn(next);
                        if (typeof  callback === "function")
                            callback();
                    });
                } else {
                    fadeStepIn(next);
                    if (typeof  callback === "function")
                        callback();
                }
            }

            this.prevStep = function (callback) {
                var prev = visibleStep - 1;
                if (prev >= 0 && prev < lastLoadedStep)
                    fadeStepIn(prev);
                else
                    LOGGER.error("Bad previous step: " + prev);
            }

            this.init = function (callback) {
                loadStepsSettings(function () {
                    loadStep (0, function () {
                        fadeStepIn(0);
                        if (typeof  callback === "function")
                            callback();
                    });
                });
            }
        }
})(jQuery, Logger, Templatetor);

Rotator = new Rotator();