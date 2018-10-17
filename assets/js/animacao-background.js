$(document).ready(function(){
  
        generateSmallGlows(20);
        const speed = 15; // uses it's local speed

        // animates the small glows in a circular motion
        $('.small-glow').each(function(){
            let speedDelta = Math.floor(Math.random()*8);
            let radius = Math.floor(Math.random()*20)+20;
            TweenMax.to($(this), speed+speedDelta, {rotation: 360, transformOrigin: "-"+radius+"px -"+radius+"px", repeat: -1, ease: Power0.easeNone});
        })

        var wavet = TweenMax.to('.top_wave', 0.6, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave1 = TweenMax.to('.wave1', 0.7, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave2 = TweenMax.to('.wave2', 0.75, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave3 = TweenMax.to('.wave3', 0.75, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave4 = TweenMax.to('.wave4', 0.75, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});

        var mount1 = TweenMax.to('.mount1', 120, {backgroundPositionX: '-=1760px', repeat: -1, ease: Power0.easeNone});
        var mount2 = TweenMax.to('.mount2', 150, {backgroundPositionX: '-=1782px', repeat: -1, ease: Power0.easeNone});

        var clouds = TweenMax.to('.clouds', 45, {backgroundPositionX: '-=1001px', repeat: -1, ease: Power0.easeNone});  
})

function generateSmallGlows(number) {
    var h = $(window).height();
    var w = $(window).width();

    for(var i = 0; i < number; i++) {
        var left = Math.floor(Math.random()*w);
        var top = Math.floor(Math.random()*(h/2));
        var size = Math.floor(Math.random()*8) + 4;
        $('.small-glows').prepend('<div class="small-glow"></div>');
        let noise = $('.small-glows .small-glow').first();
        noise.css({left: left, top: top, height: size, width: size});
    }
}