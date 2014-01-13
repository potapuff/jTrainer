var LangList = null;

(function($, _Logger, _Templatetor, _I18N) {
    LangList =
        function () {
            var LOGGER = new _Logger('Element LangList');
            var TEMPLATOR = new _Templatetor();

            var pattern = '<li><a href="?lang=%lang%" %current%>%name%</a></li>';
            var selectedPattern = 'selected="selected"';
            var langs = [];

            this.setLangs = function (l) {
                langs = l;
                return this;
            }

            this.setPattern = function (p) {
                if (p.indexOf('%name%') != -1 && p.indexOf('%lang%') != -1)
                    pattern = p;
                return this;
            }

            this.setSelectedPattern = function (p) {
                if (typeof p === "string")
                    selectedPattern = p;
                return this;
            }

            this.render = function () {
                LOGGER.debug(pattern, langs);
                console.log(pattern);
                var result = '';
                var currentLang = _I18N.getCurrentLang();
                for (var key in langs) {
                    if (langs.hasOwnProperty(key)) {
                        result += pattern.replace('%lang%', key).replace('%name%', langs[key]);
                        result = (key == currentLang ? result.replace('%current%', selectedPattern) : result.replace('%current%', ''));
                    }
                }
                if (_Templatetor.teplatable(result))
                    result = TEMPLATOR.setTemplate(result).parse();
                return result;
            }
        }
})(jQuery, Logger, Templatetor, I18N);

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
                result += '</select></div>\n';
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
var WolframAlpha = null;

(function($, _Logger) {
    WolframAlpha =
        function () {
            var LOGGER = new _Logger();
            var query;

            var doQuery = function (callback) {
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

            this.setQuery = function (q) {
                if (typeof q === "string") {
                    query = q;
                } else {
                    LOGGER.error('Query should be a string');
                }
                return this;
            }

            var hasQuery = function () {
                return !!query;
            }

            this.customQuery = function (callback) {
                if (hasQuery() && typeof callback === "function") {
                    doQuery(function (data) {
                        callback(data);
                    });
                    return true;
                }
                return false;
            }

            this.plot = function (callback) {
                if (hasQuery() && typeof callback === "function") {
                    query = 'plot ' + query;
                    doQuery(function(data) {
                        var src = $(data).find("#Plot subpod:first img").attr("src");
                        callback(src);
                    });
                }
            }

        }
})(jQuery, Logger);

var LateX =
    function () {
        var formula;

        this.setFormula = function (f) {
            if (typeof f === "string")
                formula = f;
            return this;
        }

        this.render = function () {
            return '<img class="latex" src="http://latex.codecogs.com/svg.latex?' + formula + '" border="0"/>';
        }
    };