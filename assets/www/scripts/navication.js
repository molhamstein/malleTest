var currentPageIndex = 1;
var touchStart  = ""; //holding the start position of the curren touch 
var prevTouch  = "";  //holding the last update of the current touch
var initSliderLeft = ""   //inital left distance value of the soider when we started swiping   
var isSwiping = false ;
var currentSubPage = 0 ;
var maxSubPage = 1 ;	// number of extra pages (other than main and cat )
var disFromStart = " " ;
var preventSwipe =false ; /// indiacting wether there is more subpages to swipe to , used for lowering calcularions required each touchmove
var isPanelOpen = false; 

$(document).ready(function(){
	//removing hover effect
	$('li').bind('mouseover', function(){return false;});
	//this script is to make sure there will be no scroling divs in the view
	$("#container").css("overflow-x","hidden").css("width",document.documentElement.clientWidth+"px");
	
	$(".sub_page").css("width",document.documentElement.clientWidth+"px").css("height",document.documentElement.clientHeight+"px").css("overflow-y","auto");//.css("visibility","hidden");
	$("#main").css("visibility","visible");
	$("#cliper").css("width",document.documentElement.clientWidth+"px").css("height",document.documentElement.clientHeight+"px");
	$("#slider").css("left",-document.documentElement.clientWidth -200);
	$("#titles").css("transition-duration", "1.0s");
	
	//enabling ajax from different domain
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	
	$("#btn_more").click(function(){
    	$("#more_desc").slideToggle();
	});
	
	// initalizing the photo galery in the product description page
	var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
	
	
	
	//touch parameters twiaking
	$.event.special.swipe.horizontalDistanceThreshold = 120;
	$.event.special.swipe.verticalDistanceThreshold = 120 ;
	$.event.special.swipe.scrollSupressionThreshold  = 200;
	
	
	
});


// biniding events
window.addEventListener('onorientationchange', doOnOrientationChange);
$(window).resize(doOnOrientationChange);
document.addEventListener("deviceready", onDeviceReady, false);
$(document).bind('pageinit', initPageHandler);

// this is a phonegap call    
function onDeviceReady() {
        navigator.splashscreen.hide();
}

function initPageHandler(){
	//preventing drag and drop
	$("img").bind('dragstart', function(event) {event.preventDefault(); });
	$("li").bind('dragstart', function(event) {event.preventDefault(); });
	$("*").bind('dragstart', function(event) {event.preventDefault(); });
	
	// those couple of events are for debug purposes only
	//$(document).off("swipeleft").on('swipeleft',swipeRightHandler);
	//$(document).off("swiperight").on('swiperight',swipeLeftHandler);
	
	//this is a bsic script for native sliding navication like mobileOne , bout this script wont work on computer browsers 
	// this code still under development
	
	$("#slider").css("transform","translateX(0px)");
	$(document).off("touchstart").on('touchstart',touchStartHandler);
	$(document).off("touchmove").on('touchmove',touchMoveHandler);
	$(document).off("touchend").on('touchend',touchEndHandler);
	
	$(document).one("mobileinit", function () {
				$.mobile.pageContainer = $('#container');
				$.mobile.defaultPageTransition = 'none';
				manageOrientationLayout();
			});
	
};
 function touchStartHandler(event){
		
		touchStart = event.originalEvent.touches[0];
		prevTouch = touchStart ;
		matrix = transMatrixToArray($("#slider").css("transform"));
		initSliderLeft = parseInt(matrix[4] , 10) ;
		preventSwipe = currentSubPage == 1 || currentSubPage == -maxSubPage ;
		disFromStart = 0 ;
 };
 
 function touchMoveHandler(event){
		  
	var touch = event.originalEvent.touches[0];
	disFromStart = touch.pageX - touchStart.pageX ;
	var dis = touch.pageX - prevTouch.pageX ;
		  
	//detecting swipe horizontally , this section should be entered once per swipe
	if( ! isSwiping && Math.abs(disFromStart) > 30 &&(Math.abs(touch.pageY - touchStart.pageY)< 80)){
		isSwiping = true ;
		$("#slider").css("transition-duration", "0s");
	}
		  
	matrix1 = transMatrixToArray($("#slider").css("transform"));
	curTrans = matrix1[4] ;
	$("#debuglog").text("curr: " + currentSubPage + " preventSwipe: " + preventSwipe + " isSwiping: "+isSwiping);
		  
	if( isSwiping){
		event.preventDefault();
		if(preventSwipe){
			if(  (currentSubPage == -maxSubPage  && disFromStart < 0)  || (currentSubPage == 1  && disFromStart > 0)){
				disFromStart = disFromStart /4 ;
			}
		}
		$("#slider").css("transform","translateX("+( initSliderLeft + disFromStart  )+"px)");
		//$("#debuglog").text("disFromStart: " + disFromStart + " initSliderLeft: " + initSliderLeft +" sum : "+parseInt(( disFromStart + initSliderLeft),10) );  	
	}
	prevTouch = touch ;
}
 
 function touchEndHandler(event){
	
	var screenWidth = document.documentElement.clientWidth ;
	var isHorizontalSwipe = (Math.abs(prevTouch.pageY - (touchStart.pageY)< Math.abs(disFromStart)*2)) && isSwiping ;
	var offsetForPanel = 0 ;
	
	isSwiping = false ;
	
	if( (currentSubPage == 1))
	{
		offsetForPanel = panelOfset(screenWidth , isHorizontalSwipe);
	}
	
	if( Math.abs(disFromStart) > (screenWidth /3) && isHorizontalSwipe ){
	
		if(disFromStart > 0){
			currentSubPage++ ;		
		}else{
			currentSubPage-- ;
		}
		
		//$("#debuglog").text("disFromStart: " + disFromStart + " cuurent page: " + currentSubPage +" width : " + screenWidth + " isSwiping " + isSwiping);	
	}
	var titOffset = titleOffset() ;
	
	$("#debuglog").text("disFromStart: " + disFromStart + " cuurent page: " + currentSubPage +" isHorizontalSwipe : " + isHorizontalSwipe + " isSwiping " + isSwiping);
	
	//$("#slider").css("transition-duration", "0.5s");
	$("#titles").css("transform","translateX("+parseInt(((screenWidth * currentSubPage)+ offsetForPanel)/2 + titOffset) +"px)");
	$("#slider").css("transition-duration", "0.5s").css("transform","translateX("+parseInt((screenWidth * currentSubPage)+ offsetForPanel) +"px)");
 }
 
