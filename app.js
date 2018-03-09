const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');

// ----- APP CONFIGURATION -----

// Import models
const Resort = require('./models/resort');
const Comment = require('./models/comment');
const User = require('./models/user');

// Import route files
const resortRoutes = require('./routes/resorts');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

// Connect to the database
mongoose.connect(process.env.DATABASE_URL);

// Initialize the app
const app = express();

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set the public folder to static
app.use(express.static(path.join(__dirname, 'public')));

// Set up method-override
app.use(methodOverride('_method'));

// Set up connect-flash & express-messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Tell the app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Set up express-session
app.use(require('express-session')({
  secret: 'Winter is coming',
  resave: false,
  saveUninitialized: false
}));

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global user middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ----- ROUTES -----
app.use('/', indexRoutes);
app.use('/resorts', resortRoutes);
app.use('/resorts/:id/comments', commentRoutes);

// ----- SERVER -----

// Start the server
app.listen(process.env.PORT, () => {
  console.log('Server running on port 3000...');
});