var elementstest = function () {
    var validator = null;
    var plot = null;

    this.preDispatch = function (callback) {
        var w = new WolframAlpha();
        w.setQuery('3x2+2x+5').plot(function (data) {
            plot = '<img src="' + data + '">';
            callback();
        })
    }

    this.postDispatch = function () {
        validator = new Validator();
        validator.addValidator($('select[name="test-select"]'), 2)
            .addValidator($('input[name="test-textinput"]'), ['test', 'Text'], true)
            .addValidator($('div.droppable[name="test-droppable"]'), ['1', '4'], true)
            .setStrictMode(true)
            .setIgnoreCase(false);
        $('#validatorInvoker').click(function () {
            validator.validate();
        });
    }

    this.mustache = function () {
        return {
            TEST_SELECT: new Select('test-select')
                .addOption('{{ELEMENTSTEST_OPTION_ONE}}', 0)
                .addOption('{{ELEMENTSTEST_OPTION_TWO}}', 1)
                .addOption('{{ELEMENTSTEST_OPTION_THREE}}', 2)
                .render(),
            TEST_DROPPABLE: new DroppableArea('test-droppable')
                .addClass('input')
                .render(),
            TEST_DRAGGABLE: new DraggableGroup('test-draggable')
                .addClass('value')
                .addOption('Answer 1', 1)
                .addOption('Answer 2', 2)
                .addOption('Answer 3', 3)
                .addOption('Answer 4', 4)
                .render(),
            TEST_INPUT: new TextInput('test-textinput')
                .render(),
            PLOT: plot
        }
    }
}