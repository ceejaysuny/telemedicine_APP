// Function to toggle the visibility of the menu
function toggleMenu() {
    document.body.classList.toggle("show-menu");
}

// Close the menu when clicking outside of it
document.addEventListener('click', function(event) {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
        document.body.classList.remove('show-menu');
    }
});

// Close the menu on touch anywhere on the screen
document.addEventListener('touchstart', function(event) {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
        document.body.classList.remove('show-menu');
    }
});