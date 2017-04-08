/**
 * Created by Administrator on 2017/3/28.
 */
String.prototype.endWith = function(str) {
    if (str == null || str == "" || this.length == 0
        || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}
String.prototype.startWith = function(str) {
    if (str == null || str == "" || this.length == 0
        || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}


$(function(){


    $.extend($.Datatype,{
        "amount": function(gets,obj,curform,datatype) {
            var re = /^[0-9]+.?[0-9]{0,2}$/;
            if(!re.test(gets)) {
                return false;
            }
            if(gets <= 0) {
                return false;
            }
            if(gets > 1000000) {
                return false;
            }
            return true;
        },
        "zh2-4" : /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/,
        "zhName" : function(gets,obj,curform,datatype) {
            obj.val(gets);
            var re = /^[\u4E00-\u9FA5\uf900-\ufa2d]+[\u00B7]?[\u4E00-\u9FA5\uf900-\ufa2d]+$/;
            return gets != null && gets.length >= 2 && gets.length <= 15 && re.test(gets);
        },
        "idcard" : function(gets,obj,curform,datatype) {
            var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子;
            var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值，10代表X;
            if (gets.length == 15) {
                return isValidityBrithBy15IdCard(gets);
            }else if (gets.length == 18){
                var a_idCard = gets.split("");// 得到身份证数组
                if (isValidityBrithBy18IdCard(gets)&&isTrueValidateCodeBy18IdCard(a_idCard)) {
                    return true;
                }
                return false;
            }
            return false;

            function isTrueValidateCodeBy18IdCard(a_idCard) {
                var sum = 0; // 声明加权求和变量
                if (a_idCard[17].toLowerCase() == 'x') {
                    a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
                }
                for ( var i = 0; i < 17; i++) {
                    sum += Wi[i] * a_idCard[i];// 加权求和
                }
                valCodePosition = sum % 11;// 得到验证码所位置
                if (a_idCard[17] == ValideCode[valCodePosition]) {
                    return true;
                }
                return false;
            }

            function isValidityBrithBy18IdCard(idCard18){
                var year = idCard18.substring(6,10);
                var month = idCard18.substring(10,12);
                var day = idCard18.substring(12,14);
                var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
                // 这里用getFullYear()获取年份，避免千年虫问题
                if(temp_date.getFullYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
                    return false;
                }
                return true;
            }

            function isValidityBrithBy15IdCard(idCard15){
                var year =  idCard15.substring(6,8);
                var month = idCard15.substring(8,10);
                var day = idCard15.substring(10,12);
                var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
                // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
                if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
                    return false;
                }
                return true;
            }
        }

    });


    //验证码
    $('img[ftype="vcode"]').live('click', function(){
        $(this).attr('src', $(this).attr('furl') + '?' + Math.random());
    });

    $('form[ftype="valid"]').each(function(){
        var form = $(this);
        var submitBtn = form.find('[ftype="submit"]');
        var submitBtnOldText = submitBtn.val();
        var goUrl = form.attr('fgo') == undefined ? '' : form.attr('fgo');
        var ajax = form.attr('ajax') == 'true' ? true : false;
        var tiptype = form.attr('tiptype') == undefined ? '3' : form.attr('tiptype');

        var target = form.attr('target') == undefined ? '' : form.attr('target');
        /**
         * 活动-地址
         */
        var hdhref = form.attr('hdhref') == undefined ?  null: form.attr('hdhref');
        var fgoType = form.attr('fgoType') == undefined ?  null: form.attr('fgoType');
        /**
         * 活动子窗口
         */
        var zck = form.attr('zck') == 'true' ?  true : false;
        var valid = $(this).Validform({
            ajaxPost:ajax,
            postonce:false,
            tiptype:tiptype,
            beforeSubmit : function() {

                if(typeof recheckTwo == 'function') {
                    if(!recheckTwo()) {
                        return false;
                    }
                }
                var errObj = document.getElementById("Validform_wrong_id");
                if(null != errObj){
                    return false;
                }
                submitBtn.attr('disabled', "true");
                submitBtn.val("提交中...");
            },
            callback : function(json) {
                if(typeof callbackFormPage == 'function') {
                    $.Hidemsg();
                    callbackFormPage(json);
                    return;
                }

                if(!(fgoType == 'open' && (json.status == 1 || json.status == 200))) {
                    $.Showmsg(json.message);
                }

                if(json.message=="注册成功"){
                    /**
                     * mark肖杨:活动
                     */
                    if(hdhref!=null){
                        window.location.href=hdhref;
                    }
                    if(zck){
                        window.parent.location.href=hdhref;
                    }
                }
                setTimeout(function(){
                    $.Hidemsg(); //公用方法关闭信息提示框;显示方法是$.Showmsg("message goes here.");
                },2000);



                if(json.status != 1 && json.status != 200) {
                    submitBtn.removeAttr("disabled");
                    submitBtn.val(submitBtnOldText);
                    $('img[ftype="vcode"]').click();
                    return;
                }
                if(json.ext != undefined && json.ext != "") {
                    if(json.ext.gourl != undefined && json.ext.gourl != "") {
                        setTimeout(function(){
                            if(target == "_parent"){
                                parent.location.href = json.ext.gourl;
                            }else{
                                location.href = json.ext.gourl;
                            }
                        },1000);
                        return;
                    }
                }
                if(goUrl) {
                    setTimeout(function(){
                        if(fgoType == 'open'){
                            opennew();
                        }else{
                            location.href = goUrl;
                        }

                    },1000);
                    return;
                }
                //对话框提交操作
                if(dialogPost) {
                    setTimeout(function(){
                        window.parent.location.reload();
                    },2000);
                    return;
                }
                valid.resetForm();
            }
        });
        valid.addRule(
            [{ele:":checkbox:first",datatype:"*"}]
        );
    });

    $('a[ftype="view"]').click(function(){
        var url = $(this).attr('furl');
        var title = $(this).attr('ftitle');
        var width = parseInt($(this).attr('fwidth'));
        var height = parseInt($(this).attr('fheight'));
        //alert(width + ' ' + height);
        art.dialog.open(url, {
            id: 'IFRAME_VIEW',
            title: title,
            lock: 'true',
            window: 'top',
            width: width,
            height: height
        });
    });

    $('[ftype="submit"]').click(function(){
        $(this).closest('form').submit();
    });

    /**
     * 发送短信验证码
     */
    $('*[ftype="sendsms"]').click(function(){

        $(this).addClass("gray-btn");
        var vcode = $('#imgCode') == undefined ? false : $('#imgCode');
        var target = $(this).attr('ftarget') == undefined ? false : $(this).attr('ftarget');
        var gflag = $(this).attr('gflag')== undefined ? false : $(this).attr('gflag');
        var showErrorMsg = $(this).attr('showErrorMsg')== undefined ? false : $(this).attr('showErrorMsg');
        var postData = {};
        if(target) {
            var input = $('#' + target);
            var mobile = input.val();

            if(mobile == '') {
                input.focus();
                $(this).removeClass("gray-btn");
                return;
            }
            var vcodeVal = "";
            if(vcode && vcode.length > 0){
                vcodeVal = $.trim(vcode.val());
                if(vcodeVal.length == 0){
                    $.Showmsg("请输入图片验证码");
                    $(this).removeClass("gray-btn");
                    return;
                }
                if(vcodeVal.length != 4){
                    $.Showmsg("图片验证码格式不正确");
                    $(this).removeClass("gray-btn");
                    return;
                }
                postData = {mobile:mobile,vcode:vcodeVal};
            }else{
                postData = {mobile:mobile};
            }

        }
        var sendUrl = $(this).attr('fsendurl') == undefined ? false : $(this).attr('fsendurl');
        allFlag = false;
        shareObj = $(this);
        ajaxPost(sendUrl, postData, function(json){
            if(json.status != 1) {
                allFlag = true;
                $.Showmsg(json.message);
                $('img[ftype="vcode"]').click();
                return;
            }
            $.Showmsg("手机短信发送成功，请注意查收");
            setTimeout(function(){
                $.Hidemsg();
            },2000);
        });
        if(!gflag) {
            timerCount(60);
        }
    });

    //删除链接
    $('a[ftype="ajax"]').click(function(){

        var check = $(this).attr('fcheck');
        var msg = $(this).attr('fmsg');
        var url = $(this).attr('furl');
        var fresh = $(this).attr('fresh');

        if(msg == undefined || msg == "") {
            msg = "OK？";
        }

        if(check == 'true') {
            var dialog = art.dialog.prompt('<p>' + msg + '</p><br/>请输入审核密码！', function(data){
                if(data == "") {
                    art.dialog.tips('请输入支付密码！', 1);
                    return false;
                }

                ajaxGet(url, {paypwd:data}, function(json){
                    if(json.code == '0') {
                        location.reload();
                    } else {
                        dialog.close();
                        art.dialog.tips(json.message, 1);
                        setTimeout(function(){
                            location.reload();
                        },2000);
                    }
                });
                return false;
            });
        } else {
            var dialog = art.dialog.confirm(msg, function(){
                ajaxGet(url, {}, function(json){
                    if(json.code == '0') {
                        location.reload();
                    } else {
                        dialog.close();
                        art.dialog.tips(json.message, 1);
                    }
                    if(fresh == 'true') {
                        setTimeout(function(){
                            location.reload();
                        },2000);
                    }
                });
                return false;
            });
        }
    });

});

var shareObj = null;
var allFlag = false;

function timerCount(step)
{
    step = step <= 120 && step >= 0 ? step : 120;
    step = step - 1;
    shareObj.html("等待"+step + "秒").attr("disabled", true);
    if (step <= 0 || allFlag) {
        shareObj.html("免费获取").removeAttr("disabled");
        $(shareObj).removeClass("gray-btn");
    } else {
        window.setTimeout("timerCount(" + step + ")", 1000);
    }
}

function showLoading()
{
    var title = arguments[0] ? arguments[0] : '处理中';
    var msg = arguments[1] ? arguments[1] : '提交中，请稍后！';
    art.dialog({id:'ID_WATINGBOX',content:'<div class="mt-dialog"><img src="' + PATH_SITE + '/images/loadding.gif" align="absmiddle" /> ' + msg + '</div>',lock:true,title:title});
}

function showDialog(title,content,time)
{
    if(time == undefined || time == '')
        time = 1.5;

    if(time == -1)
        art.dialog({id:'ID_WATINGBOX'}).title(title).content('<div class="mt-dialog">' + content + '</div>');
    else
        art.dialog({id:'ID_WATINGBOX'}).title(title).content('<div class="mt-dialog">' + content + '</div>').time(time);
}

function closeDialog()
{
    art.dialog({id:'ID_WATINGBOX'}).close();
}
var dataType = "json";
function ajaxRequest(url, type, data, callfunc) {
    //showLoading();
    $.ajax({
        type: type,
        url: url,
        data: data,
        timeout : 120000,
        dataType: dataType,
        cache:false,
        success: function(responseText){
            var json = responseText;
            //if(!IsJsonObject(responseText))
            //	json = eval("("+responseText+")");
            closeDialog();
            callfunc(json);
        },
        error: function(xhr, status, error) {
            //for(var i in xhr)
            //{
            //	alert(xhr[i]);
            //}
            //alert(xhr + "ffffffffffffff" + status + "  ddd   " + error);
            showDialog('服务器忙', error);
        }
    });
}

function ajaxPost(url, data, callfunc) {
    ajaxRequest(url, "POST", data, callfunc);
}

function ajaxHtml(url, data, callfunc) {
    dataType = "html";
    ajaxRequest(url, "POST", data, callfunc);
}

function ajaxGet(url, data, callfunc) {
    ajaxRequest(url, "GET", data, callfunc);
}

String.prototype.trim=function() {

    return this.replace(/(^\s*)|(\s*$)/g,'');
}

/** 检验身份证号码格式 */
function IDCardCheck(num) {
    if('' == num){
        return;
    }
    num = num.trim();// 去掉前后空格
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            // alert('输入的身份证号里出生日期不对！');
            return false;
        }
        else {
            //将15位身份证转成18位
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            // alert(dtmBirth.getYear());
            // alert(arrSplit[2]);
            // alert('输入的身份证号里出生日期不对！');
            return false;
        }
        else {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                //alert('18位身份证的校验码不正确！'); //应该为： + valnum
                return false;
            }
            return true;
        }
    }
    return false;
}