const express     = require('express');
const router      = express.Router({mergeParams: true});
const Resort      = require('../models/resort');
const Comment     = require('../models/comment');
const middleware  = require('../middleware');

// New comment form route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  // Find the resort with the provided ID
  Resort.findById(req.params.id, (err, resort) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new-comment', {
        resort: resort
      });
    }
  });
});

// Create a new comment with the form data & save it to the database
router.post('/', middleware.isLoggedIn, (req, res) => {
  // Find the resort with the provided ID
  Resort.findById(req.params.id, (err, resort) => {
    if (err) {
      console.log(err);
      res.redirect('/resorts');
    } else {
      // Create a new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // Add username & ID to the comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          // Save the comment
          comment.save();

          // Associate the comment with the resort
          resort.comments.push(comment._id);
          resort.save();

          // Redirect to the show page
          req.flash('success', 'Your comment was successfully created.');
          res.redirect('/resorts/' + resort._id);
        }
      });
    }
  });
});

// Edit comment route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  // Find the resort with the provided ID
  Resort.findById(req.params.id, (err, foundResort) => {
    if (err || !foundResort) {
      req.flash('danger', 'Resort not found.');
      return res.redirect('/resorts');
    }

    // Find the comment with the provided ID
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit-comment', {
          resort_id: req.params.id,
          comment: foundComment
        });
      }
    });
  });
});

// Update comment route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // Find the comment with the provided ID & update it
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Your comment was successfully updated.');
      res.redirect('/resorts/' + req.params.id);
    }
  });
});

// Delete comment route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // Find the comment with the provided ID & delete it
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Your comment was successfully deleted.');
      res.redirect('/resorts/' + req.params.id);
    }
  });
});

module.exports = router;