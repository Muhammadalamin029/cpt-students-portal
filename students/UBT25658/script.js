// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');
    const body = document.body;

    // Get icon elements
    const desktopIcon = themeToggle.querySelector('i');
    const mobileIcon = themeToggleMobile.querySelector('i');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        desktopIcon.classList.remove('fa-moon');
        desktopIcon.classList.add('fa-sun');
        mobileIcon.classList.remove('fa-moon');
        mobileIcon.classList.add('fa-sun');
    }

    // Toggle theme - Desktop
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });

    // Toggle theme - Mobile
    themeToggleMobile.addEventListener('click', function() {
        toggleTheme();
        // Close hamburger menu after clicking theme toggle
        closeHamburgerMenu();
    });

    // Toggle theme function
    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            desktopIcon.classList.remove('fa-sun');
            desktopIcon.classList.add('fa-moon');
            mobileIcon.classList.remove('fa-sun');
            mobileIcon.classList.add('fa-moon');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            desktopIcon.classList.remove('fa-moon');
            desktopIcon.classList.add('fa-sun');
            mobileIcon.classList.remove('fa-moon');
            mobileIcon.classList.add('fa-sun');
        }
    }

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('active');
    });

    // Close hamburger menu function
    function closeHamburgerMenu() {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
    }

    // Close menu when clicking on a navigation link
    const navLinks = navMobile.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeHamburgerMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const header = document.querySelector('header');
        if (!header.contains(event.target)) {
            closeHamburgerMenu();
        }
    });
});
