var Select = null;
var CheckBox = null;
var TextInput = null;
var WolframAlpha = null;
var LateX = null;

(function($, _Logger, _Templatetor) {
    CheckBox =
        function (n) {
            var name = n;
            var attributes = '';
            var label, value;

            /**
             * Sets checkbox's name
             * @param nm {String} checkbox name
             * @returns {CheckBox} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm === "string")
                    name = nm;
                return this;
            }

            /**
             * Adds attribute to checkbox
             * @param n {String} attribute's name
             * @param v {String|Number} attribute's value
             * @returns {CheckBox} current object {flow)
             */
            this.addAttribute = function (n, v) {
                if (typeof n === "string")
                    attributes += ' ' +  n + '="' + v.toString() + '"';
                return this;
            }

            /**
             * Sets a label to CheckBox
             * @param l {String} label
             * @returns {CheckBox} current object {flow)
             */
            this.setLabel = function (l) {
                if (typeof l == "string")
                    label = l;
                return this;
            }

            /**
             * Sets a value of CheckBox
             * @param l {String|Number} CheckBox's value
             * @returns {CheckBox} current object {flow)
             */
            this.setValue = function (v) {
                if (typeof v == "string" || typeof v == "number")
                    value = v;
                return this;
            }

            /**
             * Renders a checkbox
             * @returns {String} rendered checkbox
             */
            this.render = function () {
                if (!name || !value)
                    throw new Error('Please check element\'s name and value.');
                var result = '<div class="form-group" for="' + name + '"><div class="checkbox">';
                result += '<label><input type="checkbox" ' + (attributes ? attributes : '') + ' name="' + name + '" value="' + value + '">' + (label ? label : '') + '</label></div>\n';
                if (_Templatetor.teplatable(result))
                    result = TEMPLATETOR.setTemplate(result).render();
                return result;
            }
    }
    /**
     * This class in a wrapper to html select tag.
     * @param n {String} select's name
     * @constructor
     */
    Select =
        function (n) {
            var TEMPLATETOR = new _Templatetor();

            var name = n;
            var style = '';
            var attributes = '';
            var defaultVal = '';

            var classes = ['form-control'];
            var options = [];

            /**
             * Sets select's name
             * @param nm {String} select name
             * @returns {Select} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm === "string")
                    name = nm;
                return this;
            }

            /**
             * Sets style for select
             * @param s {String} select's style
             * @returns {Select} current object {flow)
             */
            this.setStyle = function (s) {
                if (typeof s === "string")
                    style = s;
                return this;
            }

            /**
             * Sets default (selected) option of select
             * @param v {String|Number}
             * @returns {Select} current object {flow)
             */
            this.setDefaultValue = function (v) {
                if (typeof v === "number" || typeof v === "string")
                    defaultVal = v;
                return this;
            }

            /**
             * Adds class to select
             * @param c {String} class name to add
             * @returns {Select} current object {flow)
             */
            this.addClass = function (c) {
                if (typeof c === "string")
                    classes.push(c);
                return this;
            }

            /**
             * Adds attribute to select
             * @param n {String} attribute's name
             * @param v {String|Number} attribute's value
             * @returns {Select} current object {flow)
             */
            this.addAttribute = function (n, v) {
                if (typeof n === "string")
                    attributes += ' ' +  n + '="' + v.toString() + '"';
                return this;
            }

            /**
             * Removes class of select
             * @param c {String} class name to remove
             * @returns {Select} current object {flow)
             */
            this.removeClass = function (c) {
                delete classes[c];
                return this;
            }

            /**
             * Adds an option tag to select
             * @param text {String} text of option
             * @param value {String} value of option
             * @returns {Select} current object {flow)
             */
            this.addOption = function (text, value) {
                options[text] = value;
                return this;
            }

            /**
             * Makes select disabled
             * @param b {Boolean} isActive switch
             * @returns {Select} current object {flow)
             */
            this.disabled = function (b) {
                if (b === true)
                    this.addClass('disabled')
                else if (b === false)
                    this.removeClass('disabled');
                return this;
            }

            /**
             * Renders a text select
             * @returns {String} rendered select
             */
            this.render = function () {
                if (!name || Object.keys(options).length == 0)
                    throw new Error('Please check element\'s name, values and default value');
                var result = '<div class="form-group" for="' + name + '"><select' + (attributes ? attributes : '') + ' name="' + name + '" class="' + classes.join(' ') + '"' + (style != '' ? (' style="' + style + '"') : '') +'><option value="-1" disabled="disabled">{{CHOOSE_SELECT}}</option>';
                for (var key in options){
                    if (options.hasOwnProperty(key)) {
                        result += '<option value="' + options[key] + '"' + (defaultVal == options[key] ? ' selected="selected"' : '') + '>' + key + '</option>\n';
                    }
                }
                result += '</select></div>\n';
                if (_Templatetor.teplatable(result))
                    result = TEMPLATETOR.setTemplate(result).render();
                return result;
            }
        }

    /**
     * This class in a wrapper to html text input.
     * @param n {String} input's name
     * @constructor
     */
    TextInput =
        function (n) {
            var TEMPLATOR = new _Templatetor();

            var name = n;
            var style = '';
            var attributes = '';
            var classes = ['form-control'];
            var placeholder = '{{ENTER_TEXT}}';

            /**
             * Sets input's name
             * @param nm {String} input name
             * @returns {TextInput} current object {flow)
             */
            this.setName = function (nm) {
                if (typeof nm === "string")
                    name = nm;
                return this;
            }

            /**
             * Sets style for input
             * @param s {String} input's style
             * @returns {TextInput} current object {flow)
             */
            this.setStyle = function (s) {
                if (typeof s === "string")
                    style = s;
                return this;
            }

            /**
             * Adds class to input
             * @param c {String} class name to add
             * @returns {TextInput} current object {flow)
             */
            this.addClass = function (c) {
                if (typeof c === "string")
                    classes.push(c);
                return this;
            }

            /**
             * Removes class of input
             * @param c {String} class name to remove
             * @returns {TextInput} current object {flow)
             */
            this.removeClass = function (c) {
                delete classes[c];
                return this;
            }

            /**
             * Adds attribute to text input
             * @param n {String} attribute's name
             * @param v {String|Number} attribute's value
             * @returns {TextInput} current object {flow)
             */
            this.addAttribute = function (n, v) {
                if (typeof n === "string")
                    attributes += ' ' +  n + '="' + v.toString() + '"';
                return this;
            }

            /**
             * Sets placeholder text
             * @param text {String} placeholder text
             * @returns {TextInput} current object {flow)
             */
            this.placeholder = function (text) {
                if (typeof text === "string")
                    placeholder = text;
                return this;
            }

            /**
             * Makes input disabled
             * @param b {Boolean} isActive switch
             * @returns {TextInput} current object {flow)
             */
            this.disabled = function (b) {
                if (b === true)
                    this.addClass('disabled')
                else if (b === false)
                    this.removeClass('disabled');
                return this;
            }

            /**
             * Renders a text input
             * @returns {String} rendered text input
             */
            this.render = function () {
                if (!name)
                    throw new Error('Please check element\'s name. It\'s empty.');
                var result = '<div class="form-group" for="' + name + '"><input' + (attributes ? attributes : '') + ' type="text" name="' + name + '" class="' + classes.join(' ') + '"' + (style != '' ? (' style="' + style + '"') : '') +' placeholder="' + placeholder + '"></div>';
                if (_Templatetor.teplatable(result))
                    result = TEMPLATOR.setTemplate(result).render();
                return result;
            }
        }

    /**
     * This class is a wrapper to WolframAlpha API.
     * @constructor
     */
    WolframAlpha =
        function () {
            var LOGGER = new _Logger();
            var query;

            /**
             * Performs a query with WolframAlpha API through SumDU server
             * @param callback {function} callback to call after loading
             */
            this.doQuery = function (callback) {
                $.ajax({
                    url: "http://dl.sumdu.edu.ua/api/v1/content/alpha",
                    data: {input: query},
                    dataType: "jsonp",
                    success: function(json) {
                        var xml = $.parseXML(json.result);
                        if (typeof callback === "function")
                            callback(xml);
                    }
                });
            }

            /**
             * Sets a query to perform
             * @param q {String} query sting
             * @returns {WolframAlpha} current object (flow)
             */
            this.setQuery = function (q) {
                if (typeof q === "string") {
                    query = q;
                } else {
                    LOGGER.error('Query should be a string');
                }
                return this;
            }

            /**
             * Checks if query was specified
             * @returns {boolean} true if query is specified, otherwise - false
             */
            var hasQuery = function () {
                return !!query;
            }

            /**
             * This method src to plot image, drawn by WolframAlpha
             * @param callback {function} callback to call after receiving img src
             */
            this.plot = function (callback) {
                if (hasQuery() && typeof callback === "function") {
                    query = 'plot ' + query;
                    this.doQuery(function(data) {
                        var src = $(data).find("#Plot subpod:first img").attr("src");
                        callback(src);
                    });
                }
            }

        }

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
                if (typeof f === "string")
                    formula = f;
                return this;
            }

            /**
             * Renders LateX formula
             * @returns {img} rendered formula as an img tag
             */
            this.render = function () {
                if (!formula)
                    throw new Error('Set formula first!');
                return '<img class="latex" src="http://latex.codecogs.com/svg.latex?' + formula + '" border="0"/>';
            }
        };
})(jQuery, Logger, Templatetor);