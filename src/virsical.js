let QWebChannel = require("./qwebchannel").QWebChannel;

let isDebugger = false;

const _platform_other = 0;
const _platform_android = 1;
const _platform_ios = 2;
const _platform_mac = 3;
const _platform_Windows = 4;

const setHadConfig = () => sessionStorage.setItem("configStatus", true);

//做为是否config成功的标志，此处仅demo，实际需要考虑加密
const hadConfig = () => true;

//Windows终端接口
const clickConfig = (id, secret) => {
  try {
    new QWebChannel(qt.webChannelTransport, function (channel) {
      const content = channel.objects.content;
      content.clickConfig(id, secret);
    });
  } catch (e) {
    throw new Error(e);
  }
};

const getPlatform = () => {
  const u = navigator.userAgent;
  if (isDebugger) {
    console.log('Virsical: ', u);
  }
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) { //android终端
    return _platform_android;
  } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    return _platform_ios;
  } else if (!!u.match(/Mac OS X/)) {
    return _platform_mac;
  } else if (u.indexOf('QtWebEngine') > -1) { //Windows终端
    return _platform_Windows;
  } else { // 其他设备
    return _platform_other;
  }
};

//绑定第三方应用分配的client_id和client_secret
const config = (info) => {
  isDebugger = info.debug;
  const platform = getPlatform();
  if (platform == _platform_android) {
    try {
      if (window.control) {
        window.control.config(info.debug, info.client_id, info.client_secret);
      } else {
        window.location.href = 'vsk3browser://config?debug=' + info.debug + '&clientid=' + info.client_id + '&clientsecret=' + info.client_secret;
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (platform == _platform_ios || platform == _platform_mac) {
    //TODO ios
    window.location.href = 'vsk3browser://config?debug=' + info.debug + '&clientid=' + info.client_id + '&clientsecret=' + info.client_secret;
  } else if (platform == _platform_Windows) {
    //TODO Windows
    clickConfig(info.client_id, info.client_secret);
  } else {
    throw new Error("Device validation failed, only support for mobile devices");
  }
};

let configReadyCallback;
const ready = (callbackFunction) => configReadyCallback = callbackFunction;

//webview调用，config成功
function configReady() {
  setHadConfig();
  configReadyCallback && configReadyCallback();
}

let configErrorCallback;
let error = (callbackFunction) => configErrorCallback = callbackFunction;

//webview调用，config失败
const configError = (mg, cd) => configErrorCallback && configErrorCallback({msg: mg, code: cd});

let loginTimer;
let login_timeout_during = 60 * 1000;
let login_timeout_code = 200;

let loginSuccessCallback;
let loginFailCallback;
//设置登录超时回调方法
const login = (callbackFunction) => {
  if (!hadConfig()) {
    window.console.error('no config, please using Virsical.config(...) to config your app.')
    alert("Please config app first");
    return;
  }

  loginSuccessCallback = callbackFunction.success;
  loginFailCallback = callbackFunction.fail;

  // loginTimer = setTimeout(loginTimeout(), login_timeout_during);
  const platform = getPlatform();

  if (platform == _platform_android) {
    try {
      if (window.control) {
        window.control.login();
      } else {
        window.location.href = 'vsk3browser://login';
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (platform == _platform_ios || platform == _platform_mac) {
    //TODO ios
    window.location.href = 'vsk3browser://login';
  }
  else if (platform == _platform_Windows) {
    //TODO Windows
    new QWebChannel(qt.webChannelTransport, function (channel) {
      const content = channel.objects.content;
      content.login();
    })
  }
};

//webview调用，返回登录结果信息
const loginResult = (result, json, cd, mg) => {
  clearTimeout(loginTimer);
  if (result == 0) {
    loginSuccessCallback && loginSuccessCallback({info: json});
  } else {
    loginFailCallback && loginFailCallback({msg: mg, code: cd});
  }
};

//登录超时处理
const loginTimeout = () => loginResult("1", "", login_timeout_code, "Engineer no response");

let selectImageSuccessCallback;
//选择图片
const selectImage = (info) => {
  if (!hadConfig()) {
    alert("Please config app first");
    return;
  }
  selectImageSuccessCallback = info.successCallback;
  if (getPlatform() == _platform_android) {
    window.image.selectOne();
  } else if (getPlatform() == _platform_ios) {
    //TODO ios
  }
};

//webview调用，返回选择的图片信息
const imageResult = (ids) => selectImageSuccessCallback({localIds: ids});

//预览图片
const previewImage = (info) => {
  if (!hadConfig()) {
    alert("Please config app first");
    return;
  }
  if (getPlatform() == _platform_android) {
    window.image.show(info.ids);
  } else if (getPlatform() == _platform_ios) {
    //TODO ios
  }
};

let locationTimer;
let location_timeout_during = 60 * 1000;
let location_timeout_code = 200;

let locationSuccessCallback;
let locationFailCallback;
//设置定位超时回调方法
const location = (callbackFunction) => {
  if (!hadConfig()) {
    alert("Please config app first");
    return;
  }
  locationTimer = setTimeout("locationTimeout()", location_timeout_during);
  locationSuccessCallback = callbackFunction.success;
  locationFailCallback = callbackFunction.fail;
  if (getPlatform() == _platform_android) {
    window.map.location();
  } else if (getPlatform() == _platform_ios) {
    //TODO ios
  }
};

//定位超时处理
const locationTimeout = () => locationResult("1", "", "", login_timeout_code, "Engineer no response");

//webview调用，返回登录结果信息
const locationResult = (result, addr, lat, lng, cd, mg) => {
  clearTimeout(locationTimer);
  if (result == 0) {
    locationSuccessCallback({addr: addr, lat: lat, lng: lng});
  } else {
    locationFailCallback({msg: mg, code: cd});
  }
};

let workspaceSuccessCallback;
let workspaceFailCallback;
//扫描二维码
const captureQR = (callbackFunction) => {
  if (!hadConfig()) {
    alert("Please config app first");
    return;
  }
  workspaceSuccessCallback = callbackFunction.success;
  workspaceFailCallback = callbackFunction.fail;
  const platform = getPlatform();
  if (platform == _platform_android) {
    if (window.captureqr) {
      window.captureqr.scan();
    } else {
      window.location.href = 'vsk3browser://captureqr';
    }
  } else if (platform == _platform_ios || platform == _platform_mac) {
    //TODO ios
    window.location.href = 'vsk3browser://captureqr';
  }
};

//webview调用，返回扫描结果信息
const captureQRResult = (result, url, cd, mg) => {
  if (result == 0) {
    workspaceSuccessCallback({url: url});
  } else {
    workspaceFailCallback({msg: mg, code: cd});
  }
};

let messageCallback = (callback) => (messageCallback = callback);

const sendMessage = (message) => {
  messageCallback && messageCallback(message);
};


let contactsSuccessCallback;
let contactsFailCallback;
//获取手机通讯录
const phoneContacts = callbackFunction => {
  if (!hadConfig()) {
    alert("Please config app first");
    return;
  }
  contactsSuccessCallback = callbackFunction.success;
  contactsFailCallback = callbackFunction.fail;

  if (getPlatform() == _platform_android) {
    window.contacts.loadPhoneContacts(callbackFunction.refresh);
  } else if (getPlatform() == _platform_ios) {
    //TODO ios
    window.location.href = 'vsk3browser://loadPhoneContacts?' + 'refresh=' + callbackFunction.refresh
  }
};

//手机通讯录返回结果
const phoneContactsResult = (result, json, cd, mg) => {
  if (result == 0) {
    contactsSuccessCallback({result: json});
  } else {
    contactsFailCallback({msg: mg, code: cd});
  }
};

window.configReady = configReady;
window.configError = configError;
window.loginResult = loginResult;
window.imageResult = imageResult;
window.locationResult = locationResult;
window.captureQRResult = captureQRResult;
window.phoneContactsResult = phoneContactsResult;
window.sendMessage = sendMessage;

const Virsical = {
  config: config,
  ready: ready,
  login: login,
  error: error,
  captureQR: captureQR,
  selectImage: selectImage,
  previewImage: previewImage,
  location: location,
  messageCallback: messageCallback,
  phoneContacts: phoneContacts
};

window.Virsical = Virsical;

export default Virsical;
