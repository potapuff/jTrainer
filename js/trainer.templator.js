var Templatetor = null;

(function ($, _Mustache, _Logger) {
    /**
     * Templatetor is a Mustache wrapper with some addition functionality
     * like replacing mustache placeholders in already rendered DOM elements
     * and checking for them in the string. Also it has a container of static
     * view values, that makes language templating easier.
     * @constructor
     */
    Templatetor =
        function () {
            var LOGGER = new _Logger('Rotator');

            var view = {};
            var template = null;

            var replaceMode = false;

            /**
             * Replace text in specified elements. Note that only text content will be
             * modified, leaving all tags and attributes untouched. The new text can be
             * either text or HTML.
             * @author "Cowboy" Ben Alman http://benalman.com/projects/jquery-replacetext-plugin/
             * @param search (RegExp|String) A RegExp object or substring to be replaced.
             * @param replace (String|Function) The String that replaces the substring received
             *                 from the search argument, or a function to be invoked to create the new substring.
             * @param text_only (Boolean) If true, any HTML will be rendered as text. Defaults to false.
             * @returns {jQuery} The initial jQuery collection of elements.
             */
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

            /**
             * Adds values to templatetor's view.
             * View is a assoc array for replacement using Mustache
             * @param o {Object} view to add
             * @returns {Templatetor} current object (flow)
             */
            this.extendView = function (o) {
                if (typeof(o) !== "object")
                    LOGGER.error('Mustache view should be extended with an object');
                else
                    $.extend(view, o);
                return this;
            }

            /**
             * Sets a template where Mustache's placeholders should be processed
             * @param o {jQuery|String} template text/object
             * @returns {Templatetor} current object (flow)
             */
            this.setTemplate = function (o) {
                LOGGER.debug(typeof(o));
                template = o;
                return this;
            }

            /**
             * Setter of replacement mode.
             * If replacement mode is on
             * @param b {Boolean} replacement mode switch
             * @returns {Templatetor}
             */
            this.replace = function (b) {
                if (typeof b === "boolean")
                    replaceMode = b;
                return this;
            }

            /**
             * This method performs replacement of Mustache's placeholders with
             * data from view. If replacement mode enabled, method uses {@link $.fn.replaceText}
             * to perform replacements.
             * @returns {String|NULL} null if replacement mode is one, otherwise rendered string
             */
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
                    template.find('*').replaceText(/{{([^}]+)}}/, function (fullMatch, key) {
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
                    var rendered = _Mustache.render(tpl, view);
                }
                this.clean();
                return rendered;
            }

            /**
             * Cleans templatetor's view, template data and disabling replacement mode
             * @returns {Templatetor}
             */
            this.clean = function () {
                view = {};
                template = null;
                insertObj = null;
                replaceMode = false;
                return this;
            }
        }
})(jQuery, Mustache, Logger);

/**
 * This is a static view that takes part in all templatetor's renderings
 */
Templatetor.constructor.prototype.constView = {};

/**
 * Extends a static view object
 * @param o {Object} an assoc array with replacements
 */
Templatetor.constructor.prototype.extendConstView = function (o) {
    if (typeof(o) === "object")
        $.extend(Templatetor.constructor.prototype.constView, o);
}

/**
 * This methods checks if string contains Mustache's placeholders and can be
 * processed with {@link Templatetor}
 * @param t {String} text to check
 * @returns {boolean} true, if text contains Mustache's placeholders, otherwise false
 */
Templatetor.constructor.prototype.teplatable = function (t) {
    var txt;
    if (t instanceof $)
        txt = t.html();
    else if (typeof t === "string") {
        txt = t;
    } else {
        return false;
    }
    return txt.indexOf("{{") != -1;
}