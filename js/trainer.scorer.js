var Scorer;

(function (_Logger) {
    Scorer = function () {
        var LOGGER = new _Logger();
        var score;

        var startTime;
        var endTime;
        var diffTime;

        this.start = function () {
            score = 0;
            startTime = new Date();
        }

        this.end = function () {
            endTime = new Date();
            diffTime = Math.round((endTime - startTime) / 1000);
        }

        this.addScore = function (s) {
            if (typeof s === "number")
                score += s;
        }

        this.getFormattedStartTime = function () {
            if (!startTime) {
                LOGGER.error("Start scorer first!");
                return false;
            } else {
                return startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds();
            }
        }

        this.getFormattedEndTime = function () {
            if (!startTime) {
                LOGGER.error("Finish scorer first!");
                return false;
            } else {
                return endTime.getHours() + ":" + endTime.getMinutes() + ":" + endTime.getSeconds();
            }
        }

        this.getTimeDifference = function () {
            if (!endTime) {
                LOGGER.error("Finish scorer first!");
                return false;
            } else {
                return diffTime;
            }
        }

        this.getScore = function () {
            if (!endTime) {
                LOGGER.error("Finish scorer first!");
                return false;
            } else {
                return score;
            }
        }
    }
})(Logger);

Scorer = new Scorer();