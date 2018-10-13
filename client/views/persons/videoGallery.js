/* global Template _ aFilesCollection onYouTubeIframeAPIReady YT ReactiveVar require */

var embed = require("embed-video");

// https://stackoverflow.com/questions/22795887/how-to-access-template-instance-from-helpers-in-meteor-0-8-0-blaze
Template.videosGallery.onCreated(function() {
  this.ytVideos = new ReactiveVar([]);
  this.vimeoVideos = new ReactiveVar([]);
  this.otherVideos = new ReactiveVar([]);
});

Template.videosGallery.helpers({
  tieneVideos: function() {
    return (Template.instance().ytVideos.get().length + Template.instance().otherVideos.get().length) > 0;
  },
  ytVideos: function () {
    return Template.instance().ytVideos.get();
  },
  vimeoVideos: function () {
    return Template.instance().vimeoVideos.get();
  },
  otherVideos: function() {
    return Template.instance().otherVideos.get();
  },
  embedYoutube: function(id) {
    return embed.youtube(id);
  },
  embedVimeo: function(id) {
    return embed.vimeo(id);
  }
});

Template.videosGallery.onRendered(function () {
  var ytVideosSet = new Set();
  var vimeoVideosSet = new Set();
  var otherVideosSet = new Set();
  const length = this.data.videos && this.data.videos.length ? this.data.videos.length: 0;

  for(var i = 0; i < length; i++) {

    var url= this.data.videos[i].url;
    var embedCode = embed.videoSource(url);

    var id = embedCode && embedCode.id ? embedCode.id: "";

    if (id != "" && embedCode.source == "youtube") {
      ytVideosSet.add(id);
    } else {
      if (id != "" && embedCode.source == "vimeo") {
        vimeoVideosSet.add(id);
      } else {
        otherVideosSet.add(url);
      }
    }
  }

  this.ytVideos.set(Array.from(ytVideosSet));
  this.vimeoVideos.set(Array.from(vimeoVideosSet));
  this.otherVideos.set(Array.from(otherVideosSet));
});
