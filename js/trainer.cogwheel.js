var Cogwheel;

(function (_Logger) {
    /**
     * Cogwheel is a loading splash for trainer.
     * @instance
     */
    Cogwheel = new
        (function () {
            var LOGGER = new _Logger();

            var text = 'Processing...';
            var cogwheelElement;
            var cogwheelDescElement;

            /**
             * Sets a wrapped DOM element to show on loading
             * @param o {jQuery} wrapped element
             * @returns {Cogwheel} current object (flow)
             */
            this.setCogWheelElement = function (o) {
                if (!(o instanceof $)) {
                    LOGGER.error('CogWheel should be an instance of $');
                } else {
                    cogwheelElement = o;
                }
                return this;
            }

            /**
             * Sets a wrapped DOM element where loading description situated
             * @param o {jQuery} wrapped element
             * @returns {Cogwheel} current object (flow)
             */
            this.setCogWheelDescElement = function (o) {
                if (!(o instanceof $)) {
                    LOGGER.error('CogWheel Desc should be an instance of $');
                } else {
                    cogwheelDescElement = o;
                }
                return this;
            }

            /**
             * Sets a loading description
             * @param s {String} description
             * @returns {Cogwheel} current object (flow)
             */
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

            /**
             * Shows a loading splash
             * @returns {Cogwheel} current object (flow)
             */
            this.show = function () {
                if (!cogwheelElement) {
                    LOGGER.error('Set cogwheel $ object first!');
                } else {
                    cogwheelElement.modal('show');
                }
                return this;
            }

            /**
             * Hides a loading splash
             * @returns {Cogwheel} current object (flow)
             */
            this.hide = function () {
                if (!cogwheelElement) {
                    LOGGER.error('Set cogwheel $ object first!');
                } else {
                    cogwheelElement.modal('hide');
                }
                return this;
            }
        });
})(Logger);