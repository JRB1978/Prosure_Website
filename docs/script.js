document.addEventListener('DOMContentLoaded', () => {

    // Client logos
    const isLocal = window.location.hostname === 'localhost';
    const logosPath = isLocal ? '/logos' : 'CompanyLogos';
    const clientLogos = document.getElementById('client-logos');

    function renderLogos(logos) {
        logos.forEach(logo => {
            const img = document.createElement('img');
            img.src = `CompanyLogos/${logo}`;
            img.alt = logo.replace(/\.(png|jpg|jpeg)$/i, '').replace(/[_-]/g, ' ');
            img.loading = 'lazy';
            clientLogos.appendChild(img);
        });
    }

    if (isLocal) {
        fetch(logosPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(renderLogos)
            .catch(error => console.error('Error fetching logos:', error));
    } else {
        const logos = ['bp_Logo.png', 'Costain_Logo.png', 'Harbour-logo.png', 'Kent-PLC-Feature-Logo.png', 'Logo-TotalEnergies-2021-1.jpg', 'PDi_Logo.jpg', 'Petrofac_Logo.jpeg', 'petroflow_integrated_consultants_ltd_logo.jpeg', 'Repsol_Logo.jpeg', 'Shell.jpeg', 'petronas-logo.png', 'PDMS-Logo-banner.png'];
        renderLogos(logos);
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('prosure-theme', next);
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
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
                formStatus.textContent = 'Sorry, something went wrong sending your message. Please email us directly at info@prosure.io.';
                formStatus.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            });
    });

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
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 720) closeMenu();
    });
});
