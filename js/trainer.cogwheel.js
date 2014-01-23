var Cogwheel = new
    (function () {
        var cogwheelElement;
        var cogwheelDescElement;

        /**
         * Sets a wrapped DOM element to show on loading
         * @param o {jQuery} wrapped element
         * @returns {Cogwheel} current object (flow)
         */
        this.setCogWheelElement = function (o) {
            if (!(o instanceof $))
                throw new IllegalArgumentException('CogWheel should be an instance of $');
            cogwheelElement = o;
            return this;
        };

        /**
         * Sets a wrapped DOM element where loading description situated
         * @param o {jQuery} wrapped element
         * @returns {Cogwheel} current object (flow)
         */
        this.setCogWheelDescElement = function (o) {
            if (!(o instanceof $))
                throw new IllegalArgumentException('CogWheel should be an instance of $');
            cogwheelDescElement = o;
            this.setText('Processing...');
            return this;
        };

        /**
         * Sets a loading description
         * @param s {String} description
         * @returns {Cogwheel} current object (flow)
         */
        this.setText = function (s) {
            if (!cogwheelDescElement)
                throw new IllegalStateException('Set description $ object first!');
            else if (typeof s !== "string")
                throw new IllegalArgumentException('Text should be a string');
            cogwheelDescElement.html(s);
            return this;
        };

        /**
         * Shows a loading splash
         * @returns {Cogwheel} current object (flow)
         */
        this.show = function () {
            if (!cogwheelElement)
                throw new IllegalStateException('Set cogwheel $ object first!');
            cogwheelElement.modal('show');
            return this;
        };

        /**
         * Hides a loading splash
         * @returns {Cogwheel} current object (flow)
         */
        this.hide = function () {
            if (!cogwheelElement)
                throw new IllegalStateException('Set cogwheel $ object first!');
            cogwheelElement.modal('hide');
            return this;
        };
    });