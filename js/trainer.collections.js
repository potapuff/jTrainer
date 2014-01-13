var HashMap;

(function ($) {
    HashMap = function (TKey, TValue) {
        var db = [];
        var keyType, valueType;
        var allowedTypes = ["object", "number", "string", "function"];

        (function() {
            if ($.inArray(TKey, allowedTypes) < 0) {
                throw new Error('Key should have one of this types ' + allowedTypes.join(', '));
            } else if ($.inArray(TValue, allowedTypes) < 0) {
                throw new Error('Value should have one of this types ' + allowedTypes.join(', '));
            }
            keyType = TKey;
            valueType = TValue;
        })();

        var getIndexOfKey = function (key) {
            if (typeof key !== keyType)
                throw new Error('Type of key should be ' + keyType);
            for (var i = 0; i < db.length; i++) {
                if (db[i][0] == key)
                    return i;
            }
            return -1;
        }

        this.add = function (key, value) {
            if (typeof key !== keyType) {
                throw new Error('Type of key should be ' + keyType);
            } else if (typeof value !== valueType) {
                throw new Error('Type of value should be ' + valueType);
            }
            var index = getIndexOfKey(key);
            if (index === -1)
                db.push([key, value]);
            else
                db[index][1] = value;
            return this;
        }

        this.get = function (key) {
            if (typeof key !== keyType || db.length === 0)
                return null;
            for (var i = 0; i < db.length; i++) {
                if (db[i][0] == key)
                    return db[i][1];
            }
            return null;
        }

        this.size = function() {
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
                return false;
            var currentIndex = db.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                temporaryValue = db[currentIndex];
                db[currentIndex] = db[randomIndex];
                db[randomIndex] = temporaryValue;
            }
            return true;
        }

        this.iterate = function (callback) {
            if (db.length === 0)
                return false;
            for (var i = 0; i < db.length; i++) {
                callback(db[i][0], db[i][1]);
            }
            return true;
        }
    }
})(jQuery);