# Virsical 3.0 JS SDK

## install
```npm
npm install virsical-jssdk --save
```
 
## 调用
```javascript
import virsical from 'virsical-jssdk';
```

## 概述
此JS-SDK是威思客移动办公门户提供给第三方H5应用开发者使用的，可帮助运行于威思客APP内的H5网页获得更多的高级特性。通过使用此JS-SDK，第三方H5应用开发者可快捷地在手机中使用统一认证、拍照、选图、语音、位置、扫一扫等原生手机系统的能力，以此可有效提升用户体验。

## API
```javascript
virsical.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来。
    client_id: '', // 必填，第三方应用接入ID
    client_secret: // 必填，第三方应用接入秘钥
});
```

```javascript
virsical.login({
    success: function (res) {
	var info = res.info; // 返回用户信息json
	alert("Login success" + "-" + info);
    },
	fail: function (res) {
        var msg = res.msg; // 失败原因
	var code = res.code; //失败编码
    }
});
```


```javascript
virsical.captureQR({
	success: function (res) {
		alert("url:" + res.url);
	},
	fail: function (res) {
		var msg = res.msg; // 失败原因
		var code = res.code; //失败编码
		alert("fail" + "-" + msg + "-" + code);
}
});
```