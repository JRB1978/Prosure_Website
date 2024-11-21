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
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const company = document.getElementById('company').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Construct the email content
        const subject = `New Contact Form Submission from ${name}`;
        const body = `Name: ${name}\nCompany Name: ${company}\nEmail: ${email}\nMessage:\n${message}`;

        // Send email using the mailto protocol
        window.location.href = `mailto:info@prosure.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // Menu toggle handling
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    menuBtn.addEventListener('mouseover', () => {
        navLinks.classList.add('show');
    });

    menuBtn.addEventListener('mouseout', () => {
        setTimeout(() => {
            if (!navLinks.matches(':hover')) {
                navLinks.classList.remove('show');
            }
        }, 300);
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
