
window.addEventListener('load', function () {
    console.log("loaded?")
    
    function onDeviceReady() {
        //console.log($('.rg-image'),$('.rg-image img'))
        
        function makeItHappen() {
         console.log("I'm a deamon!"+$('.rg-image').size())
           if ($('.rg-image').size() == 0) {
                setTimeout(makeItHappen, 250);
                return;
            }
            $('.rg-image').on('click', function () {
                
                //console.log("doh : "+$(".fullImage img").size());
                $(".fullImage img").attr("src", $(this).children('img').attr('src'));
                $(".fullImage").show();
                //$('body').append('<div class="fullImage"><img src="'+$(this).children('img').attr('src')+'"/></div>');
                //affichage en fullScreen proportionner
                var wh = $(document).height();
                var ih = $(".fullImage img").height();
                var ptop = (wh - ih) / 2;
                $(".fullImage img").css("margin-top", ptop + "px");
            });
        }
        makeItHappen();
    }
    
    
    document.addEventListener('deviceready', onDeviceReady , false);
    document.addEventListener("backbutton", function () {
        if ($(".fullImage").is(":visible")) {
            $('.fullImage').hide();
        }
        //					$('.fullImage').remove();
    }, false);
    $(".fullImage").click(function(){
        $(this).hide();
    })
 //   $(document).bind('deviceready',onDeviceReady).trigger('deviceready')
}, false)

//fonction pour renverser l'affichage
$(function () {
    console.log("document.ready done!")
    var countBeforeStopTrying = 10;
    //on renverse les sliders
    function reverse() {
        var layoutUp = $("#rg-gallery .rg-thumbs");
        var displayDown = $("#rg-gallery .rg-image-wrapper");

        if (layoutUp.size() == 0 || displayDown.size() == 0) {
            if (countBeforeStopTrying > 0) {
                countBeforeStopTrying--;
                setTimeout(reverse, 200);
            }
        } else {
            layoutUp.before(displayDown);
        }
    } reverse();

    $.ajax({
        //crossOrigin: true,
        //crossDomain: true,
        dataType:"jsonp",
		//contentType:"application/xml",
        url: "https://ftrybizdev.blob.core.windows.net:443/cgidemo?restype=container&comp=list"
    }).done(function (result) {
        console.log(arguments[2].responseText);
        //alert(result)
        for (var i = 0; i < arguments.length; i++) {
        }
    }).fail(function (a,b) {
        //alert(b)
        console.log(arguments[2].responseText);
        for (var i = 0; i < arguments.length; i++) {

        }
    }).always(function (a,b) {
        //alert(b)
        console.log(arguments[2].responseText);
        for (var i = 0; i < arguments.length; i++) {

        }
    });
    
    displayWinSize();
})

//window.addEventListener("orientationchange", function(){
//        $('.es-carousel li').show();
//   //if (orientation == portrait)
//        $('.es-carousel li:gt(2)').hide();
//    //else
//        $('.es-carousel li:gt(8)').hide();
//   
//    console.log('Orientation changed to ' + screen.orientation.type);
//});

//appel fonction sur le blob

var image = new Image();
    image.onload = function(){
        document.body.appendChild(image);
	};
	
	$(function() {
			
				setTimeout(function() {
					$("#carouB").append("<img src='i.jpg' width='250px'/><img src='c.jpg' width='250px'/><img src='d.jpg' width='250px'/><img src='e.jpg' width='250px'/><img src='f.jpg' width='250px'/><img src='g.jpg' width='250px'/><img src='h.jpg' width='250px'/><img src='i.jpg' width='250px'/>")
					$("#carouB").get(0).carouData.landscapeSetting.onResize(true)
				},5000)

	})
	
    $(function() {
			
		setTimeout(function() {
		    $("#carouB").append("<img src='i.jpg' width='250px'/><img src='c.jpg' width='250px'/><img src='d.jpg' width='250px'/><img src='e.jpg' width='250px'/><img src='f.jpg' width='250px'/><img src='g.jpg' width='250px'/><img src='h.jpg' width='250px'/><img src='i.jpg' width='250px'/>")
		    $("#carouB").get(0).carouData.landscapeSetting.onResize(true)
		    },5000)

    })	
	
    //image.src = 'https://ftrybizdev.blob.core.windows.net/cgidemo/WP_20150614_006.jpg';

//    var image = new Image();
//    image.onload = function(){
//	/* faire ton code ici */
//	$.ajax({
//	    //crossOrigin: true,
//	    //crossDomain: true,
//	    dataType:"jsonp",
//		    //contentType:"application/xml",
//	    url: "https://ftrybizdev.blob.core.windows.net:443/cgidemo?restype=container&comp=list"
//	}).done(function (result) {
//	    console.log(arguments[2].responseText);
//	    //alert(result)
//	    for (var i = 0; i < arguments.length; i++) {
//	    }
//	}).fail(function (a,b) {
//	    //alert(b)
//	    console.log(arguments[2].responseText);
//	    for (var i = 0; i < arguments.length; i++) {
//    
//	    }
//	}).always(function (a,b) {
//	    //alert(b)
//	    console.log(arguments[2].responseText);
//	    for (var i = 0; i < arguments.length; i++) {
//    
//	    }
//	});
//    
//    
//    };

//function displayWinSize() {
//   $("#winsize").text($(window).width()+" / "+$(window).height())
//   ajustThumbs($(window).width(), $(window).height());
//}
//
//function ajustThumbs(w, h) {
//    var nb = 9;
//    
//    if (h > w) {
//	nb = 3;
//    }
//    
//    var thumbsInWidth = $(".es-carousel").innerWidth();
//    var wForImg = thumbsInWidth/nb;
//    
//    $(".es-carousel img").attr("width", wForImg+"px");
//    
//}
//
//
//$(window).bind("resize",displayWinSize)

