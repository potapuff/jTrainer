var Map = function () {
    var db = [];

    /**
     * Returns index of elements pair in Map
     * @param k {*} key to find
     * @returns {Number} index of elements pair if exists, otherwise -1
     */
    var getIndexOfKey = function (k) {
        for (var i = 0; i < db.length; i++) {
            if (db[i][0] == k)
                return i;
        }
        return -1;
    };

    /**
     * Adds key-value pair in map
     * @param k {*} a pair's key
     * @param v {*} a pair's value
     * @returns {Map} current object (flow)
     */
    this.add = function (k, v) {
        var index = getIndexOfKey(k);
        if (index === -1)
            db.push([k, v]);
        else
            db[index][1] = v;
        return this;
    };

    /**
     * Getss a value pair in map by key
     * @param k {*} a pair's key
     * @returns {*} value if exists, otherwise null
     */
    this.get = function (k) {
        for (var i = 0; i < db.length; i++) {
            if (db[i][0] == k)
                return db[i][1];
        }
        return null;
    };

    /**
     * Returns a size of map
     * @returns {Number} amount of elements
     */
    this.size = function () {
        return db.length;
    };

    /**
     * Returns all keys from this map
     * @returns {Array} keys of map
     * @override
     */
    this.keys = function () {
        if (db.length === 0)
            return [];
        var result = [];
        for (var i = 0; i < db.length; i++) {
            result.push(db[i][0]);
        }
        return result;
    };

    /**
     * Returns all values from this map
     * @returns {Array} values of map
     */
    this.values = function () {
        if (db.length === 0)
            return [];
        var result = [];
        for (var i = 0; i < db.length; i++) {
            result.push(db[i][1]);
        }
        return result;
    };

    /**
     * Ramdomize map's elements
     * @returns {Map} randomized map
     */
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
    };

    /**
     * Map's iterator. For each map's key-value pair calls callback
     * with (key, value) params
     * @param callback {function} funct to call
     * @returns {boolean} true, if there are elements in map, otherwise false
     */
    this.iterate = function (callback) {
        if (db.length === 0)
            return false;
        for (var i = 0; i < db.length; i++) {
            callback(db[i][0], db[i][1]);
        }
        return true;
    };

    /**
     * Create a sliced copy of this map
     * @param start {number} first element position
     * @param end {number} last element position
     * @returns {Map} new sliced map
     */
    this.slice = function (start, end) {
        if (start >= db.length || end >= db.length)
            throw new IllegalArgumentException('Start and end positions should be < that hashMap\'s size');
        var result = new Map();
        for (var i = start; i <= end; i++) {
            result.add(db[i][0], db[i][1]);
        }
        return result;
    };

    /**
     * Merge another map's key-value pairs with this one
     * @param m {Map} map to merge
     * @returns {Map} current object (flow)
     */
    this.merge = function (m) {
        if (m instanceof Map) {
            var self = this;
            m.iterate(function (key, value) {
                self.add(key, value);
            });
        }
        return this;
    };
};