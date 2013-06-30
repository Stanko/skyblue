var is_touch_device = 'ontouchstart' in document.documentElement;
if(!is_touch_device){
	var nav = document.getElementById('stickyNavigation'),
		offset = nav.offsetTop;

	window.onscroll = function(){
		if( window.XMLHttpRequest ) {
			var pageOffest = document.documentElement.scrollTop || self.pageYOffset;
			if (pageOffest >= 0 && pageOffest <= offset) {
				nav.style.top = offset - pageOffest + 'px';
			}
			else if (pageOffest > offset) {
				nav.style.top = 0 + 'px';
			}
		}
	};
}

