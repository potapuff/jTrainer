var Scorer;

(function (_Logger) {
    /**
     * Class monitors points and time.
     * @constructor
     */
    Scorer = new
        (function () {
            var LOGGER = new _Logger();
            var score;

            var startTime;
            var endTime;
            var diffTime;

            /**
             * Starts monitoring
             */
            this.start = function () {
                score = 0;
                startTime = new Date();
            }

            /**
             * End monitoring
             */
            this.end = function () {
                endTime = new Date();
                diffTime = Math.round((endTime - startTime) / 1000);
            }

            /**
             * Adds points to user's global score
             * @param s {Number} amount of points
             */
            this.addScore = function (s) {
                if (typeof s === "number")
                    score += s;
            }

            /**
             * Gets a time when monitoring was started
             * @returns {String|false} formatted time string and false, if monitoring is not finished yet.
             */
            this.getFormattedStartTime = function () {
                if (!startTime) {
                    LOGGER.error("Start scorer first!");
                    return false;
                } else {
                    return startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds();
                }
            }

            /**
             * Gets a time when monitoring was ended
             * @returns {String|false} formatted time string and false, if monitoring is not finished yet.
             */
            this.getFormattedEndTime = function () {
                if (!startTime) {
                    LOGGER.error("Finish scorer first!");
                    return false;
                } else {
                    return endTime.getHours() + ":" + endTime.getMinutes() + ":" + endTime.getSeconds();
                }
            }

            /**
             * Gets time time difference between start and end of monitoring in seconds
             * @returns {Number|false} time diff in sec or false, if monitoring is not finished yet.
             */
            this.getTimeDifference = function () {
                if (!endTime) {
                    LOGGER.error("Finish scorer first!");
                    return false;
                } else {
                    return diffTime;
                }
            }

            /**
             * Gets a total score of user
             * @returns {Number|false} user's total score or false, if monitoring is not finished yet.
             */
            this.getScore = function () {
                if (!endTime) {
                    LOGGER.error("Finish scorer first!");
                    return false;
                } else {
                    return score;
                }
            }
        });
})(Logger);