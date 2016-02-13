//////////////////////////////////////////
// 										//
//			Tooltip Functions			//
//										//
//////////////////////////////////////////
var Tooltip = {
	/**
	 * Attaches Tooltip to svg element
	 * @param {String} selector
	 * @param {String} placement
	 */
	createTooltip: function(selector, placement) {
	    $(selector).tooltip({
	        'container': 'body',
	        'placement': placement
	    });
	}
}
