var is_touch_device = 'ontouchstart' in document.document-element;
if(!is_touch_device){
	var nav = document.get-element-by-id('sticky-navigation'),
		offset = nav.offset-top;


	function on-scroll(){
		var page-offest = window.page-yOffset || document.document-element.scroll-top;
		if (page-offest >= 0 && page-offest <= offset) {
			nav.style.top = offset - page-offest + 'px';
		}
		else if (page-offest > offset) {
			nav.style.top = 0 + 'px';
		}
	}

	on-scroll();

	window.onscroll = on-scroll;
}