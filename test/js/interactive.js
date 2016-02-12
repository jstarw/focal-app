//////////////////////////////////////////
// 										//
//			Tooltip Functions			//
//										//
//////////////////////////////////////////

/**
 * Attaches Tooltip to svg element
 * @param {String} selector
 * @param {String} placement
 */
var createTooltip = function(selector, placement) {
    $(selector).tooltip({
        'container': 'body',
        'placement': placement
    });
}

