// 星际驿站碎裂小组件全局动画脚本（支持前9次渐进碎裂，第10次全屏显示StarRiver.jpg，进入/退出星空均为渐入渐出，2秒内未连续点击自动恢复，星空状态下点击页面立即渐退）
$(function(){
    var clickCount = 0;
    var logo = $('#starinnLogo');
    var formBlock = $('#starinnFormBlock');
    var blackout = $('#starinnBlackout');
    var blackoutImg = $('#starinnBlackoutImg');
    var bg = $('body.starinn-bg');
    var footer = $('.starinn-footer');
    var clickTimer = null;
    var shatterTimeout = null;
    var restoreTimeout = null;
    var fadeDuration = 1200;
    var clickInterval = 2000;
    var inStarRiver = false;

    function clearFragClass() {
        for(var i=1;i<=9;i++){
            logo.removeClass('frag-'+i);
            formBlock.removeClass('frag-'+i);
            bg.removeClass('frag-'+i);
        }
    }
    function setFragClass(level) {
        clearFragClass();
        if(level>0 && level<=9){
            logo.addClass('frag-'+level);
            formBlock.addClass('frag-'+level);
            bg.addClass('frag-'+level);
        }
    }
    function shatterAll() {
        clearFragClass();
        logo.addClass('broken');
        formBlock.addClass('broken');
        bg.addClass('broken');
        footer.hide();
    }
    function showStarRiver() {
        inStarRiver = true;
        bg.removeClass('broken');
        bg.removeClass(function (i, c) { return (c.match(/frag-\d+/g)||[]).join(' '); });
        bg.addClass('starriver-fadein');
        setTimeout(function(){
            bg.removeClass('starriver-fadein').addClass('starriver');
            logo.hide();
            formBlock.hide();
            footer.hide();
            blackout.addClass('active');
            blackoutImg.show();
        }, fadeDuration);
        // 10秒后自动恢复
        restoreTimeout = setTimeout(restoreScreen, 10000);
    }
    function restoreScreen() {
        if (!inStarRiver) return;
        inStarRiver = false;
        if(restoreTimeout) clearTimeout(restoreTimeout);
        blackout.removeClass('active');
        blackoutImg.hide();
        bg.removeClass('starriver').addClass('starriver-fadeout');
        setTimeout(function(){
            bg.removeClass('starriver-fadeout');
            logo.removeClass('broken').show();
            formBlock.removeClass('broken').show();
            clearFragClass();
            clickCount = 0;
            footer.show();
        }, fadeDuration);
    }
    function resetIfNoClick() {
        if(clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(function(){
            if(clickCount > 0 && clickCount < 10) {
                clearFragClass();
                clickCount = 0;
            }
        }, clickInterval);
    }
    logo.on('click', function(){
        if (inStarRiver) return;
        clickCount++;
        if(clickCount < 10) {
            setFragClass(clickCount);
            resetIfNoClick();
        } else if(clickCount === 10) {
            if(clickTimer) clearTimeout(clickTimer);
            shatterAll();
            setTimeout(function(){
                showStarRiver();
            }, fadeDuration);
        }
    });
    // 星空状态下点击页面立即渐退
    $(document).on('click', function(e){
        if(inStarRiver && !$(e.target).is('#starinnLogo')) {
            restoreScreen();
        }
    });
    blackout.on('click', function(){
        // 展示StarRiver期间点击无效（由document全局处理）
    });
});

