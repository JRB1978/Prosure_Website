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
        const logos = ['logo1.png', 'logo2.png', 'logo3.png']; // List all your logo filenames here
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
});


















