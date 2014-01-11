var Templatetor = null;

(function($, M, Log) {
    Templatetor =
        function () {
            var LOGGER = new Log('Rotator');

            //var constView = {};
            var view = {};
            var template = null;

            var replaceMode = false;

            $.fn.replaceText = function (search, replace, text_only) {
                return this.each(function () {
                    var node = this.firstChild,
                        val,
                        new_val,
                        remove = [];
                    if (node) {
                        do {
                            if (node.nodeType === 3) {
                                val = node.nodeValue;
                                new_val = val.replace(search, replace);
                                if (new_val !== val) {
                                    if (!text_only && /</.test(new_val)) {
                                        $(node).before(new_val);
                                        remove.push(node);
                                    } else {
                                        node.nodeValue = new_val;
                                    }
                                }
                            }
                        } while (node = node.nextSibling);
                    }
                    remove.length && $(remove).remove();
                });
            };

            this.extendView = function (o) {
                if (typeof(o) !== "object")
                    LOGGER.error('Mustache view should be extended with an object');
                else
                    $.extend(view, o);
                return this;
            }

            this.setTemplate = function (o) {
                LOGGER.debug(typeof(o));
                template = o;
                return this;
            }

            this.appendTemplate = function (o) {
                if (template instanceof $)
                    template.append(o);
                else if (typeof(o) === "string")
                    template += o;
                else
                    LOGGER.error('Appending template error');
                return this;
            }

            this.replace = function (b) {
                if (typeof b === "boolean")
                    replaceMode = b;
                return this;
            }

            this.render = function () {
                if (!template) {
                    LOGGER.error('template is undefined');
                    return;
                }
                LOGGER.debug("TREMOLATOTAORS VIEW");
                LOGGER.debug(view);

                $.extend(view, Templatetor.constructor.prototype.constView);
                LOGGER.debug(view);

                if ((template instanceof $) && replaceMode === true) {
                    template.find('*').replaceText(/{{([^}]+)}}/, function(fullMatch, key) {
                        return ((typeof view[key] !== "undefined") ? view[key] : key);
                    }, false);
                } else {
                    var tpl;
                    if (template instanceof $)
                        tpl = template.html();
                    else if (typeof(template) === "string")
                        tpl = template;
                    else {
                        LOGGER.error('Unknown type of template');
                        return;
                    }
                    LOGGER.debug(view);
                    var rendered = M.render(tpl, view);
                }
                this.clean();
                return rendered;
            }

            this.clean = function () {
                view = {};
                template = null;
                insertObj = null;
                replaceMode = false;
                return this;
            }
        }
})(jQuery, Mustache, Logger);

Templatetor.constructor.prototype.constView = {};

Templatetor.constructor.prototype.extendConstView = function (o) {
    if (typeof(o) === "object")
        $.extend(Templatetor.constructor.prototype.constView, o);
    console.log(Templatetor.constructor.prototype.constView);
}

Templatetor.constructor.prototype.teplatable = function (text) {
    var txt;
    if (text instanceof $)
        txt = text.html();
    else if (typeof text === "string") {
        txt = text;
    } else {
        return false;
    }
    return txt.indexOf("{{") != -1;
}