function makeDraggable(elementName) {
    $('div.draggables[name="' + elementName + '"] div.draggable').draggable({
        revert: true
    });
}

function makeDroppable(elementName) {
    $('div.droppable[name="' + elementName + '"]').droppable({drop: function (event, ui) {
        var parentSelector = ui.draggable.parent().attr('name');
        ui.draggable.attr('data-parent', parentSelector);
        ui.draggable.appendTo('div.droppable[name="' + elementName + '"]');
        ui.draggable.draggable("disable");
        ui.draggable.appendTo('div.droppable[name="' + elementName + '"]').removeAttr('style', '');
        var v = ($(this).attr('value') || '');
        $(this).attr('value', (v + (v.length > 0 ? ',' : '') + ui.draggable.attr('value')));
        ui.draggable.click(function () {
            var parent = $(this).closest("div.droppable");
            var answerValue = $(this).attr("value");
            var parentValue = parent.attr("value");
            parent.attr("value", parentValue.replace("," + answerValue, "").replace(answerValue + ",", "").replace(answerValue, ""));
            $(this).attr('style', 'position:relative').appendTo('div.draggables[name="' + parentSelector + '"]').draggable("enable").unbind('click');
        });
    }});
}