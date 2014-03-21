$(document).ready(function(){
	function Slider(selector){
		this.el = $(selector);
		this.max-transition-time = 650;

		this.slides = this.el.find('> div');
		this.slide-count = this.slides.length;
		this.active = 1;

		if(!this.support-transitions()){
			slide.max-transition-time = 0;
		}

		this.bindings();
	}

	Slider.prototype.bindings = function() {
		var $this = this;
		$('.prev').click(function(){ $this.previous-slide(); });
		$('.next').click(function(){ $this.next-slide(); });
		$('.goto').click(function(){ $this.go-to-slide($(this).data('index')); });
	};


	Slider.prototype.support-transitions = function(first_argument) {
		var b = document.body.style || document.document-element.style;
		if(typeof b['transition'] == 'string') {
			return true;
		}
		return false;
	};

	Slider.prototype.go-to-slide = function(slide-index) {
		if(slide-index == this.active){
			return;
		}

		if(this.el.data('animating') == 1){
			return;
		}

		var $this = this,
			old-index = this.active-1;

		this.el.data('animating', 1);

		this.slides.eq(old-index).add-class('out2');
		this.slides.eq(slide-index-1).add-class('out').remove-class('no-transition').remove-class('out');

		set-timeout(function(){
			$this.slides.eq(old-index).add-class('no-transition').add-class('out').remove-class('out2');
			$this.el.data('animating', 0);
		}, $this.max-transition-time);

		this.active = slide-index;
	};

	Slider.prototype.previous-slide = function() {
		var slide-index;

		if(this.active === 1){
			slide-index = this.slide-count;
		}
		else{
			slide-index = this.active - 1;
		}
		this.go-to-slide(slide-index);
	};

	Slider.prototype.next-slide = function() {
		var slide-index;
		if(this.active === this.slide-count){
			slide-index = 1;
		}
		else{
			slide-index = this.active + 1;
		}

		this.go-to-slide(slide-index);
	};

	var slider = new Slider('.slider');
});