var Scorer = new
    (function () {
        var score;

        var startTime;
        var endTime;
        var diffTime;
        var totalScore;

        /**
         * Starts monitoring
         */
        this.start = function () {
            score = 0;
            startTime = new Date();
        };

        /**
         * End monitoring
         */
        this.end = function () {
            endTime = new Date();
            diffTime = Math.round((endTime - startTime) / 1000);
        };

        /**
         * Adds points to user's global score
         * @param s {Number} amount of points
         */
        this.addScore = function (s) {
            if (typeof s !== "number")
                throw new IllegalStateException("Start scorer first!");
            else if (s > totalScore)
                throw new IllegalStateException("Illegal adding");
            score += s;
        };

        /**
         * Gets a time when monitoring was started
         * @returns {String} formatted time string and false, if monitoring is not finished yet.
         */
        this.getFormattedStartTime = function () {
            if (!startTime)
                throw new IllegalStateException("Start scorer first!");
            return startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds();
        };

        /**
         * Gets a time when monitoring was ended
         * @returns {String} formatted time string and false, if monitoring is not finished yet.
         */
        this.getFormattedEndTime = function () {
            if (!startTime)
                throw new IllegalStateException("Finish scorer first!");
            return endTime.getHours() + ":" + endTime.getMinutes() + ":" + endTime.getSeconds();
        };

        /**
         * Gets time time difference between start and end of monitoring in seconds
         * @returns {Number} time diff in sec or false, if monitoring is not finished yet.
         */
        this.getTimeDifference = function () {
            if (!endTime)
                throw new IllegalStateException("Finish scorer first!");
            return diffTime;
        };

        /**
         * Gets a total score of user
         * @returns {Number} user's total score or false, if monitoring is not finished yet.
         */
        this.getScore = function () {
            if (!endTime)
                throw new IllegalStateException("Finish scorer first!");
            return score;
        };

        /**
         * Gets a trainer's score
         * @returns {Number} user's total score or false, if monitoring is not finished yet.
         */
        this.getTotalScore = function () {
            if (!endTime)
                throw new IllegalStateException("Finish scorer first!");
            return totalScore;
        };

        /**
         * Sets total score of the trainer
         * @param s {Number} amount of points
         */
        this.setTotalScore = function (s) {
            if (typeof s !== "number")
                throw new IllegalArgumentException("Score should be a number");
            totalScore = s;
        }
    });