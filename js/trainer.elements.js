var Select = null;
var CheckBox = null;
var Radio = null;
var Radios = null;
var TextInput = null;
var WolframAlpha = null;
var LateX = null;

(function ($, _Templatetor) {
    Radio = function (n) {
        var name = n;
        var label, value, checked = false;

        /**
         * Sets element's name
         * @param nm {String} name of the element
         * @returns {Radio} current object {flow)
             */
        this.setName = function (nm) {
            if (typeof nm !== "string")
                throw new IllegalArgumentException("Name should be a string");
            name = nm;
            return this;
        };

        /**
         * Sets a label of element
         * @param l {String} label of element
         * @returns {Radio} current object {flow)
             */
        this.setLabel = function (l) {
            if (typeof l !== "string")
                throw new IllegalArgumentException("Label should be a string");
            label = l;
            return this;
        };

        /**
         * Sets a value of element
         * @param v {String|Number} element's value
         * @returns {Radio} current object {flow)
             */
        this.setValue = function (v) {
            if (typeof v !== "string" && typeof v !== "number")
                throw new IllegalArgumentException("Value should be a string or number");
            value = v;
            return this;
        };

        /**
         * Makes radio checked
         * @param b {Boolean} isChecked switch
         * @returns {Radio} current object {flow)
         */
        this.checked = function (b) {
            if (typeof b !== "boolean")
                throw new IllegalArgumentException("Checked state should be a bool value");
            checked = b;
            return this;
        };

        /**
         * Renders the element
         * @returns {String} rendered element
         */
        this.render = function () {
            if (!name || !value)
                throw new NoArgumentException('Check name and value of element');
            var result = '<div class="radio">\n';
            result += '<label>\n';
            result += '<input type="radio" name="' + name + '" value="' + value + '" ' + (checked === true ? 'checked="checked"' : '') + '>\n';
            result += label;
            result += '</label>\n';
            result += '</div>\n';
            return result;
        };
    };

    Radios =
        function (n) {
            var name = n;
            var options = [];

            /**
             * Sets element's name
             * @param nm {String} name of the element
             * @returns {Radios} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm !== "string")
                    throw new IllegalArgumentException("Name should be a string");
                name = nm;
                return this;
            };

            /**
             * Adds a radio to radio-group
             * @param label {String} text of option
             * @param value {String} value of option
             * @param checked {Boolean} if this radio checked
             * @returns {Radios} current object {flow)
             */
            this.addRadio = function (label, value, checked) {
                if (typeof value !== "string" && typeof value !== "number")
                    throw new IllegalArgumentException('Value should be a number of string');
                var radio = new Radio(name).setValue(value).checked(!!checked);
                if (label)
                    radio.setLabel(label);
                options.push(radio);
                return this;
            };

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (options.length == 0)
                    throw new NoArgumentException('Nothing to render. Please add at least one radio.');
                var result = '<div class="form-group" for="' + name + '">\n';
                for (var i = 0; i < options.length; i++)
                    result += options[i].render();
                result += '</div>\n';
                return result;
            };
        };

    CheckBox =
        function (n) {
            var name = n;
            var attributes = '';
            var label, value;

            /**
             * Sets element's name
             * @param nm {String} checkbox name
             * @returns {CheckBox} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm !== "string")
                    throw new IllegalArgumentException("Name should be a string");
                name = nm;
                return this;
            };

            /**
             * Adds attribute to checkbox
             * @param n {String} attribute's name
             * @param v {String|Number} attribute's value
             * @returns {CheckBox} current object {flow)
             */
            this.addAttribute = function (n, v) {
                if (typeof n !== "string")
                    throw new IllegalArgumentException("Attribute's name should be a string");
                else if (typeof v !== "string" && typeof v !== "number")
                    throw new IllegalArgumentException("Value of attribute should be a string or number");
                attributes += ' ' + n + '="' + v.toString() + '"';
                return this;
            };

            /**
             * Sets a label of element
             * @param l {String} label of element
             * @returns {CheckBox} current object {flow)
             */
            this.setLabel = function (l) {
                if (typeof l !== "string")
                    throw new IllegalArgumentException("Label should be a string");
                label = l;
                return this;
            };

            /**
             * Sets a value of element
             * @param v {String|Number} element's value
             * @returns {CheckBox} current object {flow)
             */
            this.setValue = function (v) {
                if (typeof v !== "string" && typeof v !== "number")
                    throw new IllegalArgumentException("Value should be a string or number");
                value = v;
                return this;
            };

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (!name || !value)
                    throw new NoArgumentException('Please check element\'s name and value.');
                var result = '<div class="form-group" for="' + name + '">\n';
                result += '<div class="checkbox">\n';
                result += '<label>\n';
                result += '<input type="checkbox" ' + (attributes ? attributes : '') + ' name="' + name + '" value="' + value + '">' + (label ? label : '') + '\n';
                result += '</label>\n';
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                return result;
            };
        };
    /**
     * This class in a wrapper to html select tag.
     * @param n {String} select's name
     * @constructor
     */
    Select =
        function (n) {
            var name = n;
            var attributes = '';

            var classes = ['form-control'];
            var options = [];

            /**
             * Sets element's name
             * @param nm {String} select name
             * @returns {Select} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm !== "string")
                    throw new IllegalArgumentException("Name should be a string");
                name = nm;
                return this;
            };

            /**
             * Adds class to element
             * @param c {String} class name to add
             * @returns {Select} current object {flow)
             */
            this.addClass = function (c) {
                if (typeof c !== "string")
                    throw new IllegalArgumentException("Class should be a string");
                classes.push(c);
                return this;
            };

            /**
             * Removes class of element
             * @param c {String} class name to remove
             * @returns {Select} current object {flow)
             */
            this.removeClass = function (c) {
                delete classes[c];
                classes.length--;
                return this;
            };

            /**
             * Adds attribute to element
             * @param n {String} attribute's name
             * @param v {String|Number} attribute's value
             * @returns {Select} current object {flow)
             */
            this.addAttribute = function (n, v) {
                if (typeof n !== "string")
                    throw new IllegalArgumentException("Attribute should be a string");
                attributes += ' ' + n + '="' + v.toString() + '"';
                return this;
            };

            /**
             * Adds an option tag to element
             * @param label {String} text of element
             * @param value {String} value of element
             * @param checked {Boolean} is this option checked
             * @returns {Select} current object {flow)
             */
            this.addOption = function (label, value, checked) {
                if (typeof value !== "string" && typeof value !== "number")
                    throw new IllegalArgumentException('Value should be a number of string');
                options.push([label, value, !!checked]);
                return this;
            };

            /**
             * Makes element disabled
             * @param b {Boolean} isActive switch
             * @returns {Select} current object {flow)
             */
            this.disabled = function (b) {
                if (typeof b !== "boolean")
                    throw new IllegalArgumentException("Switch should be boolean");
                b === true ? this.addClass('disabled') : this.removeClass('disabled');
                return this;
            };

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (!name || Object.keys(options).length == 0)
                    throw new Error('Please check element\'s name, values and default value');

                var result = '<div class="form-group" for="' + name + '">\n';
                result += '<select' + (attributes ? attributes : '') + ' name="' + name + '" class="' + classes.join(' ') + '">\n';
                result += '<option value="-1" disabled="disabled">{{CHOOSE_SELECT}}</option>\n';

                for (var i = 0; i < options.length; i++)
                    result += '<option value="' + options[i][1] + '"' + (options[i][2] === true ? ' selected="selected"' : '') + '>' + options[i][0] + '</option>\n';

                result += '</select>\n';
                result += '</div>\n';

                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                return result;
            };
        };

    /**
     * This class in a wrapper to html text input.
     * @param n {String} input's name
     * @constructor
     */
    TextInput =
        function (n) {
            var name = n;
            var attributes = '';
            var classes = ['form-control'];
            var placeholder = '{{ENTER_TEXT}}';

            /**
             * Sets element's name
             * @param nm {String} input name
             * @returns {TextInput} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm !== "string")
                    throw new IllegalArgumentException("Name should be a string");
                name = nm;
                return this;
            };

            /**
             * Adds class to element
             * @param c {TextInput} class name to add
             * @returns {TextInput} current object {flow)
             */
            this.addClass = function (c) {
                if (typeof c !== "string")
                    throw new IllegalArgumentException("Class should be a string");
                classes.push(c);
                return this;
            };

            /**
             * Removes class of element
             * @param c {TextInput} class name to remove
             * @returns {TextInput} current object {flow)
             */
            this.removeClass = function (c) {
                delete classes[c];
                classes.length--;
                return this;
            };

            /**
             * Adds attribute to element
             * @param n {String} attribute's name
             * @param v {String|Number} attribute's value
             * @returns {TextInput} current object {flow)
             */
            this.addAttribute = function (n, v) {
                if (typeof n !== "string")
                    throw new IllegalArgumentException("Attribute should be a string");
                attributes += ' ' + n + '="' + v.toString() + '"';
                return this;
            };

            /**
             * Sets placeholder text
             * @param text {String} placeholder text
             * @returns {TextInput} current object {flow)
             */
            this.placeholder = function (text) {
                if (typeof text !== "string")
                    throw new IllegalArgumentException("Placeholder should be a string");
                placeholder = text;
                return this;
            };

            /**
             * Makes element disabled
             * @param b {Boolean} isActive switch
             * @returns {TextInput} current object {flow)
             */
            this.disabled = function (b) {
                if (typeof b !== "boolean")
                    throw new IllegalArgumentException("Switch should be boolean");
                b === true ? this.addClass('disabled') : this.removeClass('disabled');
                return this;
            };

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (!name)
                    throw new Error('Please check element\'s name. It\'s empty.');
                var result = '<div class="form-group" for="' + name + '">\n';
                result += '<input' + (attributes ? attributes : '') + ' type="text" name="' + name + '" class="' + classes.join(' ') + '" placeholder="' + placeholder + '">\n';
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                return result;
            };
        };

    /**
     * This class is a wrapper to WolframAlpha API.
     * @constructor
     */
    WolframAlpha =
        function () {
            var query;

            /**
             * Performs a query with WolframAlpha API through SumDU server
             * @param callback {function} callback to call after loading
             */
            this.doQuery = function (callback) {
                $.ajax({url: "http://dl.sumdu.edu.ua/api/v1/content/alpha", data: {input: query}, dataType: "jsonp"})
                    .done(function (json) {
                        var xml = $.parseXML(json.result);
                        if (typeof callback === "function")
                            callback(xml);
                    }).fail(function (jqxhr, settings, exception) {
                        throw new IllegalAsyncStateException(exception);
                    });
            };

            /**
             * Sets a query to perform
             * @param q {String} query sting
             * @returns {WolframAlpha} current object (flow)
             */
            this.setQuery = function (q) {
                if (typeof q !== "string")
                    throw new IllegalArgumentException("Query should be a string");
                query = q;
                return this;
            };

            /**
             * Checks if query was specified
             * @returns {boolean} true if query is specified, otherwise - false
             */
            var hasQuery = function () {
                return !!query;
            };

            /**
             * This method src to plot image, drawn by WolframAlpha
             * @param callback {function} callback to call after receiving img src
             */
            this.plot = function (callback) {
                if (hasQuery() && typeof callback === "function") {
                    query = 'plot ' + query;
                    this.doQuery(function (data) {
                        var src = $(data).find("#Plot subpod:first img").attr("src");
                        callback(src);
                    });
                }
            };
        };

    /**
     * Class for rendering LateX formulas
     * @constructor
     */
    var LateX =
        function () {
            var formula;

            /**
             * Sets a LateX text to render
             * @param f {String} LateX formtted string
             * @returns {LateX} current object (flow)
             */
            this.setFormula = function (f) {
                if (typeof f !== "string")
                    throw new IllegalArgumentException("LateX formula should be a string");
                formula = f;
                return this;
            };

            /**
             * Renders LateX formula
             * @returns {String} rendered formula as an img tag
             */
            this.render = function () {
                if (!formula)
                    throw new NoArgumentException('Set formula first!');
                return '<img class="latex" src="http://latex.codecogs.com/svg.latex?' + formula + '" border="0"/>';
            };
        };
})(jQuery, Templatetor);