$(document).ready(function() {
	
	/* Cube Style */
	$('.search-button1').click(function() {
		
			
			$('.content-wrapper1').addClass('switch-show');
			$('.search-box1').addClass('show-search-box');
			
			setTimeout(function(){
		
				$('.content-wrapper1').removeClass('switch-show');
				$('.search-button1').removeClass('show-search-button').addClass('hide-search-button');
				$('.search-box1').addClass('showed-search-box');
			
			},480);
	});
	
	$('.search-box1 img').click(function() {
		
		$('.search-button1').removeClass('hide-search-button');
		$('.search-box1').addClass('hidden-search-box');
		$('.content-wrapper1').addClass('switch-hide');
		
			
			setTimeout(function(){
		
				$('.content-wrapper1').removeClass('switch-hide');
				$('.search-button1').removeClass('show-search-button');
				$('.search-box1').removeClass('show-search-box showed-search-box hidden-search-box');
			
			},480);
			
	});
	
	/* Cube Style With Animate */
	$('.search-button2').click(function() {
		
		$('.arrow').hide();
		
		$(this).stop().animate({'width':'100%'}, 500, function() {
			
			$('.search-content-wrapper2').addClass('switch-show');
			$('.search-box2').addClass('show-search-box');
			
			setTimeout(function(){
		
				$('.search-content-wrapper2').removeClass('switch-show');
				$('.search-button2').removeClass('show-search-button').addClass('hide-search-button');
				$('.search-box2').addClass('showed-search-box');
			
			},480);
			
		});
	});
	
	$('.search-box2 img').click(function() {
		
		
		$('.search-button2').removeClass('hide-search-button');
		$('.search-box2').addClass('hidden-search-box');
		$('.search-content-wrapper2').addClass('switch-hide');
		
		$('.search-button2').addClass('show-search-button').stop().delay(500).animate({'width':'50px'}, 500, function() {
			
			$('.search-content-wrapper2').removeClass('switch-hide');
			$('.search-button2').removeClass('show-search-button');
			$('.search-box2').removeClass('show-search-box showed-search-box hidden-search-box');
			
			$('.arrow').show();
			
		});
	});

	
});