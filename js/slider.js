$(document).ready(function(){
	function Slider(selector){
		this.el = $(selector);
		this.maxTransitionTime = 650;

		this.init();
	}
	Slider.prototype.init = function() {
		this.slides = this.el.find('> div');
		this.slideCount = this.slides.length;
		this.active = 1;

		this.bindings();
	};

	Slider.prototype.bindings = function() {
		var $this = this;
		$('.prev').click(function(){ $this.previousSlide(); });
		$('.next').click(function(){ $this.nextSlide(); });
	};

	Slider.prototype.goToSlide = function(slideIndex) {
		var $this = this,
			oldIndex = this.active-1;

		this.slides.eq(oldIndex).addClass('out2');
		this.slides.eq(slideIndex-1).addClass('out').removeClass('noTransition').removeClass('out');

		setTimeout(function(){
			$this.slides.eq(oldIndex).addClass('noTransition').addClass('out').removeClass('out2');
		}, $this.maxTransitionTime);

		this.active = slideIndex;
	};

	Slider.prototype.previousSlide = function() {
		var slideIndex;

		if(this.active === 1){
			slideIndex = this.slideCount;
		}
		else{
			slideIndex = this.active - 1;
		}
		this.goToSlide(slideIndex);
	};

	Slider.prototype.nextSlide = function() {
		var slideIndex;
		if(this.active === this.slideCount){
			slideIndex = 1;
		}
		else{
			slideIndex = this.active + 1;
		}

		this.goToSlide(slideIndex);
	};

	var slider = new Slider('.slider');
});