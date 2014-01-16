var Validator = null;

(function($, _Logger, _Rotator, _Scorer){
    Validator =
        function () {
            var LOGGER = new _Logger();

            var fulfilled = false;
            var targets = [];
            var values = [];

            var isStrict = false;
            var attempts = 3;

            this.setStictMode = function (b) {
                if (typeof b === "boolean")
                    isStrict = b;
                return this;
            }

            this.setAttempts = function (a) {
                if (typeof a === "numeric" && a > 0)
                    attempts = a;
                return this;
            }

            this.addValidator = function (o, v) {
                if (!(o instanceof $)) {
                    LOGGER.error('Object should be an instance of $');
                } else {
                    targets.push(o);
                    if (typeof v === "object") {
                        values.push(v);
                    } else {
                        values.push([v]);
                    }
                }
                return this;
            };

            this.validate = function () {
                LOGGER.debug("CHECKING VALIDATOR:", targets, values);
                if (isStrict)
                    LOGGER.debug("SCRICT MODE VALIDATION");
                if (fulfilled === true) {
                    LOGGER.info('I ended up here. Stop clicking validate!');
                    return;
                } else if ($.isEmptyObject(targets)) {
                    LOGGER.error('Targets are empty, nothing to check');
                    return;
                } else if (targets.length != values.length) {
                    LOGGER.error('Something goes wrong. targets.length != values.length !!!', targets, values);
                    return;
                } else if (attempts <= 0) {
                    LOGGER.error('No attempts left');
                    return;
                }

                LOGGER.debug("----------- FOR LOOP ------------- ");
                var checkState = true,
                    invalidTargets = 0;
                for (var i = 0; i < targets.length; i++) {
                    var target = targets[i];
                    var currentValue = target.val();
                    var correctValues = values[i];
                    if (!currentValue && isStrict === false)
                        continue;

                    LOGGER.debug("# NOW CHECKING:", target, "IT's val = " + currentValue, "SHOULD BE:" + correctValues);
                    var occurrence = false;
                    for (var j = 0; j < correctValues.length; j++) {
                        if (correctValues[j] == currentValue)
                            occurrence = true;
                    }
                    LOGGER.error(target, target.prev());
                    if (occurrence) {
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
                        LOGGER.debug("STRICT CHECK FAILDE. ATTEMPS LEFT: " + attempts);
                        if (attempts <= 0) {
                            LOGGER.debug("NO attemps left");
                            _Rotator.enableNextButton();
                            var stepScore = _Rotator.getStepScore();
                            var totalElements = targets.length;
                            var scoreOfOne = stepScore/totalElements;
                            var score = stepScore - scoreOfOne*invalidTargets;
                            _Scorer.addScore(score);
                            fulfilled = true;
                            return;
                        }
                    }
                    _Rotator.disableNextButton();
                }
                return checkState;
            }
        }
})(jQuery, Logger, Rotator, Scorer);