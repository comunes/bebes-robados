/* global Comments */
// https://github.com/ARKHAM-Enterprises/meteor-comments-ui/blob/master/GUIDE.md

Comments.config({
  // Not rendered well with bootstrap
  // rating: 'stars',
  anonymous: false,
  mediaAnalyzers: [
    Comments.analyzers.image,
    Comments.analyzers.youtube
  ]
});
