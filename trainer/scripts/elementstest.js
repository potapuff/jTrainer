var VElements;
var elementstest = function () {
    this.preDispatch = function () {
    }

    this.postDispatch = function () {
        VElements = new Validator();
        VElements.addValidator($('select[name="test-select"]'), 2)
                 .addValidator($('input[name="test-textinput"]'), 'test');
        $('select[name="test-select"]').attr('onchange', 'VElements.validate()');
        $('input[name="test-textinput"]').keyup(function() {VElements.validate()});
    }

    this.mustache = function () {
        return {TEST_SELECT: new Select('test-select')
                                 .addOption('{{ELEMENTSTEST_OPTION_ONE}}', 0)
                                 .addOption('{{ELEMENTSTEST_OPTION_TWO}}', 1)
                                 .addOption('{{ELEMENTSTEST_OPTION_THREE}}', 2)
                                 .render(),
               TEST_INPUT:   new TextInput('test-textinput')
                                 .render()
        }
    }
}