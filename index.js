;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.Virsical = factory()
}(this, (function () {
    'use strict';
    var Virsical;
    Virsical = new Object;
    var isDebugger = false;

    const _platform_other = 0;
    const _platform_android = 1;
    const _platform_ios = 2;


    function setHadConfig(){
        sessionStorage.setItem("configStatus",true);
    }

    //做为是否config成功的标志，此处仅demo，实际需要考虑加密
    function hadConfig(){
//        return sessionStorage.getItem("configStatus");
        return true;
    }

    function getPlatform(){
        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){ //android终端
            return _platform_android;
//        }else(!!u.match(/\(i[^;]+;(U;)?CPU.+MacOSX/)){ //ios终端
//            return _platform_ios;
        } else{// 其他设备
            return _platform_other;
        }
    }


    //绑定第三方应用分配的client_id和client_secret
    Virsical.config = function(info){
        if(getPlatform()==_platform_android){
            window.control.config(info.debug, info.client_id, info.client_secret);
            isDebugger = info.debug();
        } else if(getPlatform()==_platform_ios){
            //TODO ios
        }
    }

    var configReadyCallback;
    Virsical.ready = function(callbackFunction){
        configReadyCallback = callbackFunction;
    }

    //webview调用，config成功
    function configReady(){
        setHadConfig();
        configReadyCallback && configReadyCallback();
    }

    var configErrorCallback;
    Virsical.error = function(callbackFunction){
        configErrorCallback = callbackFunction;
    };

    //webview调用，config失败
    function configError(){
        configReadyCallback && configReadyCallback({
            msg: mg,
            code: cd
        });
    }

    var loginTimer;
    var login_timeout_during = 60*1000;
    var login_timeout_code = 200;

    var loginSuccessCallback;
    var loginFailCallback;
    //设置登录超时回调方法
    Virsical.login = function(callbackFunction){
        if(!hadConfig()){
            alert("Please config app first");
            return;
        }

        loginSuccessCallback = callbackFunction.success;
        loginFailCallback = callbackFunction.fail;

        // loginTimer = setTimeout(loginTimeout(), login_timeout_during);

        if(getPlatform()==_platform_android){
            window.control.login();
        }else if(getPlatform()==_platform_ios){
            //TODO ios
        }
    }

    //登录超时处理
    function loginTimeout(){
        loginResult("1", "", login_timeout_code, "Engineer no response");
    }

    //webview调用，返回登录结果信息
    function loginResult(result, json, cd, mg){
        clearTimeout(loginTimer);
        if (result == 0){
            loginSuccessCallback && loginSuccessCallback({
                info: json
            });
        } else {
            loginFailCallback && loginFailCallback({
                msg: mg,
                code: cd
            });
        }
    }


    var selectImageSuccessCallback;
    //选择图片
    Virsical.selectImage = function(info){
        if(!hadConfig()){
            alert("Please config app first");
            return;
        }
        selectImageSuccessCallback = info.successCallback;
        if(getPlatform()==_platform_android){
            window.image.selectOne();
        }else if(getPlatform()==_platform_ios){
            //TODO ios
        }
    };

    //webview调用，返回选择的图片信息
    function imageResult(ids){
        selectImageSuccessCallback({
            localIds: ids
        });
    }


    //预览图片
    Virsical.previewImage = function(info){
        if(!hadConfig()){
            alert("Please config app first");
            return;
        }
        if(getPlatform()==_platform_android){
            window.image.show(info.ids);
        }else if(getPlatform()==_platform_ios){
            //TODO ios
        }
    }

    var locationTimer;
    var location_timeout_during = 60*1000;
    var location_timeout_code = 200;

    var locationSuccessCallback;
    var locationFailCallback;
    //设置定位超时回调方法
    Virsical.location = function(callbackFunction){
        if(!hadConfig()){
            alert("Please config app first");
            return;
        }
        locationTimer = setTimeout("locationTimeout()", location_timeout_during);
        locationSuccessCallback = callbackFunction.success;
        locationFailCallback = callbackFunction.fail;
        if(getPlatform()==_platform_android){
            window.map.location();
        }else if(getPlatform()==_platform_ios){
            //TODO ios
        }
    }

    //定位超时处理
    function locationTimeout(){
        locationResult("1", "", "", login_timeout_code, "Engineer no response");
    }

    //webview调用，返回登录结果信息
    function locationResult(result, addr, lat, lng, cd, mg){
        clearTimeout(locationTimer);
        if (result == 0){
            locationSuccessCallback({
                addr: addr,
                lat: lat,
                lng: lng
            });
        }else{
            locationFailCallback({
                msg: mg,
                code: cd
            });
        }
    }

    var workspaceSuccessCallback;
    var workspaceFailCallback;
    //扫描二维码
    Virsical.captureQR = function(callbackFunction){
        if(!hadConfig()){
            alert("Please config app first");
            return;
        }
        workspaceSuccessCallback = callbackFunction.success;
        workspaceFailCallback = callbackFunction.fail;
        if(getPlatform()==_platform_android){
            window.captureqr.scan();
        }else if(getPlatform()==_platform_ios){
            //TODO ios
        }
    }

    //webview调用，返回扫描结果信息
    function captureQRResult(result, url, cd, mg){
        if (result == 0){
            workspaceSuccessCallback({
                url: url
            });
        }else{
            workspaceFailCallback({
                msg: mg,
                code: cd
            });
        }
    }

    window.configReady = configReady;
    window.configError = configError;
    window.loginResult = loginResult;
    window.imageResult = imageResult;
    window.locationResult = locationResult;
    window.captureQRResult = captureQRResult;

    return Virsical;
})));


