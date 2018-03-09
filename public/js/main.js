const body = document.getElementsByTagName('body')[0];
// const header = document.getElementsByTagName('header')[0];
const menuButton = document.getElementsByClassName('fa-bars')[0];
const mobileMenu = document.getElementsByClassName('mobile-menu')[0];

// Open mobile menu
document.getElementById('mobile-menu-open').addEventListener('click', function() {
  mobileMenu.classList.add('active');
  body.classList.add('active');
  
  mobileMenu.style.display = 'block';

  // Hide the menu once clicked
  menuButton.style.display = 'none';
});

// Close mobile menu
document.getElementById('mobile-menu-close').addEventListener('click', function() {
  mobileMenu.classList.remove('active');
  body.classList.remove('active');

  mobileMenu.style.display = 'none';

  // Show the menu again
  menuButton.style.display = 'block';
});