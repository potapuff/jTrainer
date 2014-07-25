function Element() {
    this.name,
        this.label,
        this.value,
        this.attributes = '',
        this.classes = ['form-control'],
        this.id,
        this.style;

    /**
     * Sets element's name
     * @param nm {String} name of the element
     * @returns {Element} current object {flow)
    */
    this.setName = function (nm) {
        if (typeof nm !== "string")
            throw new IllegalArgumentException("Name should be a string");
        this.name = nm;
        return this;
    };

    /**
     * Gets element's name
     * @returns {String} name of the element
     */
    this.getName = function () {
        return this.name;
    };

    /**
     * Sets a label of element
     * @param l {String} label of element
     * @returns {Element} current object {flow)
    */
    this.setLabel = function (l) {
        if (typeof l !== "string")
            throw new IllegalArgumentException("Label should be a string");
        this.label = l;
        return this;
    };

    /**
     * Gets a label of element
     * @returns {String} label of element
     */
    this.getLabel = function () {
        return this.label;
    };

    /**
     * Sets a value of element
     * @param v {String|Number} element's value
     * @returns {Element} current object {flow)
    */
    this.setValue = function (v) {
        if (typeof v !== "string" && typeof v !== "number")
            throw new IllegalArgumentException("Value should be a string or number");
        this.value = v;
        return this;
    };

    /**
     * Gets a value of element
     * @returns {String} element's value
     */
    this.getValue = function () {
        return this.value;
    };

    /**
     * Sets #id to element
     * @param id id tag's value
     * @returns {Element} current object {flow)
     */
    this.setId = function (id) {
        this.id = id + '';
        return this;
    };

    /**
     * Gets element's style
     * @returns {string}
     */
    this.getStyle = function () {
        return this.style;
    };

    /**
     * Sets element's style
     * @param st element's style
     * @returns {Element} current object {flow)
     */
    this.setStyle = function (st) {
        this.style = st + '';
        return this;
    };

    /**
     * Gets element's id
     * @returns {string}
     */
    this.getId = function () {
        return this.id;
    };

    /**
     * Returns all params of elements in one string
     * @returns {string} string of params
     */
    this.getParams = function () {
        return ' ' + (this.getName() ? 'name="' + this.getName() + '" ' : '') +
            (this.getId() ? 'id="' + this.getId() + '" ' : '') +
            (this.getAttributes() ? this.getAttributes() + " " : '') +
            (this.getClasses().length > 0 ? 'class="' + this.getClasses().join(' ') + '"' : '') +
            (this.getStyle() ? 'style="' + this.getStyle() + '" ' : '') + ' ';

    }
    /**
     * Renders the element
     * SHOULD BE OVERRIDDEN
     * @returns {String} rendered element
     */
    this.render = function () {
        if (!this.getName() || !this.getValue())
            throw new NoArgumentException('Check name and value of element');
        return '<element><!-- Here should your element goes --></element>';
    };

    /**
     * Adds attribute to element
     * @param n {String} attribute's name
     * @param v {String|Number} attribute's value
     * @returns {Element} current object {flow)
    */
    this.addAttribute = function (n, v) {
        if (typeof n !== "string")
            throw new IllegalArgumentException("Attribute's name should be a string");
        else if (typeof v !== "string" && typeof v !== "number")
            throw new IllegalArgumentException("Value of attribute should be a string or number");
        this.attributes += ' ' + n + '="' + v.toString() + '"';
        return this;
    };

    /**
     * Gets attributes of element
     * @returns {String} of attribute=value pairs
     */
    this.getAttributes = function () {
        return this.attributes;
    };

    /**
     * Adds class to element
     * @param c {String} class name to add
     * @returns {Element} current object {flow)
    */
    this.addClass = function (c) {
        if (typeof c !== "string")
            throw new IllegalArgumentException("Class should be a string");
        this.classes.push(c);
        return this;
    };

    /**
     * Gets classes of element
     * @returns {String} of classes
     */
    this.getClasses = function () {
        return this.classes;
    };

    /**
     * Removes class of element
     * @param c {String} class name to remove
     * @returns {Element} current object {flow)
    */
    this.removeClass = function (c) {
        this.classes = $.grep(this.classes, function(value) {
            return value != c;
        });
        return this;
    };

    /**
     * Clears all classes of element
     * @returns {Element} current object {flow)
     */
    this.clearClasses = function () {
        this.classes = [];
        return this;
    }
}

var Select = null;
var CheckBox = null;
var Radio = null;
var Radios = null;
var TextInput = null;
var TextArea = null;

var DraggableGroup = null;
var DroppableArea = null;

var WolframAlpha = null;
var LateX = null;

