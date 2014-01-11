var Rotator = null;

(function ($, Log, Tpl, _Scorer) {
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

            var onLoad = function () {
            };
            var onChange = function () {
            };

            var nextButton = null;
            var prevButton = null;

            this.setPrevButton = function (o) {
                if (!(o instanceof $))
                    LOGGER.debug('Controller should be an instance of $');
                else
                    prevButton = o;
                return this;
            }

            this.setNextButton = function (o) {
                if (!(o instanceof $))
                    LOGGER.debug('Controller should be an instance of $');
                else
                    nextButton = o;
                return this;
            }

            this.enableNextButton = function () {
                if (nextButton)
                    nextButton.removeClass('btn-default')
                        .addClass('btn-primary')
                        .removeClass('disabled')
                        .attr('onclick', 'Rotator.nextStep()');
                return this;
            }

            this.disableNextButton = function () {
                if (nextButton)
                    nextButton.addClass('disabled')
                        .removeClass('btn-primary')
                        .addClass('btn-default')
                        .attr('onclick', '');
                return this;
            }

            this.enablePrevButton = function () {
                if (prevButton)
                    prevButton.removeClass('disabled')
                              .attr('onclick', 'Rotator.prevStep()');
                return this;
            }

            this.disablePrevButton = function () {
                if (prevButton)
                    prevButton.addClass('disabled')
                              .attr('onclick', '');
                return this;
            }

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

            this.setOnLoadCallback = function (c) {
                if (typeof(c) !== 'function')
                    LOGGER.error('OnLoad callback should be a function');
                onLoad = c;
                return this;
            }

            this.setOnChangeCallback = function (c) {
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
                    }).fail(function (jqxhr, settings, exception) {
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
                            if (typeof instance.preDispatch === "function")
                                instance.preDispatch();
                            var mustache = instance.mustache();
                            if (typeof(mustache) === "object") {
                                LOGGER.info('Mustache view presents.')
                                view = mustache;
                            }
                        }
                        callback(view, instance);
                    }).fail(function (jqxhr, settings, exception) {
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
                    }).fail(function (jqxhr, settings, exception) {
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

            var fadeStepIn = function (id, callback) {
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

                var current = stepSpace.find('div.step[data-step="' + id + '"]');
                current.slideToggle().promise()
                    .done(function () {
                        current.addClass('current');
                        visibleStep = id;
                        onChange();
                        if (typeof(callback) === "function")
                            callback();
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
                LOGGER.debug("LAST: " + lastLoadedStep + "; NEXT: " + next);
                if (next > lastLoadedStep) {
                    loadStep(next, function () {
                        fadeStepIn(next);
                        if (typeof  callback === "function")
                            callback();
                    });
                } else {
                    fadeStepIn(next);
                    if (typeof  callback === "function")
                        callback();
                }
                next >= lastLoadedStep ? this.disableNextButton() : this.enableNextButton();
                this.enablePrevButton();
            }

            this.prevStep = function (callback) {
                var prev = visibleStep - 1;
                if (prev >= 0 && prev < lastLoadedStep) {
                    fadeStepIn(prev);
                    this.enableNextButton();
                } else {
                    LOGGER.error("Bad previous step: " + prev);
                }
                if (prev <= 0)
                    this.disablePrevButton();
            }

            this.currentStepId = function () {
                return visibleStep;
            }

            this.lastLoadedStepId = function () {
                return lastLoadedStep;
            }

            this.init = function (callback) {
                loadStepsSettings(function () {
                    loadStep(0, function () {
                        fadeStepIn(0, callback);
                    });
                });
            }

            this.notify = function (step, checkState) {
                if (checkState === false) {
                    if (visibleStep == lastLoadedStep)
                        this.disableNextButton();
                    return;
                }
                if (step > lastLoadedStep)
                    loadStep(lastLoadedStep + 1);
                this.enableNextButton();
                _Scorer.addScore(this.getStepScore());
            }
        }
})(jQuery, Logger, Templatetor, Scorer);

Rotator = new Rotator();