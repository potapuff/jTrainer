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
            .addValidator($('textarea[name="test-textarea"]'), ['test'], true)
            .addValidator($('div.droppable[name="test-droppable"]'), function(n) { return n === '1,4' || n === '4,1'}, true) // Validate value with function
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
                .addClass('green')
                .addOption('Answer 1', 1)
                .addOption('Answer 2', 2)
                .addOption('Answer 3', 3)
                .addOption('Answer 4', 4)
                .render(),
            TEST_DROPPABLE1: new DroppableArea('test-droppable1')
                .addClass('input')
                .addAcceptable('.red')
                .render(),
            TEST_DRAGGABLE1: new DraggableGroup('test-draggable1')
                .addClass('value')
                .addClass('red')
                .addOption('Answer 5', 1)
                .addOption('Answer 6', 2)
                .addOption('Answer 7', 3)
                .addOption('Answer 8', 4)
                .render(),
            TEST_INPUT: new TextInput('test-textinput')
                .render(),
            AREA_INPUT: new TextArea('test-textarea')
                .render(),
            PLOT: plot
        }
    }
}