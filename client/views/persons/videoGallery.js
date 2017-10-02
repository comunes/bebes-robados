/* global Template _ aFilesCollection onYouTubeIframeAPIReady YT ReactiveVar */

function extractVideoID(url){
  // https://ctrlq.org/code/19797-regex-youtube-id
  // better
  // https://github.com/radiovisual/get-video-id

  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[7].length == 11){
    return match[7];
  } else {
    console.log("Could not extract video ID from " + url);
    return "";
  }
};

// https://stackoverflow.com/questions/22795887/how-to-access-template-instance-from-helpers-in-meteor-0-8-0-blaze
Template.videosGallery.onCreated(function() {
  this.ytVideos = new ReactiveVar([]);
  this.otherVideos = new ReactiveVar([]);
});

Template.videosGallery.helpers({
  tieneVideos: function() {
    return (Template.instance().ytVideos.get().length + Template.instance().otherVideos.get().length) > 0;
  },
  ytVideos: function () {
    return Template.instance().ytVideos.get();
  },
  otherVideos: function() {
    return Template.instance().otherVideos.get();
  }
});

Template.videosGallery.onRendered(function () {
  var ytVideosSet = new Set();
  var otherVideosSet = new Set();

  for(var i = 0; i < this.data.videos.length; i++) {
    var url= this.data.videos[i].url;
    var id = extractVideoID(url);
    if (id != "") {
      ytVideosSet.add(id);
    } else {
      otherVideosSet.add(url);
    }
  }
  var ytVideos = Array.from(ytVideosSet);
  this.ytVideos.set(ytVideos);
  this.otherVideos.set(Array.from(otherVideosSet));

  // Maybe use something more generic: https://www.npmjs.com/package/embed-video
  onYouTubeIframeAPIReady = function () {
    for(var i = 0; i < ytVideos.length; i++) {
      // New Video Player, the first argument is the id of the div.
      // Make sure it's a global variable.
      var id = ytVideos[i];
      console.log(id);
      var player = new YT.Player("videoplayer" + id, {
        height: "400",
        width: "600",
        videoId: id,
        // Events like ready, state change,
        events: {
          onReady: function (event) {
            // Play video when player ready.
            // event.target.playVideo();
          }
        }

      });
    };
  };

  YT.load();
});
