var Validator = null;

(function ($, _Logger, _Rotator, _Scorer) {
    /**
     * Validator is a class for checking fields and forms in trainer.
     *
     * Current version of validator has 2 modes: strict and non-strict mode.
     * Non-strict mode ignores amount of user's attempts and allows the user to go to the next step
     * as soon as all fields are written correctly.
     *
     * In strict mode, Validator monitors the number of attempts and allows to go to next level
     * if the number of attempts is 0 (in this case the number of points for this step decreases) or if
     * everything was entered correctly.
     * @constructor
     */
    Validator =
        function () {
            var LOGGER = new _Logger();

            var fulfilled = false;
            var targets = [];

            var isStrict = false;
            var attempts = 3;
            var ignoreCase = true;

            /**
             * Sets a strict mode for Validator
             * @param b {Boolean} strict mode switch
             * @returns {Validator} current object (flow)
             */
            this.setStrictMode = function (b) {
                if (typeof b !== "boolean")
                    throw new IllegalArgumentException("Mode switch should be boolean");
                isStrict = b;
                return this;
            };

            /**
             * Switch for case sensitivity of validator
             * @param b {Boolean} sensitivity mode switch
             * @returns {Validator} current object (flow)
             */
            this.setIgnoreCase = function (b) {
                if (typeof b !== "boolean")
                    throw new IllegalArgumentException("Case sensitivity switch should be boolean");
                ignoreCase = b;
                return this;
            };

            /**
             * Sets an amount of attempts in strict mode, that user can use to write a correct answer.
             * @param a {number} amount of attempts
             * @returns {Validator} current object (flow)
             */
            this.setAttempts = function (a) {
                if (typeof a !== "number" || a <= 0)
                    throw new IllegalArgumentException("Amount of attempts should be a number greater then zero");
                attempts = a;
                return this;
            };

            /**
             * Adds an object to observe by the Validator.
             * @param o {jQuery} wrapped DOM element where to get value to check
             * @param v {Array|*} correct values of element's value. It can be an array of values or only one value;
             * @param multiple {Boolean} check it, if you want validator to explode your element's value and check separately
             * @returns {Validator} current object (flow)
             */
            this.addValidator = function (o, v, multiple) {
                if (!(o instanceof $))
                    throw new IllegalArgumentException('Object should be an instance of $');
                else if (o.length == 0)
                    throw new IllegalArgumentException('DOM Element ' + o.selector + " does't exists. Validator not added");
                if (!$.isArray(v)) {
                    v = v + '';
                    if (ignoreCase)
                        v = v.toLowerCase();
                    v = [v];
                } else if (ignoreCase)
                    for (var i in v)
                        v[i] = (v[i] + '').toLowerCase();
                targets.push([o, v, !!multiple]);
                return this;
            };

            /**
             * Method validates all Validator's observables.
             */
            this.validate = function () {
                LOGGER.debug("CHECKING VALIDATOR:", targets);
                if (isStrict)
                    LOGGER.debug("SCRIPT MODE VALIDATION");
                if (fulfilled === true)
                    throw new IllegalStateException('I ended up here. Stop clicking validate!');
                else if ($.isEmptyObject(targets))
                    throw new IllegalStateException('Targets are empty, nothing to check');
                else if (attempts <= 0)
                    throw new IllegalStateException('No attempts left. Go next level.');

                LOGGER.debug("----------- FOR LOOP ------------- ");
                var checkState = true,
                    invalidTargets = 0;
                for (var i = 0; i < targets.length; i++) {
                    var target = targets[i][0];

                    var currentValue = (target.val() ? target.val() : target.attr("value")) + '';
                    if (ignoreCase) currentValue = currentValue.toLowerCase();
                        currentValue = targets[i][2] ? currentValue.split(',') : [currentValue];
                    var correctValues = targets[i][1];
                    if (!currentValue && isStrict === false) {
                        checkState = false;
                        continue;
                    }
                    LOGGER.debug("# VALIDATING TARGET <" + target.selector + ">:", "Current value:", currentValue, "Correct values:", correctValues);
                    var isValid = true;
                    if (currentValue.length != correctValues.length)
                        isValid = false;
                    else {
                        for (var j = 0; j < currentValue.length; j++) {
                            if ($.inArray(currentValue[j], correctValues) == -1)
                                isValid = false;
                        }
                    }
                    LOGGER.error(target, target.prev());
                    if (isValid) {
                        LOGGER.debug('Target is good', target, 'target.val =' + currentValue, 'correctValues:', correctValues);
                        $('* [for="' + target.attr('name') + '"]').removeClass('has-error').addClass('has-success');
                    } else {
                        LOGGER.debug('Target is wrong', target, 'target.val =' + currentValue, 'correctValues:', correctValues);
                        $('* [for="' + target.attr('name') + '"]').removeClass('has-success').addClass('has-error');
                        invalidTargets++;
                        checkState = false;
                    }
                }
                LOGGER.debug("----------- FOR LOOP END ------------- ");
                if (checkState === true) {
                    _Rotator.enableNextButton();
                    _Scorer.addScore(_Rotator.getStepScore());
                    fulfilled = true;
                } else {
                    if (isStrict === true) {
                        attempts--;
                        LOGGER.debug("STRICT CHECK FAILED. ATTEMPTS LEFT: " + attempts);
                        if (attempts <= 0) {
                            LOGGER.debug("NO attempts left");
                            _Rotator.enableNextButton();
                            var stepScore = _Rotator.getStepScore();
                            var totalElements = targets.length;
                            var scoreOfOne = stepScore / totalElements;
                            var score = stepScore - scoreOfOne * invalidTargets;
                            _Scorer.addScore(score);
                            fulfilled = true;
                            return;
                        }
                    }
                    _Rotator.disableNextButton();
                }
                return checkState;
            };
        };
})(jQuery, Logger, Rotator, Scorer);