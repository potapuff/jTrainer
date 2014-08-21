var Rotator = null;

(function ($, Log, Tpl, _Scorer, _Service, _StepInvoker, _Cogwheel) {
    /**
     * Rotator is one of the main object of trainer that is responsible for the rotation
     * of steps
     * @instance
     */
    Rotator = new
        (function () {
            var self = this;
            var LOGGER = new Log();
            var TEMPLATETOR = new Tpl();

            var STEP_PATH = 'trainer/';
            var SCRIPTS_PATH = STEP_PATH + 'scripts/';
            var SETTINGS_PATH = STEP_PATH + 'settings/trainer.steps.json';
            var settings = null;
            var stepSpace = null;

            var lastLoadedStep = 0;
            var visibleStep = 0;

            var nextButton = null;
            var prevButton = null;

            this.defaultNextButtonAction = function() {Rotator.nextStep();}
            this.defaultPrevButtonAction = function() {Rotator.prevStep();}

            /**
             *  Get Steps settings to allow change and reorder it.
             *  @returns steps properties
             */
            this.getSteps = function(){
              return settings;
            }

            /**
             * Ties up an wrapped DOM element of Prev Button
             * @param o {jQuery} wrapped DOM element of Prev Button
             * @returns {Rotator} current object (flow)
             */
            this.setPrevButton = function (o) {
                if (!(o instanceof $))
                    throw new IllegalArgumentException('Controller should be an instance of $');
                prevButton = o;
                return this;
            };

            /**
             * Ties up an wrapped DOM element of Next Button
             * @param o {jQuery} wrapped DOM element of Next Button
             * @returns {Rotator} current object (flow)
             */
            this.setNextButton = function (o) {
                if (!(o instanceof $))
                    throw new IllegalArgumentException('Controller should be an instance of $');
                nextButton = o;
                return this;
            };

            /**
             * Enables next button
             * @returns {Rotator} current object (flow)
             */
            this.enableNextButton = function () {
                if (nextButton)
                    nextButton.removeClass('btn-default')
                        .addClass('btn-primary')
                        .removeClass('disabled')
                        .click(Rotator.goNext);
                return this;
            };

            /**
             * Disables next button
             * @returns {Rotator} current object (flow)
             */
            this.disableNextButton = function () {
                if (nextButton)
                    nextButton.addClass('disabled')
                        .removeClass('btn-primary')
                        .addClass('btn-default')
                        .off('click');
                return this;
            };

            /**
             * Run to next step via call default or binded action for prevStep button
             */
            this.goNext = function (){
              (   Rotator.getSteps()
               && Rotator.getSteps()[visibleStep]['NextButtonAction']
               || Rotator.defaultNextButtonAction)();
            }

            /**
             * Bind new callback for nextStep button
             * @param step - step to setting action
             * @param action - callback for next Button in current st
             */
            this.bindNextButtonAction = function (step,action) {
                if (typeof(action) === 'function'){
                   if (this.getSteps()){
                      this.getSteps()[step]['NextButtonAction'] = action;
                   }
                }
                return this;
            }

            /**
             * Enables prev button
             * @returns {Rotator} current object (flow)
             */
            this.enablePrevButton = function () {
                if (prevButton)
                    prevButton.removeClass('disabled')
                        .click(Rotator.goPrev);
                return this;
            };

            /**
             * Disables prev button
             * @returns {Rotator} current object (flow)
             */
            this.disablePrevButton = function () {
                if (prevButton)
                    prevButton
                        .addClass('disabled')
                        .off('click');
                return this;
            };

            /**
             * Run to previous step via call default or binded action for prevStep button
             */
            this.goPrev = function (){
              (   Rotator.getSteps()
               && Rotator.getSteps()[visibleStep]['PrevButtonAction']
               || Rotator.defaultPrevButtonAction)();
            }

            /**
             * Bind new callback for prevStep button
             * @param step - step to setting action
             * @param action - callback for prev Button in current st
             */
            this.bindPrevButtonAction = function (step,action) {
                if (typeof(action) === 'function'){
                   if (this.getSteps()){
                      this.getSteps()[step]['PrevButtonAction'] = action;
                   }
                }
                return this;
            }

            /**
             * Sets patch to steps files
             * @param p {String} step path
             * @returns {Rotator} current object (flow)
             */
            this.setStepsPath = function (p) {
                STEP_PATH = p;
                return this;
            };

            /**
             * Sets patch to step's script files
             * @param p {String} step's scripts path
             * @returns {Rotator} current object (flow)
             */
            this.setScriptsPath = function (p) {
                SCRIPTS_PATH = p;
                return this;
            };

            /**
             * Sets patch to step's setting files
             * @param p {String} step path
             * @returns {Rotator} current object (flow)
             */
            this.setSettingsPath = function (p) {
                SETTINGS_PATH = p;
                return this;
            };

            /**
             * Sets an object where steps will be loaded
             * @param p {jQuery} wrapped DOM element
             * @returns {Rotator} current object (flow)
             */
            this.setStepSpace = function (ss) {
                if (!(ss instanceof $))
                    throw new IllegalArgumentException('Step\'s space should be an instance if jQuery');
                else if (ss.length == 0)
                    throw new IllegalStateException('There is no such element in DOM');
                stepSpace = ss;
                return this;
            };

            /**
             * Pushes data into step's space
             * @param data {String} data
             */
            var toStepSpace = function (data) {
                if (!stepSpace || stepSpace.length == 0)
                    throw new IllegalStateException('Step space is undefined');
                stepSpace.append(data);
            };

            /**
             * Loads step's setting file
             * @param callback {function} callback to call after loading
             */
            var loadStepsSettings = function (callback) {
                $.ajax({
                    url: SETTINGS_PATH,
                    dataType: "JSON"
                }).done(function (data) {
                        LOGGER.info('Settings data loaded...');
                        settings = data;
                        LOGGER.debug(settings);
                        if (typeof(callback) === "function")
                            callback();
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * Loads step's script file and executing it.
             *
             * Every step's script should contain function expressing named the same with step.
             * Firstly, stepClass.preDispatch() method runs. It can be with/without callback.
             * This method goes first and usually is used to perform async things before step will be displayed;
             *
             * Than goes stepClass.mustache() method. This method should return an view object for
             * replacement.
             * This method usually is used to bind data from stepClass and application view
             *
             * The latest is stepClass.postDispatch(). This method goes last and executes after rendering
             * step is performed. It's great for binding events. It executes in {@link loadStep} method.
             *
             * @param step  {String} name of step
             * @param callback {function} callback to call after loading script file
             */
            var getStepScript = function (step, callback) {
                var view = {};
                if (!settings[step]['hasScript']) {
                    LOGGER.info('Step <' + step + '> doesn\'t has own script');
                    callback(view);
                    return;
                }
                $.getScript(SCRIPTS_PATH + settings[step]['filename'] + '.js')
                    .done(function (script) {
                        LOGGER.info('Step\'s script loaded...');
                        var stepJSObject = window[settings[step]['filename']];
                        LOGGER.debug(stepJSObject);
                        if (typeof (stepJSObject) === "function") {
                            var instance = new stepJSObject();
                            var mergeView = function () {
                                var mustache = instance.mustache();
                                if (typeof(mustache) === "object")
                                    view = mustache;
                            };
                            if (typeof instance.preDispatch === "function") {
                                if (instance.preDispatch.length > 0) {
                                    instance.preDispatch(function () {
                                        mergeView();
                                        callback(view, instance);
                                    });
                                    return;
                                } else {
                                    instance.preDispatch();
                                }
                            }
                            mergeView();
                        }
                        callback(view, instance);
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * Loads html template of a step
             * @param step {String} step's name
             * @param callback {function} callback to call after loading html file
             */
            var getStepData = function (step, callback) {
                $.get(STEP_PATH + settings[step]['filename'] + '.html')
                    .done(function (data) {
                        LOGGER.info('Step loaded...');
                        data = '<div data-step="' + step + '" class="step">' + data + '</div>';
                        LOGGER.debug(data);
                        callback(data);
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * This method is an union of several methods, that performs the whole cycle of loading step
             * @param step {Number} name of step
             * @param callback {function} callback to call after loading step
             */
            var loadStep = function (step, callback) {
                if (!settings || settings.length === 0)
                    throw new IllegalStateException('Step\'s settings haven\'t been loaded yet or is empty');
                _Cogwheel.setText('Loading step').show();
                getStepData(step, function (html) {
                    TEMPLATETOR.setTemplate(html);
                    getStepScript(step, function (mustache, scriptInstance) {
                        var data = TEMPLATETOR.extendView(mustache).render();
                        lastLoadedStep = step;
                        toStepSpace(data);
                        LOGGER.debug(scriptInstance);
                        if (scriptInstance && typeof scriptInstance.postDispatch === "function")
                            scriptInstance.postDispatch();
                        if (PRODUCTION && step >= settings.length)
                            _Service.pushResults();
                        if (typeof(callback) === "function")
                            callback(data, scriptInstance);
                    });
                });
            };

            /**
             * Methods allows you to navigate through already loaded steps.
             * @param id {Number} index of a step
             * @param callback {function} callback to call after changing step
             */
            var fadeStepIn = function (id, callback) {
                if (id >= settings.length)
                    throw new IllegalStateException('Step <' + id + '> is not loaded');
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
                        _Cogwheel.hide();
                        if (typeof(callback) === "function")
                            callback();
                    });
            };

            /**
             * Allows to switch step by id, it it's loaded
             * @param step {Number} step's id
             */
            this.switchStep = function (step) {
                fadeStepIn(step, function () {
                    if (visibleStep < lastLoadedStep)
                        self.enableNextButton();
                    else
                        self.disableNextButton();

                    if (visibleStep > 0)
                        self.enablePrevButton();
                    else
                        self.disablePrevButton();
                });
            };

            /**
             * Gets a max score for this step
             * @param step {Number} step's index
             * @returns {Numeric} amount of points for this step
             */
            this.getStepScore = function (step) {
                if ($.isNumeric(step) && step < settings.length)
                    return settings[step]['score'];
                else
                    return settings[visibleStep]['score'];
            };

            /**
             * Performs transition to the next level
             * @param callback {function} callback to call after changing step
             * @returns {boolean} true, if the transition was successful, otherwise - false
             */
            this.nextStep = function (callback) {
                var next = visibleStep + 1;
                if (next >= settings.length)
                    throw new IllegalStateException('No next step');
                LOGGER.debug("LAST: " + lastLoadedStep + "; NEXT: " + next);
                if (next > lastLoadedStep) {
                    loadStep(next, function () {
                        fadeStepIn(next, function () {
                            _StepInvoker.invoke();
                            if (typeof callback == "function")
                                callback();
                        });
                    });
                } else {
                    fadeStepIn(next, callback);
                }
                next >= lastLoadedStep ? this.disableNextButton() : this.enableNextButton();
                this.enablePrevButton();
                return true;
            };

            /**
             * Performs transition to the prev level
             * @param callback {function} callback to call after changing step
             */
            this.prevStep = function (callback) {
                var prev = visibleStep - 1;
                if (prev < 0 || prev > lastLoadedStep)
                    throw new IllegalStateException("Bad previous step: " + prev);
                fadeStepIn(prev, callback);
                this.enableNextButton();

                if (prev <= 0)
                    this.disablePrevButton();
            };

            /**
             * Gets current step's index
             * @returns {number} id of a step
             */
            this.currentStepId = function () {
                return visibleStep;
            };

            /**
             * Gets last loaded step's index
             * @returns {number} id of a last step
             */
            this.lastLoadedStepId = function () {
                return lastLoadedStep;
            };

            /**
             * Factory method for preloading first step
             * @param callback {function} callback to call after loading step
             */
            this.init = function (callback) {
                loadStepsSettings(function () {
                    loadStep(0, function () {
                        fadeStepIn(0, callback);
                        self.disablePrevButton();
                    });
                });
            };
        });
})(jQuery, Logger, Templatetor, Scorer, Service, StepInvoker, Cogwheel);