var HashMap;

(function ($) {
    HashMap = function () {
        var db = [];

        var getIndexOfKey = function (key) {
            for (var i = 0; i < db.length; i++) {
                if (db[i][0] == key)
                    return i;
            }
            return -1;
        }

        this.add = function (key, value) {
            var index = getIndexOfKey(key);
            if (index === -1)
                db.push([key, value]);
            else
                db[index][1] = value;
            return this;
        }

        this.get = function (key) {
            for (var i = 0; i < db.length; i++) {
                if (db[i][0] == key)
                    return db[i][1];
            }
            return null;
        }

        this.size = function () {
            return db.length;
        }

        this.keys = function () {
            if (db.length === 0)
                return [];
            var result = [];
            for (var i = 0; i < db.length; i++) {
                result.push(db[i][0]);
            }
            return result;
        }

        this.values = function () {
            if (db.length === 0)
                return [];
            var result = [];
            for (var i = 0; i < db.length; i++) {
                result.push(db[i][1]);
            }
            return result;
        }

        this.randomize = function () {
            if (db.length === 0)
                return this;
            var currentIndex = db.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                temporaryValue = db[currentIndex];
                db[currentIndex] = db[randomIndex];
                db[randomIndex] = temporaryValue;
            }
            return this;
        }

        this.iterate = function (callback) {
            if (db.length === 0)
                return false;
            for (var i = 0; i < db.length; i++) {
                callback(db[i][0], db[i][1]);
            }
            return true;
        }

        this.slice = function (start, end) {
            if (start >= db.length || end >= db.length)
                throw new Error('Start and end positions should be < that hashMap\'s size');
            var result = new HashMap();
            for (var i = start; i <= end; i++) {
                result.add(db[i][0], db[i][1]);
            }
            return result;
        }

        this.merge = function (hm) {
            if (hm instanceof HashMap) {
                var self = this;
                hm.iterate(function (key, value) {
                    self.add(key, value);
                });
            }
            return this;
        }
    }
})(jQuery);