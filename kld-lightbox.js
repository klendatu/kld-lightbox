
jQuery.fn.lightBox = function(options){
	
	var LightBox = function($component, options){
		var _this = this;
		this.objClass 		= 'LightBox';		
		this.$component 	= $component;
		this.close 			= this.$component.find('.'+this.objClass+'-close');
		this.$overlay 		= $('.'+this.objClass+'-overlay').eq(0);
		this.timer 			= null;
		this.options 		= options;
		this.canBeHide		= true;
		this.init();
		this.setEvents();
		return this;
	}

	LightBox.prototype = {
	
		init: function(){
			if (this.$overlay.length == 0){
				this.createOverlay();
			}
		},

		setEvents: function(){		
			var _this = this;
						
			if (this.close.length > 0){
				this.close.click(function(){
					_this.hide();			
				});
			}
			
			if (this.$overlay.length > 0){	
				this.$overlay.click(function(){
					_this.hide();			
				});
			}
			
			if (this.options.autoCenterUpdate){
				// this.timer = setTimeout($.proxy(this.setPosition, this), 150);
				$(window).on('resize', function(){
					_this.setPosition();
				});
			}
		},
		
		launch: function(){
			this.setPosition(true);
			this.initOptions();
			this.show();	
		},
		
		initOptions: function(){
			var overlayClass = this.$component.data('lb-overlay');
			if (overlayClass != undefined){
				this.options.overlayClass = overlayClass;
				this.$overlay.addClass(overlayClass);
			}
		},
		
		setPosition: function(){
			var _this = this;
			var screnW = parseInt($(window).width());
			var screnH = parseInt($(window).height());
			
			// Si LESS est utilisé, la largeur de la box peut être erronée du fait que la largeur par défaut de 750 sera prise en compte avant les styles générés par LESS
			var boxW = parseInt(_this.$component.outerWidth());		
			var boxH = parseInt(_this.$component.outerHeight());
			var posLeft = (screnW - boxW)/2;
			var posTop = (screnH - boxH)/2;
			
						
			if (this.options.autoCenterH){
				_this.$component.css({
					left: posLeft + 'px'
				});
			}
			
			if (this.options.autoCenterV){
				_this.$component.css({
					top: posTop + 'px'
				});
			}			
		},

		show: function(){		
			var _this = this;
			this.canBeHide = false;
			
			// setTimeout(function(){ 
				// _this.canBeHide = true;
			// }, 250); // Délai car le click peut se declencher sur l'overlay et hider la popup juste après son ouverture
			
			this.$component
				.fadeIn()
				.removeClass('isHidden')
				.addClass('isOpen');
				
			this.$overlay.fadeIn();
			
			$(document).trigger('lightbox.show');
		},

		hide: function(){
			var _this = this;
			
			this.$overlay.fadeOut(function(){
				_this.$overlay.removeClass(_this.options.overlayClass);
			});
			
			this.$component
				.fadeOut()
				.addClass('isHidden')
				.removeClass('isOpen');
				
			clearTimeout(this.timer);
			$(document).trigger('lightbox.hide');
		},
		
		createOverlay: function(){
			var _this = this;	
			this.$overlay = $('<div class="'+this.objClass+'-overlay '+ this.options.overlayClass +'"></div>').appendTo($('body'));
		}
	}

	
	/**
	-----------------------------------------------------------------------------------------
		jQuery
	-----------------------------------------------------------------------------------------	
	*/
	var defaults = {
		overlayClass		: '',
		autoCenterV			: true,
		autoCenterH			: true,
		autoCenterUpdate	: true
	};
	
	
	$(this).each(function(){
		var $component 	= $(this);
		var instance 	= $component.data('lb-object');	
		
		// Création de l'objet LightBox pour chaque lightbox s'il n'existe pas déjà
		if (typeof(instance) == 'undefined'){	
			options = $.extend({}, defaults, options);		
			$component.data('lb-object', new LightBox($component, options));
			
			
			
		}else{		
		// Sinon on récupère la valeur chaine de options et on déclenche l'action sur la lightbox existante
			if (typeof(options) == 'string'){
			
				if (options == 'show'){
					instance.launch();
				}
				
				if (options == 'hide'){
					instance.setPosition(true);
					instance.initOptions();
					instance.hide();
				}
				
			}
		}
	});
	
	// On déclenche l'ouverture de la lightbox au clic sur un tag
	$('[data-lightbox]').on('click', function(){		
		var id = $(this).data('lightbox');
		var instance = $(id).data('lb-object');		
		if (instance != undefined)
			if (instance.$component.length > 0)
				instance.launch();
	});
						
}

















