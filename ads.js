var autoplayAllowed = false;
var player;
var wrapperDiv;

function checkUnmutedAutoplaySupport() {
  canAutoplay
    .video({ timeout: 100, muted: false })
    .then(function (response) {
      if (response.result === false) {
        // Unmuted autoplay is not allowed.
        checkMutedAutoplaySupport();
      } else {
        // Unmuted autoplay is allowed.
        autoplayAllowed = true;
        initPlayer();
      }
    });
}

function checkMutedAutoplaySupport() {
  canAutoplay
    .video({ timeout: 100, muted: true })
    .then(function (response) {
      if (response.result === false) {
        // Muted autoplay is not allowed.
        autoplayAllowed = false;
      } else {
        // Muted autoplay is allowed.
        autoplayAllowed = true;
      }
      initPlayer();
    });
}

function initPlayer() {
  player = videojs('content_video', {
    controls: true,
    autoplay: autoplayAllowed,
    preload: 'none',
    sources: [
      {
        src: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
      },
    ],
  });

  var imaOptions = {
    id: 'content_video',
    adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&' +
      'iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&' +
      'impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&' +
      'cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&' +
      'vid=short_onecue&correlator=',
  };
  player.ima(imaOptions);

  var initAdDisplayContainer = function () {
    player.ima.initializeAdDisplayContainer();
    wrapperDiv.removeEventListener(startEvent, initAdDisplayContainer);
  };
  if (!autoplayAllowed) {
    if (navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/Android/i)) {
      startEvent = 'touchend';
    }

    wrapperDiv = document.getElementById('content_video');
    wrapperDiv.addEventListener(startEvent, initAdDisplayContainer);
  }
}

var startEvent = 'click';
checkUnmutedAutoplaySupport();
