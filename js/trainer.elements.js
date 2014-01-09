var LangList = null;

(function($, Log, Tpl) {
    LangList =
        function () {
            var LOGGER = new Log('Element LangList');
            var TEMPLATOR = new Tpl();

            var pattern = '<li><a href="#%lang%">%name%</a></li>';
            var langs = [];

            this.setLangs = function (l) {
                //LOGGER.debug(l);
                //if (l.length != 0)
                    langs = l;
                return this;
            }

            this.setPattern = function (p) {
                if (typeof p !== "string" && p.indexOf('%name%') != -1 && p.indexOf('%lang%') != -1)
                    pattern = p;
                return this;
            }

            this.render = function () {
                LOGGER.debug(langs);

                var result = '';
                for (var key in langs) {
                    if (langs.hasOwnProperty(key)) {
                        result += pattern.replace('%lang%', key).replace('%name%', langs[key]);
                    }
                }
                if (TEMPLATOR.teplatable(result))
                    result = TEMPLATOR.setTemplate(result).parse();
                return result;
            }
        }
})(jQuery, Logger, Templatetor);

var Select = null;

(function($, Log, Tpl, Src) {
    Select =
        function (n) {
            var LOGGER = new Log('Element Select');
            var TEMPLATETOR = new Tpl();

            var name = n;
            var style = '';
            var classes = ['form-control'];
            var options = [];

            this.setName = function (nm) {
                if (typeof nm === "string")
                    name = nm;
                return this;
            }

            this.setStyle = function (s) {
                if (typeof s === "string")
                    style = s;
                return this;
            }

            this.addClass = function (c) {
                if (typeof c === "string")
                    classes.push(c);
            }

            this.removeClass = function (c) {
                delete classes[c];
            }

            this.addOption = function (text, value) {
                if ((typeof text === "string") && (typeof value === "string"))
                    options[text] = Src.hashCode(value);
                return this;
            }
            
            this.disabled = function (b) {
                if (b === true)
                    this.addClass('disabled')
                else if (b === false)
                    this.removeClass('disabled');
                return this;
            }
            
            this.render = function () {
                var result = '<select name="' + name + '" class="' + classes.join(' ') + (style != '' ? (' style="' + style + '"') : '') +'>';
                for (var key in options){
                    if (options.hasOwnProperty(key)) {
                        result += '<option value="' + options[key] + '">' + key + '</option>\n';
                    }
                }
                result += '</select>';
                if (TEMPLATETOR.teplatable(result))
                    result = TEMPLATETOR.setTemplate(result).parse();
                return result;
            }
        }
})(jQuery, Logger, Templatetor, Service);

var TextInput = null;

(function($, Log, Tpl) {
    TextInput =
        function (n) {
            var LOGGER = new Log('Element TextInput');
            var TEMPLATOR = new Tpl();

            var name = n;
            var style = '';
            var classes = ['form-control'];
            var placeholder = '{{ENTER_TEXT}}';

            this.setName = function (nm) {
                if (typeof nm === "string")
                    name = nm;
                return this;
            }

            this.setStyle = function (s) {
                if (typeof s === "string")
                    style = s;
                return this;
            }

            this.addClass = function (c) {
                if (typeof c === "string")
                    classes.push(c);
            }

            this.removeClass = function (c) {
                delete classes[c];
            }

            this.placeholder = function (text) {
                if (typeof text === "string")
                    placeholder = text;
                return this;
            }

            this.disabled = function (b) {
                if (b === true)
                    this.addClass('disabled')
                else if (b === false)
                    this.removeClass('disabled');
                return this;
            }

            this.render = function () {
                var result = '<input type="text" name="' + name + '" class="' + classes.join(' ') + (style != '' ? (' style="' + style + '"') : '') +' placeholder="' + placeholder + '">';
                if (TEMPLATOR.teplatable(result))
                    result = TEMPLATOR.setTemplate(result).parse();
                return result;
            }
        }
})(jQuery, Logger, Templatetor);