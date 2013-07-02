var is_touch_device = 'ontouchstart' in document.documentElement;
if(!is_touch_device){
	var nav = document.getElementById('stickyNavigation'),
		offset = nav.offsetTop;


	function onScroll(){
		var pageOffest = window.pageYOffset || document.documentElement.scrollTop;
		if (pageOffest >= 0 && pageOffest <= offset) {
			nav.style.top = offset - pageOffest + 'px';
		}
		else if (pageOffest > offset) {
			nav.style.top = 0 + 'px';
		}
	}

	onScroll();

	window.onscroll = onScroll;
}