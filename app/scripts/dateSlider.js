$.fn.dateSlider = function (options) {
    var SPECIAL_WIDTH = 37;
    
    
    function nearest(values, v) {
        var nearest = values[0];
        var least = Math.abs(values[0] - v);
        for (var i = 0; i < values.length; i++) {
            var distance = Math.abs(values[i] - v);
            if (distance < least) {
                nearest = values[i];
                least = distance
            }
        }
        return nearest;
    }
    
    
    var slider = $(this);
    var time = slider.find(".time");
    var tipsy = slider.find(".tipsy");
    // Get total size reference
    var total = time.width();

    var leftHandle = slider.find(".handle.left");
    var rightHandle = slider.find(".handle.right");
    
    var line = slider.find(".line");
    
    var pos = function(el){
        return function() {
            return parseInt(el.css("left"), 10);
        };
    };
    var lPos = pos(leftHandle);
    var rPos = pos(rightHandle);
    
    var years = time.children(".years").children().map(function (e){
        return {
            special: !$(this).hasClass("year"),
            type: $(this).attr("class"), 
            value: $(this).text()
        };
    }).get();
    
    var specialYears = years.filter(function(e) {
        return e.special;
    }).length;
    var normalYears = years.length - specialYears;
    
    var yearsH = {};
    var yearsA = [];
    for (var i = 0; i < specialYears; i++) {
        yearsH[i*SPECIAL_WIDTH] = years[i].value;
        yearsA.push(i*SPECIAL_WIDTH);
    }
    
    var reserved = (specialYears) * SPECIAL_WIDTH;
    var remaining = total - reserved;
    var space = remaining / (normalYears - 1);
    for (var i = 0; i < normalYears; i++) {
        var x = Math.round(reserved + space * i);
        yearsH[x] = years[i + specialYears].value;
        yearsA.push(x);
    }
    
    // Helper method to redraw blueline.
    var updateLine = function() {
        line.css("left", lPos()+"px")
            .css("width", (rPos()-lPos())+"px");
    };
    
    var interval = undefined;
    var hideTipsy = function() {
        clearInterval(interval);
        interval = setInterval(function(){tipsy.fadeOut();},1000);
    }
    
    var init = function (handle, memo) {
        // Set helper text
        tipsy.find("span").text(yearsH[memo.handleX]);
        clearInterval(interval);
        tipsy.fadeIn(50);
        tipsy.css("left", (handle.offset().left - 17) + "px");
        tipsy.css("top", (handle.offset().top - 34) + "px");
    };
    
    var move = function (handle, memo, x) {
        var target = memo.handleX + x - memo.origX;
        var near = nearest(yearsA, target);
        // Move handle
        handle.css("left", near + "px");
        // Update helper text
        tipsy.find("span").text(yearsH[near]);
        tipsy.css("left", (handle.offset().left - 17) + "px");
        // Redraw blue line
        updateLine();
    };
    var up = function (handle, memo) {
        // Get back positions and report them.
        var lValue = yearsH[lPos()];
        var rValue = yearsH[rPos()];
        var onChange = options.onChange || function (l, r) {};
        onChange(lValue, rValue);
        
        // hide helper text
        hideTipsy();
    }

    if (options.initial.left) {
        leftHandle.css("left", yearsH[options.initial.left] + "px");
    }
    if (options.initial.right) {
        rightHandle.css("left", yearsH[options.initial.right] + "px");
    }

    updateLine();

    slider.find(".handle").mousedown(function (e) {
        var handle = $(this);


        // Get start values when mouse has pressed down
        var memo = {
            origX: e.clientX,
            handleX: parseInt(handle.css("left"), 10)
        };
        
        init(handle, memo);

        $(document.body).mousemove(function (e) {
            // Call everytime the mouse moves.
            move(handle, memo, e.clientX);
        }).mouseup(function (e) {
            // User has stopped pressing down
            // Unbind every callback to user's mouse
            $(document.body).off("mousemove mouseup");
            
            up(handle, memo);
        });
    });
    slider.find(".handle").bind("touchstart", function (e) {
        e.preventDefault();
        var evt = e.originalEvent;
        var handle = $(this);
        var touches = evt.changedTouches;
        var touche = touches[0];

        // Get start values when mouse has pressed down
        var memo = {
            origX: touche.pageX,
            handleX: parseInt(handle.css("left"), 10)
        };
        
        init(handle, memo);

        $(document.body).bind("touchmove", function (e) {
            e.preventDefault();
            var evt = e.originalEvent;
            
            var touches = evt.changedTouches;
            var touche = touches[0];
            
            // Call everytime the mouse moves.
            move(handle, memo, touche.pageX);
        }).bind("touchend", function (e) {
            // User has stopped pressing down
            $(document.body).off("touchmove touchend");
            
            up(handle, memo);
        });
    });
    
};