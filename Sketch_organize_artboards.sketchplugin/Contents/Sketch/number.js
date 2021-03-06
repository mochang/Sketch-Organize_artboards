@import 'shared.js'

var onRun = function(context) {
    var doc = context.document;
    var selection = context.selection;
    var layersMeta = [];

    com.utils.init(context);

    // selct all artboards if no artboards selected
    selection = com.utils.checkArtboardsSelected(selection, doc);

    // Get metadata for all selected artboards
    layersMeta = com.utils.getLayersMeta(selection);

    try {
        sortDialogResponse = com.utils.chooseOrderDialog();

        if (sortDialogResponse[0] === 1000) {
            var sortOrder = sortDialogResponse[1];

            // sort artboards by their top and left position
            layersMeta.sort(com.utils.sortArtboards(sortOrder));

            var layer;
            for (var i = 0; i < layersMeta.length; i++) {
                layer = layersMeta[i].layer;
                com.utils.setArtboardNumber(layer, i);
            }
        }
    } catch(e) {
        doc.showMessage(e.message);
    }
}
