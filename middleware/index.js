const Resort    = require('../models/resort');
const Comment   = require('../models/comment');

let middlewareObject = {};

// Check if the user owns the resort
middlewareObject.checkResortOwnership = function(req, res, next) {
  // Determine if the user is logged in
  if (req.isAuthenticated()) {
    // Find the resort with the provided ID
    Resort.findById(req.params.id, (err, foundResort) => {
      if (err || !foundResort) {
        req.flash('danger', 'Resort not found.');
        res.redirect('/resorts');
      } else {
        // Determine if the user owns the resort
        if (foundResort.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('danger', 'You do not have permission to do that.');
          res.redirect('/resorts');
        }
      }
    });
  } else {
    req.flash('danger', 'You must be logged in.');
    res.redirect('/login');
  }
};

// Check if the user owns the comment
middlewareObject.checkCommentOwnership = function(req, res, next) {
  // Determine if the user is logged in
  if (req.isAuthenticated()) {
    // Find the comment with the provided ID
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('danger', 'Comment not found.');
        res.redirect('/resorts');
      } else {
        // Determine if the user owns the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('danger', 'You do not have permission to do that.');
          res.redirect('/resorts');
        }
      }
    });
  } else {
    req.flash('danger', 'You must be logged in.');
    res.redirect('/login');
  }
};

// Check if the user is logged in
middlewareObject.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('danger', 'You must be logged in.');
  res.redirect('/login');
};

module.exports = middlewareObject;