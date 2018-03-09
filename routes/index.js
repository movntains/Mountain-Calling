const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const User      = require('../models/user');

// Home GET route
router.get('/', (req, res) => {
  res.render('index');
});

// ----- AUTHORIZATION ROUTES -----

// Registration form route
router.get('/register', (req, res) => {
  res.render('register');
});

// Create a new user with the form data & save it to the database
router.post('/register', (req, res) => {
  let newUser = new User({
    username: req.body.username
  });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('danger', `${err.message}.`);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'You have successfully registered for Mountain Calling.');
      res.redirect('/resorts');
    });
  });
});

// ----- LOGIN ROUTES -----

// Login form route
router.get('/login', (req, res) => {
  res.render('login');
});

// Login POST route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/resorts',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.'
}), (req, res) => {
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/login');
});

module.exports = router;