$(document).ready(function(){
	function Slider(selector){
		this.el = $(selector);
		this.maxTransitionTime = 650;

		this.slides = this.el.find('> div');
		this.slideCount = this.slides.length;
		this.active = 1;

		if(!this.supportTransitions()){
			slide.maxTransitionTime = 0;
		}

		this.bindings();
	}

	Slider.prototype.bindings = function() {
		var $this = this;
		$('.prev').click(function(){ $this.previousSlide(); });
		$('.next').click(function(){ $this.nextSlide(); });
		$('.goto').click(function(){ $this.goToSlide($(this).data('index')); });
	};


	Slider.prototype.supportTransitions = function(first_argument) {
		var b = document.body.style || document.documentElement.style;
		if(typeof b['transition'] == 'string') {
			return true;
		}
		return false;
	};

	Slider.prototype.goToSlide = function(slideIndex) {
		if(slideIndex == this.active){
			return;
		}

		if(this.el.data('animating') == 1){
			return;
		}

		var $this = this,
			oldIndex = this.active-1;

		this.el.data('animating', 1);

		this.slides.eq(oldIndex).addClass('out2');
		this.slides.eq(slideIndex-1).addClass('out').removeClass('noTransition').removeClass('out');

		setTimeout(function(){
			$this.slides.eq(oldIndex).addClass('noTransition').addClass('out').removeClass('out2');
			$this.el.data('animating', 0);
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