var g_winVersion = '';
if (navigator.userAgentData) {
    navigator.userAgentData.getHighEntropyValues(['platformVersion']).then(ua => {
        g_winVersion = ua.platformVersion;
    });
}

var isSupportFullscreenAPI = function (element) {
    var rfs = element.requestFullscreen
        || element.webkitRequestFullScreen
        || element.mozRequestFullScreen
        || element.msRequestFullscreen

    return rfs　? true : false;
}

var requestFullScreen = function (element) {
    if (!isSupportFullscreenAPI(element)) return;

    var rfs = element.requestFullscreen
        || element.webkitRequestFullScreen
        || element.mozRequestFullScreen
        || element.msRequestFullscreen

    rfs.call(element);
}

var getOS = function () {
    var ua = navigator.userAgent;
    var isWin = (ua.indexOf('Win') > -1);
    var winVer = parseInt(g_winVersion.split('.')[0]);
    var isMac = (ua.indexOf('Mac') > -1);
    var isLikeMac = (ua.indexOf('like Mac') > -1); // iOS
    var isAndroid = (ua.indexOf('Android') > -1);

    if (isAndroid) {
        return 'Android';
    } else if (isLikeMac) {
        return 'iOS';
    } else if (isMac) {
        return 'Mac';
    } else if (isWin) {
        if (winVer >= 13) {
            return 'Win11';
        } else if (winVer > 0 || ua.indexOf('Windows NT 10.0')) {
            return 'Win10';
        } else {
            return 'WinXP';
        }
    } else {
        return 'Unknow';
    }
};

var getUrl = function (isFullscreenMode) {
    var os = getOS();

    var urlMap = { // os => url
        'Win11': 'https://updatefaker.com/windows11/index.html',
        'Win10': 'https://updatefaker.com/windows10/index.html',
        'WinXP': 'https://updatefaker.com/xp/index.html',
        'iOS': 'assets/ios-boot.mp4',
        'Android': 'android/index.html',
        'Mac': 'https://updatefaker.com/osx/index.html',
        'Black': 'assets/black.mp4'
    };

    if ('Unknow' === os) {
        return isFullscreenMode ?　urlMap['Win10'] : urlMap['Black'];
    }

    return urlMap[os];
};

var init = function () {
    var fullscreen = document.getElementById('fullscreen');
    var iframe = document.getElementById('iframe');
    var video = document.getElementById('video');
    var videoSource = document.getElementById('video-src');
    var isFullscreenMode = isSupportFullscreenAPI(fullscreen);
    var url = getUrl(isFullscreenMode);

    if (isFullscreenMode) {
        iframe.src = url;
    } else {
        videoSource.src = url;
        video.load();
    }

    var target = document.getElementById('click');
    target.addEventListener('click', function() {
        if (isFullscreenMode) {
            requestFullScreen(fullscreen);
        } else {
            video.classList.add('play');
            video.play();
            target.classList.add('hide');
        }
    }, false);
};

setTimeout(init, 100); // wait for g_winVersion
