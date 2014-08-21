var results = function () {
    this.preDispatch = function () {
        Scorer.end();
    }

    this.postDispatch = function () {
        if (PRODUCTION)
            Service.pushResults();
    }

    this.mustache = function () {
        return {
            START_TIME: Scorer.getFormattedStartTime(),
            END_TIME: Scorer.getFormattedEndTime(),
            TIME_DIFF: Scorer.getTimeDifference(),
            SCORE: Scorer.getScore()
        }
    }
}