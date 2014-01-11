var Validator = null;

(function($, _Logger, _Rotator){
    Validator =
        function () {
            var LOGGER = new _Logger();
            var parentStep;

            var targets = [];
            var values = [];
            var checkState = false;
            var notify = true;

            this.setParentStep = function (s) {
                parentStep = s;
                return this;
            }

            this.notifyRotator = function (b) {
                if (typeof b === "boolean")
                    notify = b;
                return notify;
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
                if ($.isEmptyObject(targets)) {
                    LOGGER.info('Targets are empty, nothing to check');
                    return;
                } else if (targets.length != values.length) {
                    LOGGER.error('Something goes wrong. targets.length != values.length !!!', targets, values);
                    return;
                }

                var checkState = true;
                LOGGER.debug("----------- FOR LOOP ------------- ");
                for (var i = 0; i < targets.length; i++) {
                    var target = targets[i];
                    var currentValue = target.val();
                    var correctValues = values[i];
                    LOGGER.debug("# NOW CHECKING:", target, "IT's val = " + currentValue, "SHOULD BE:" + correctValues);
                    var occurence = false;
                    for (var j = 0; j < correctValues.length; j++) {
                        if (correctValues[j] == currentValue)
                            occurence = true;
                    }
                    LOGGER.error(target, target.prev());
                    if (occurence) {
                        LOGGER.debug('Target is good', target, 'target.val =' + currentValue, 'correctValues:', correctValues);
                        $('* [for="' + target.attr('name') + '"]').removeClass('has-error').addClass('has-success');
                    } else {
                        LOGGER.debug('Target is wrong', target, 'target.val =' + currentValue, 'correctValues:', correctValues);
                        checkState = false;
                        $('* [for="' + target.attr('name') + '"]').removeClass('has-success').addClass('has-error');
                    }
                    LOGGER.info("---targets.length in END=" + targets.length);
                }
                LOGGER.debug("----------- FOR LOOP END ------------- ");
                if (notify === true) {
                    _Rotator.notify(parentStep, checkState);
                }
                return currentValue;
            }
        }
})(jQuery, Logger, Rotator);