function titleOffset(){
 	
 	if(currentSubPage == 1)
 	{
 		return -30 ;
 	}
 	if(currentSubPage == 0)
 	{
 		return 0 ;
 	}
 	
 	return 30 ;
}
 
function panelOfset(screenWidth , horizSwipe)
{
//$("#debuglog").text("horizSwipe " + horizSwipe + "isPanelOpen " + isPanelOpen);
	if(!horizSwipe)
	{
		if(isPanelOpen)
		{
			return 200 ;
		}else{
			return 0 ;
		}
	}else{
	
		if ( disFromStart < (screenWidth /8))
		{	
				isPanelOpen = false ;
				return 0 ;
		}
		
		if ( disFromStart > (screenWidth /8) || isPanelOpen)
		{	
				isPanelOpen = true ;
				return 200 ;
		}
		
	}
	
	return 200 ;
}
function transMatrixToArray(matrix) {
    return matrix.substr(7, matrix.length - 8).split(', ');
}

// handlig device rotation
function doOnOrientationChange(){
	
	$("#container").css("width",document.documentElement.clientWidth+"px");
	$(".sub_page").css("width",document.documentElement.clientWidth+"px").css("height",document.documentElement.clientHeight+"px");
	$("#cliper").css("width",document.documentElement.clientWidth+"px").css("height",document.documentElement.clientHeight+"px");
	
	 
	
	
	
	var screenWidth = document.documentElement.clientWidth ;
	var currentPageIndex = Number(- Number(currentSubPage) ) + Number(1) ;
	var mul = Number( Number(screenWidth) * Number(currentSubPage) ) ;
	var res = Number( Number(mul) - Number(0)) ;
	
	$("#slider").css("left", Number(- screenWidth) - Number(200)+"px");
	$("#slider").css("transition-duration", "0s").css("transform","translateX("+parseInt(res) +"px)");
	
	$("#debuglog").text("sub page: " + currentSubPage + " width: " + screenWidth + " curr page: " + currentPageIndex +" mul "+ mul + " res " + parseInt(res) + " orientation " + window.orientation);
	
	manageOrientationLayout();
}

function manageOrientationLayout(){
	alert(window.orientation);
	if(window.orientation == -90 || window.orientation == 90)//landscape
	{
		$(".main_solo").addClass("lndscp_solo");
		$(".main_dual").addClass("lndscp_dual");
		$("btn_featured").attr("src" , "images/icons/btn_feat_lndscp.jpg" );
		
	}else{//portrait
		$(".main_solo").removeClass("lndscp_solo");
		$(".main_dual").removeClass("lndscp_dual");
		$("btn_featured").attr("src" , "images/icons/btn_feat.jpg" );
		
	}
}

function closePanel(){
	//$('#left-panel').animate({width:"0px"});
	$('#left-panel').css("width","0px");
}

function openPanel(){
	//alert("entering open panel");
	$('#left-panel').css("width","200px");
	
	
	
}