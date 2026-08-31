document.addEventListener('DOMContentLoaded', () => {
    const isLocal = window.location.hostname === 'localhost';
    const logosPath = isLocal ? '/logos' : 'CompanyLogos';

    if (isLocal) {
        // Local environment: fetch logos from server
        fetch(logosPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(logos => {
                const carouselInner = document.getElementById('carousel-inner');
                logos.forEach(logo => {
                    const img = document.createElement('img');
                    img.src = `CompanyLogos/${logo}`;
                    img.alt = logo;
                    carouselInner.appendChild(img);
                });

                // Clone the logos to create an infinite loop effect
                logos.forEach(logo => {
                    const img = document.createElement('img');
                    img.src = `CompanyLogos/${logo}`;
                    img.alt = logo;
                    carouselInner.appendChild(img);
                });
            })
            .catch(error => console.error('Error fetching logos:', error));
    } else {
        // GitHub Pages: directly reference image files
        const logos = ['bp_Logo.png', 'Costain_Logo.png', 'Harbour-logo.png', 'Kent-PLC-Feature-Logo.png', 'Logo-TotalEnergies-2021-1.jpg', 'PDi_Logo.jpg', 'Petrofac_Logo.jpeg', 'petroflow_integrated_consultants_ltd_logo.jpeg', 'Repsol_Logo.jpeg', 'Shell.jpeg', 'petronas-logo.png', 'PDMS-Logo-banner.png']; // List all your logo filenames here
        const carouselInner = document.getElementById('carousel-inner');
        logos.forEach(logo => {
            const img = document.createElement('img');
            img.src = `${logosPath}/${logo}`;
            img.alt = logo;
            carouselInner.appendChild(img);
        });

        // Clone the logos to create an infinite loop effect
        logos.forEach(logo => {
            const img = document.createElement('img');
            img.src = `${logosPath}/${logo}`;
            img.alt = logo;
            carouselInner.appendChild(img);
        });
    }

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function(event) {
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

    // Menu toggle handling
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    let timeoutId;

    menuBtn.addEventListener('mouseover', () => {
        clearTimeout(timeoutId);
        navLinks.classList.add('show');
    });

    menuBtn.addEventListener('mouseout', () => {
        timeoutId = setTimeout(() => {
            if (!navLinks.matches(':hover')) {
                navLinks.classList.remove('show');
            }
        }, 300);
    });

    navLinks.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });

    navLinks.addEventListener('mouseleave', () => {
        navLinks.classList.remove('show');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });

    // Collapse the menu on window resize to avoid showing menu when switching between mobile and desktop
    window.addEventListener('resize', () => {
        navLinks.classList.remove('show');
    });
});
