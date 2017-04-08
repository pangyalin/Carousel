/**
 * Created by Administrator on 2017/3/28.
 */
function showTime(tenderid, time_distance) {
    this.tenderid = tenderid;
    this.distance = time_distance * 1000;
}
showTime.prototype.setTimeShow = function() {
    var timer = $("#show_" + this.tenderid);
    var str_time;
    var int_day, int_hour, int_minute, int_second;
    distance = this.distance;
    this.distance = this.distance - 1000;
    if (distance > 0) {
        int_day = Math.floor(distance / 86400000);
        distance -= int_day * 86400000;
        int_hour = Math.floor(distance / 3600000);
        distance -= int_hour * 3600000;
        int_minute = Math.floor(distance / 60000);
        distance -= int_minute * 60000;
        int_second = Math.floor(distance / 1000);
        if (int_hour < 10)
            int_hour = "0" + int_hour;
        if (int_minute < 10)
            int_minute = "0" + int_minute;
        if (int_second < 10)
            int_second = "0" + int_second;
        str_time = int_day + "天" + int_hour + "小时" + int_minute + "分钟" + int_second + "秒";
        timer.text(str_time);
        var self = this;
        setTimeout(function() {
            self.setTimeShow();
        }, 1000);
    } else {
        timer.text("项目已结束");
        return;
    }
};



showTime.prototype.setTimeShowNum = function() {
    var timer = $("#show_" + this.tenderid);
    var str_time;
    var int_hour, int_minute, int_second;
    distance = this.distance;
    this.distance = this.distance - 1000;
    if (distance > 0) {
        int_hour = Math.floor(distance / 3600000);
        distance -= int_hour * 3600000;
        int_minute = Math.floor(distance / 60000);
        distance -= int_minute * 60000;
        int_second = Math.floor(distance / 1000);
        if (int_hour < 10)
            int_hour = "0" + int_hour;
        if (int_minute < 10)
            int_minute = "0" + int_minute;
        if (int_second < 10)
            int_second = "0" + int_second;
        if(int_hour == 0){
            str_time = int_minute + ":" + int_second;
        }else{
            str_time = int_hour + ":" + int_minute + ":" + int_second;
        }
        timer.text(str_time);
        var self = this;
        setTimeout(function() {
            self.setTimeShowNum();
        }, 1000);
    } else {
        timer.text("项目已结束");
        return;
    }
};



$(function() {
    var browser;
    var agent = navigator.userAgent.toLowerCase();
    var regStr_ie = /msie [\d.]+;/gi;
    if (agent.indexOf("msie") > 0)
    {
        browser = agent.match(regStr_ie);
        browser = (browser + "").replace(/[^0-9.]/ig, "");
        if (browser * 1 < 7) {
            location.href = './browser.html';
        }
    }

    $("a.image_gall").popImage();
});

/**
 * 帮助中心
 * @param {type} obj
 * @returns {undefined}
 */
function helpOnClick(obj) {
    $("em.ico").removeClass('ico-cms-show');
    $("em.ico").addClass('ico-cms-hide');
    $(obj).find('em').removeClass('ico-cms-hide');
    $(obj).find('em').addClass('ico-cms-show');
    $(".help-content").hide();
    $(obj).closest("div").next().show();
}
(function($) {
    $.fn.popImage = function(options) {
        var s = $.extend({}, $.fn.popImage.defaultSettings, options || {});
        if ($("#popImage_cache").length == 0) {
            $("<div id='popImage_cache'></div><div class='popImage_close'></div>").appendTo("body");
        }
        var item_num = $("#popImage_cache img").length;
        return this.each(function(index) {
            var $$ = $(this),
                iw = $$.outerWidth(),
                ih = $$.outerHeight(),
                imgUrl = this[s.tagName],
                index = item_num + index,
                this_id = "slide" + index;
            if (!imgUrl) {
                imgUrl = $$.attr(s.tagName);
            }
            $('<img src="' + imgUrl + '" class="popImage_cached ' + this_id + '" title="点击关闭"/>').appendTo("#popImage_cache").hide();
            $$.click(function(e) {
                var animate_image = $('#popImage_cache .' + this_id),
                    w_w = $(window).width(),
                    w_h = $(window).height(),
                    st = $(window).scrollTop();
                $('.popImage_close').hide();
                e.preventDefault();
                position = $$.offset(),
                    o_h = animate_image.height(),
                    o_w = animate_image.width();

                var t = st + (w_h - o_h) / 2,
                    l = (w_w - o_w) / 2;

                animate_image.css({'left': position.left, 'top': position.top, 'height': ih, 'width': iw});
                $('.popImage_cached').hide();
                animate_image.show().fadeTo(0, 0.9);
                animate_image.animate({'left': l, 'top': t, 'height': o_h, 'width': o_w, 'opacity': 1}, s.timeOut, function() {
                    var position2 = animate_image.offset();
                    $('.popImage_close').css({'left': position2.left + o_w - 6, 'top': position2.top - 15}).show();
                });
            });
            $('.popImage_close,.popImage_cached').bind('click', function(a) {
                $('.popImage_close').hide();
                $('.popImage_cached').fadeOut(400);
                a.preventDefault();
            });
        });
    };
    $.fn.popImage.defaultSettings = {
        "tagName": "href",
        "timeOut": "600"
    };
})(jQuery);