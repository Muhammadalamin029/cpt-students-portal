document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dark Mode Toggle ---
    const modeCheckbox = document.getElementById('mode-checkbox');
    const body = document.body;

    // Check for saved user preference
    if (localStorage.getItem('theme') === 'dark') {
        modeCheckbox.checked = true;
        body.classList.add('dark-mode');
    }

    modeCheckbox.addEventListener('change', () => {
        if (modeCheckbox.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- 2. Staggered Letter Animation ---
    // This automatically adds the delay index to your letters for the CSS animation
    const letters = document.querySelectorAll('.letter');
    letters.forEach((char, index) => {
        char.style.setProperty('--i', index + 1);
    });

    // --- 3. Simple Search Functionality ---
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query === "") return;

        // Remove previous highlights
        const content = document.querySelector('main');
        const sections = content.querySelectorAll('section');
        
        let found = false;
        sections.forEach(section => {
            if (section.textContent.toLowerCase().includes(query)) {
                section.scrollIntoView({ behavior: 'smooth' });
                found = true;
                
                // Visual feedback: brief highlight
                section.style.outline = "2px solid #007bff";
                setTimeout(() => section.style.outline = "none", 2000);
            }
        });

        if (!found) alert("No matches found on this page.");
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // --- 4. Intersection Observer (Scroll Reveal) ---
    // Makes sections fade in when they enter the viewport
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-scroll');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-text, section');
    fadeElements.forEach(el => observer.observe(el));

    // --- 5. Navigation Link Active State ---
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});