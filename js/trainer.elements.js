var LangList = null;

(function($, _Logger, _Templatetor) {
    LangList =
        function () {
            var LOGGER = new _Logger('Element LangList');
            var TEMPLATOR = new _Templatetor();

            var pattern = '<li><a href="?lang=%lang%">%name%</a></li>';
            var langs = [];

            this.setLangs = function (l) {
                //LOGGER.debug(l);
                //if (l.length != 0)
                    langs = l;
                return this;
            }

            this.setPattern = function (p) {
                if (p.indexOf('%name%') != -1 && p.indexOf('%lang%') != -1)
                    pattern = p;
                return this;
            }

            this.render = function () {
                LOGGER.debug(pattern, langs);
                console.log(pattern);
                var result = '';
                for (var key in langs) {
                    if (langs.hasOwnProperty(key)) {
                        result += pattern.replace('%lang%', key).replace('%name%', langs[key]);
                    }
                }
                if (_Templatetor.teplatable(result))
                    result = TEMPLATOR.setTemplate(result).parse();
                return result;
            }
        }
})(jQuery, Logger, Templatetor);

var Select = null;

(function($, _Logger, _Templatetor) {
    Select =
        function (n) {
            var LOGGER = new _Logger('Element Select');
            var TEMPLATETOR = new _Templatetor();

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
                options[text] = value;
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
                var result = '<div class="form-group" for="' + name + '"><select name="' + name + '" class="' + classes.join(' ') + '"' + (style != '' ? (' style="' + style + '"') : '') +'><option value="-1">{{CHOOSE_SELECT}}</option>';
                for (var key in options){
                    if (options.hasOwnProperty(key)) {
                        result += '<option value="' + options[key] + '">' + key + '</option>\n';
                    }
                }
                result += '</select></div>';
                if (_Templatetor.teplatable(result))
                    result = TEMPLATETOR.setTemplate(result).render();
                return result;
            }
        }
})(jQuery, Logger, Templatetor);

var TextInput = null;

(function($, _Logger, _Templatetor) {
    TextInput =
        function (n) {
            var LOGGER = new _Logger('Element TextInput');
            var TEMPLATOR = new _Templatetor();

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
                var result = '<div class="form-group" for="' + name + '"><input type="text" name="' + name + '" class="' + classes.join(' ') + '"' + (style != '' ? (' style="' + style + '"') : '') +' placeholder="' + placeholder + '"></div>';
                if (_Templatetor.teplatable(result))
                    result = TEMPLATOR.setTemplate(result).render();
                return result;
            }
        }
})(jQuery, Logger, Templatetor);