(function ($, _Templatetor, _StepInvoker) {
    Radio = function (n) {
        if (typeof n === "string")
            this.setName(n);
        var checked = false;

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
            if (!this.getName() || !this.getValue())
                throw new NoArgumentException('Check name and value of element');
            var result = '<div class="radio" for="' + this.getName() + '">\n';
            result += '<label>\n';
            result += '<input type="radio"' + this.getParams() + 'value="' + this.getValue() + '" ' + (checked === true ? 'checked="checked"' : '') + '>\n';
            result += this.getLabel();
            result += '</label>\n';
            result += '</div>\n';
            return result;
        };
    };
    Radio.prototype = new Element();
    Radio.prototype.constructor = Radio;

    Radios =
        function (n) {
            if (typeof n === "string")
                this.setName(n);
            var options = [];

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
                else if (!this.getName())
                    throw new IllegalStateException('Specify name of the radio-group first!');
                var radio = new Radio(this.getName()).setValue(this.getValue()).checked(!!checked);
                if (this.getLabel())
                    radio.setLabel(this.getLabel());
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
                var result = '<div class="form-group" for="' + this.getName() + '">\n';
                for (var i = 0; i < options.length; i++)
                    result += options[i].render();
                result += '</div>\n';
                return result;
            };
        };
    Radios.prototype = new Element();
    Radios.prototype.constructor = Radios;

    CheckBox =
        function (n) {
            if (typeof n === "string")
                this.setName(n);

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (!this.getName() || !this.getValue())
                    throw new NoArgumentException('Please check element\'s name and value.');
                var result = '<div class="form-group" for="' + this.getName() + '">\n';
                result += '<div class="checkbox">\n';
                result += '<label>\n';
                result += '<input type="checkbox"' + this.getParams() + '>' + (this.getLabel() ? this.getLabel() : '') + '\n';
                result += '</label>\n';
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                return result;
            };
        };
    CheckBox.prototype = new Element();
    CheckBox.prototype.constructor = CheckBox;


    /**
     * This class in a wrapper to html select tag.
     * @param n {String} select's name
     * @constructor
     */
    Select =
        function (n) {
            if (typeof n === "string")
                this.setName(n);
            var options = [];

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
                if (!this.getName() || Object.keys(options).length == 0)
                    throw new Error('Please check element\'s name, values and default value');
                var result = '<div class="form-group" for="' + this.getName() + '">\n';
                result += '<select' + this.getParams() + '>\n';
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
    Select.prototype = new Element();
    Select.prototype.constructor = Select;


    /**
     * This class in a wrapper to html text input.
     * @param n {String} input's name
     * @constructor
     */
    TextInput =
        function (n) {
            if (typeof n === "string")
                this.setName(n);
            var placeholder = '{{ENTER_TEXT}}';

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
                if (!this.getName())
                    throw new Error('Please check element\'s name. It\'s empty.');
                var result = '<div class="form-group" for="' + this.getName() + '">\n';
                result += '<input' + this.getParams() + 'type="text" placeholder="' + placeholder + '">\n';
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                return result;
            };
        };
    TextInput.prototype = new Element();
    TextInput.prototype.constructor = TextInput;

    /**
     * This class in a wrapper to html text area input.
     * @param n {String} input's name
     * @constructor
     */
    TextArea =
        function (n) {
            TextInput.call(this, n)

            var placeholder = '{{ENTER_TEXT}}';

            this.render = function () {
                if (!this.getName())
                    throw new Error('Please check element\'s name. It\'s empty.');
                var result = '<div class="form-group" for="' + this.getName() + '">\n';
                result += '<textarea' + this.getParams() + ' placeholder="' + placeholder + '">';
                if (this.value){
                  result += this.value.toString().escapeHTML();
                }
                result +='</textarea>\n';
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                return result;
            };
        };

    TextArea.prototype = new TextInput();
    TextArea.prototype.constructor = TextArea;

    DroppableArea =
        function (n) {
            if (typeof n === "string")
                this.setName(n);

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (this.getName().length == 0)
                    throw new Error('Please check element\'s name');
                this.removeClass('form-control').addClass('droppable');
                var result = '<div class="form-group" for="' + this.getName() + '">\n';
                result += '<div' + this.getParams() + '></div>\n';
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                _StepInvoker.addSource('js/additions/drag-drops.js').addCommand('makeDroppable', this.getName());
                return result;
            };
        };
    DroppableArea.prototype = new Element();
    DroppableArea.prototype.constructor = DroppableArea;

    DraggableGroup =
        function (n) {
            if (typeof n === "string")
                this.setName(n);
            var options = [];

            this.addOption = function (label, value) {
                if (!label || !value)
                    throw new IllegalArgumentException("Please check arguments at DraggableGroup!");
                options.push([label + '', value + '']);
                return this;
            };

            /**
             * Renders the element
             * @returns {String} rendered element
             */
            this.render = function () {
                if (this.getName().length == 0)
                    throw new Error('Please check element\'s name');
                else if (options.length == 0)
                    throw new Error('Nothing to add into DraggableGroup! Please add some options to DraggableGroup!');

                this.removeClass('form-control');
                var result = '<div class="draggables" name="' + this.getName() + '">\n';
                for (var i = 0; i < options.length; i++) {
                    result += '<div class="draggable ' + this.getClasses().join(" ") + '" value="' + options[i][1] + '">';
                    result += options[i][0];
                    result += '</div>\n';
                }
                result += '</div>\n';
                if (_Templatetor.teplatable(result))
                    result = new _Templatetor().setTemplate(result).render();
                _StepInvoker.addSource('js/additions/drag-drops.js').addCommand('makeDraggable', this.getName());
                return result;
            };
        };
    DraggableGroup.prototype = new Element();
    DraggableGroup.prototype.constructor = DraggableGroup;

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
})(jQuery, Templatetor, StepInvoker);