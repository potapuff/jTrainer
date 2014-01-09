var Validator = null;

(function($){
    Validator =
        function () {
            var database = null;
            var targets = {};

            var consturctor = function() {
                if (forms)
                    database = forms;
            }();
            
            var hashCode = function (s) {
                if (s == 'undefined' || s == '')
                    return 0;
                return s.split("").reduce(function (a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
            }

            this.dbg = function (s) {
                return hashCode(s);
            }
            
            this.setValidationData = function (db) {
                database = db;
                return this;
            }
            
            this.addForm =  function (o) {
                if (!(o instanceof $)) {
                    console.log('trainer.validator :: form must be an  jQuery object');
                    return;
                }
                if (o.length < 1) {
                    console.log('trainer.validator :: form is undefined');
                    return;
                }
                var key = o.attr('data-form');
                if (key === undefined || key.length < 1) {
                    console.log('trainer.validator :: bad form\'s key');
                    return;
                }
                    
                targets[key] = o;
                return this;
            }
            
            this.validate = function () {
                if (database == null) {
                    console.log('trainer.validator :: no database');
                    return;
                } else if ($.isEmptyObject(targets)) {
                    console.log('trainer.validator :: nothing to check');
                    return;
                }
                var result = true;
                for (var key in targets) {
                    if (targets.hasOwnProperty(key)) {
                        var form = targets[key].attr('data-form');
                        targets[key].find('[data-check="true"]').each(function() {
                            var field = $(this).attr('name');
                            var val = dataVal = '';
                            
                            val = $(this).val();
                            val = val ? hashCode(val) : null;
                            
                            if (!val) {
                                dataVal = $(this).attr('data-val');
                                dataVal = dataVal ? hashCode(dataVal) : null;
                            }
                            
                            if (val == database[form][field] || dataVal == database[form][field]) {
                                targets[key].find('.verification[data-for="' + field + '"]').removeClass('error').addClass('success');
                            } else {
                                result = false;
                                targets[key].find('.verification[data-for="' + field + '"]').removeClass('success').addClass('error');
                            }
                        });
                    }
                }
                return result;
            }
        }
})(jQuery);