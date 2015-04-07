$(document).ready(function(){

	var sidemenu = $('.js-sidemenu');
	var sidemenuParent = sidemenu.parent();
	var top = sidemenu.offset().top;

	function fixSidemenu(){
		var scrollTop = $(window).scrollTop();
		var width = $(window).width();

		if(width >= 768 && scrollTop > top){
			sidemenu.addClass('fixed');
		}
		else{
			sidemenu.removeClass('fixed');
		}
		sidemenu.width(sidemenuParent.width());
	}

	$(window)
		.scroll(function(){
			fixSidemenu();
		})
		.resize(function(){
			fixSidemenu();
		});

	fixSidemenu();
});