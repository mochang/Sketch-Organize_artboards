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
        var artboard;
        for (var i = 0; i < layersMeta.length; i++) {
            artboard = layersMeta[i].layer;
            
            // If current name contains number with the same formatting, then erase it
            var curNameWONumber = artboard.name().replace(/^\d+\-/, '');

            // Set new name
            artboard.setName(curNameWONumber);
        }
    } catch(e) {
        doc.showMessage(e.message);
    }
}
