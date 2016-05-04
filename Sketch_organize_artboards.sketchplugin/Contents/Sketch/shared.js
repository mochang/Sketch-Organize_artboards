var com = com || {};

com.utils = {
    alert : function(message, title) {
        title = title || 'Alert';
        var app = [NSApplication sharedApplication];
        [app displayDialog:message withTitle:title];
    },

    // Check to see if artboards are selected, if no artboards selected, select all artboards
    checkArtboardsSelected : function(selection, doc) {
        if (selection.count() === 0) {
            selection = doc.currentPage().artboards();
            if (selection.count() === 0) {
                doc.showMessage("No artboards selected");
                return;
            }
        }
        return selection;
    },

    getLayersMeta : function(selection) {
        var layersMeta = [];
        var layer, left, top;
        for (var i = 0; i < selection.count(); i++) {
            layer = com.utils.getArtboard(selection[i]);
            left = layer.frame().x();
            top = layer.frame().y();
            layersMeta.push({
                layer: layer,
                left: left,
                top: top
            });
        }
        return layersMeta;
    },

    getArtboard : function(layer) {
    	if (layer.className() == 'MSArtboardGroup') {
    		return layer;
    	}
    	var artboard = layer;
        var parent;
    	while (artboard) {
            parent = artboard.parentGroup();
            if (parent.className() == 'MSArtboardGroup') {
                artboard = parent;
                break;
            } else if (parent.className() == 'MSPage') {
                break;
            }
    		artboard = parent;
    	}
    	if (!artboard) {
    		throw new Error("Layer is outside of any artboard");
    	}
    	return artboard;
    },

    init : function(context) {
        com.utils.context = context;
        com.utils.doc = context.document;
    },

    setArtboardNumber : function(artboard, number) {
        // Get current name.
        // If it contains number with the same formatting, then erase it.
        var curNameWONumber = artboard.name().replace(/^\d+\-/, '');

        // Set new name
        artboard.setName((number < 9 ? '0' : '') + (number+1) + '-' + curNameWONumber);
    },

    sendBackward : function() {
        [NSApp sendAction:'moveBackward:' to:nil from:com.utils.doc];
    },

    sortIndices : function(array) {
        for (var i = 0; i < array.length - 1; i++) {
            // get two array
            var a = array[i];
            var b = array[i + 1];

            // check if both layers are in the same group
            var parent_a = a.parentGroup();
            var parent_b = b.parentGroup();

            if (parent_a !== parent_b) {
                throw new Error("Couldn’t sort indices");
            }

            var parent = parent_a;

            if (parent.indexOfLayer(a) < parent.indexOfLayer(b)) {
                // swap index
                com.utils.swapIndex(b, a);
            }
        }
    },

    chooseOrderDialog: function () {
        var selectedItemIndex = 0

        var items = ['top then left', 'left then top']
        var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25))
        accessory.addItemsWithObjectValues(items)
        accessory.selectItemAtIndex(selectedItemIndex)

        var alert = NSAlert.alloc().init()
        alert.setMessageText("Choose number/sort order")
        alert.addButtonWithTitle('Continue')
        alert.addButtonWithTitle('Cancel')
        alert.setAccessoryView(accessory)

        var responseCode = alert.runModal()
        var sel = accessory.indexOfSelectedItem()

        return [responseCode, sel]
    },

    sortArtboards : function(sortOrder) {
        var sortFunc = function(){};

        // 0 = top to left, 1 = left to top
        if (sortOrder == 0) {
            sortFunc = function(a,b) {
                var dif = a.top - b.top;
                if (dif == 0) {
                    return a.left - b.left;
                }
                return dif;
            }
        } else if (sortOrder == 1) {
            sortFunc = function(a,b) {
                var dif = a.left - b.left;
                if (dif == 0) {
                    return a.top - b.top;
                }
                return dif;
            }
        }
        return sortFunc;
    },

    sortTopAndLeft : function(a,b) {
        var dif = a.top - b.top;
        if (dif == 0) {
            return a.left - b.left;
        }
        return dif;
    },

    swapIndex : function(a, b) {
        // check if both layers are in the same group
        var parent_a = a.parentGroup();
        var parent_b = b.parentGroup();

        if (parent_a !== parent_b) {
            throw new Error("Select layers of the same group");
        }

        var parent = parent_a;

        com.utils.doc.currentPage().deselectAllLayers();
        a.setIsSelected(true);

        var steps = Math.abs(parent.indexOfLayer(b) - parent.indexOfLayer(a));

        for (var i = 0; i < steps; i++) {
            com.utils.sendBackward();
        }
    }
};
