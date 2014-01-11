var Cogwheel;

(function (_Logger) {
    Cogwheel = function () {
        var LOGGER = new _Logger();

        var text = 'Processing...';
        var cogwheelElement;
        var cogwheelDescElement;

        this.setCogWheelElement = function (o) {
            if (!(o instanceof $)) {
                LOGGER.error('CogWheel should be an instance of $');
            } else {
                cogwheelElement = o;
            }
            return this;
        }

        this.setCogWheelDescElement = function (o) {
            if (!(o instanceof $)) {
                LOGGER.error('CogWheel Desc should be an instance of $');
            } else {
                cogwheelDescElement = o;
            }
            return this;
        }

        this.setText = function (s) {
            if (!cogwheelDescElement) {
                LOGGER.error('Set description $ object first!');
            } else {
                if (typeof s === "string") {
                    cogwheelDescElement.html(s);
                }
            }
            return this;
        }

        this.show = function () {
            if (!cogwheelElement) {
                LOGGER.error('Set cogwheel $ object first!');
            } else {
                cogwheelElement.modal('show');
            }
            return this;
        }

        this.hide = function () {
            if (!cogwheelElement) {
                LOGGER.error('Set cogwheel $ object first!');
            } else {
                cogwheelElement.modal('hide');
            }
            return this;
        }

    }
})(Logger);

Cogwheel = new Cogwheel();