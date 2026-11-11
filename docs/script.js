document.addEventListener('DOMContentLoaded', () => {

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');

    function labelThemeToggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    labelThemeToggle();

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem('prosure-theme', next);
        } catch (error) {
            // Storage can be unavailable (private browsing); the toggle still works for this visit.
        }
        labelThemeToggle();
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        throw new Error(data.message || 'Submission failed');
                    }
                    formStatus.textContent = "Thank you — your message has been sent. We'll be in touch soon.";
                    formStatus.classList.add('success');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Contact form error:', error);
                    formStatus.textContent = 'Sorry, something went wrong sending your message. Please try again in a moment.';
                    formStatus.classList.add('error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit';
                });
        });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const navPanel = document.getElementById('nav-panel');

    function closeMenu() {
        navPanel.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        navPanel.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
    }

    menuBtn.addEventListener('click', () => {
        if (navPanel.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!navPanel.classList.contains('open')) return;
        if (navPanel.contains(event.target) || menuBtn.contains(event.target)) return;
        closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navPanel.classList.contains('open')) {
            closeMenu();
            menuBtn.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 720) closeMenu();
    });
});
