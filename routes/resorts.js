const express     = require('express');
const router      = express.Router();
const Resort      = require('../models/resort');
const middleware  = require('../middleware');

// Resorts GET route (show all resorts)
router.get('/', (req, res) => {
  // Get all resorts from the database
  Resort.find({}, (err, allResorts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('resorts/resorts', {
        resorts: allResorts
      });
    }
  });
});

// Add resort GET route (show the form)
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('resorts/new-resort');
});

// Add resort POST route
router.post('/', middleware.isLoggedIn, (req, res) => {
  // Get data from the form
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newResort = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author
  };

  // Create a new resort with the form data & save it to the database
  Resort.create(newResort, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'The resort was successfully created.');
      // Redirect to the resorts page
      res.redirect('/resorts');
    }
  });
});

// Particular resort GET route
router.get('/:id', (req, res) => {
  // Find the resort with the provided ID
  Resort.findById(req.params.id).populate('comments').exec((err, foundResort) => {
    if (err || !foundResort) {
      req.flash('danger', 'Resort not found.');
      res.redirect('/resorts');
    } else {
      // Render the template
      res.render('resorts/show-resort', {
        resort: foundResort
      });
    }
  });
});

// Edit a particular resort route
router.get('/:id/edit', middleware.checkResortOwnership, (req, res) => {
  // Find the resort with the provided ID
  Resort.findById(req.params.id, (err, foundResort) => {
    res.render('resorts/edit-resort', {
      resort: foundResort
    });
  });
});

// Update a particular resort route
router.put('/:id', middleware.checkResortOwnership, (req, res) => {
  // Find the resort with the provided ID & update it
  Resort.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedResort) => {
    if (err) {
      res.redirect('/resorts');
    } else {
      req.flash('success', 'The resort was successfully updated.');
      res.redirect('/resorts/' + req.params.id);
    }
  });
});

// Delete a resort route
router.delete('/:id', middleware.checkResortOwnership, (req, res) => {
  Resort.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/resorts');
    } else {
      req.flash('success', 'The resort was successfully deleted.');
      res.redirect('/resorts');
    }
  });
});

module.exports = router;