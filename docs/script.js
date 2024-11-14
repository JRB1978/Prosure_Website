document.addEventListener('DOMContentLoaded', () => {
    const isLocal = window.location.hostname === 'localhost';
    const logosPath = isLocal ? '/logos' : 'CompanyLogos';

    fetch(logosPath)
        .then(response => response.json())
        .then(logos => {
            const carouselInner = document.getElementById('carousel-inner');
            logos.forEach(logo => {
                const img = document.createElement('img');
                img.src = `${isLocal ? 'CompanyLogos/' : ''}${logo}`;
                img.alt = logo;
                carouselInner.appendChild(img);
            });

            // Clone the logos to create an infinite loop effect
            logos.forEach(logo => {
                const img = document.createElement('img');
                img.src = `${isLocal ? 'CompanyLogos/' : ''}${logo}`;
                img.alt = logo;
                carouselInner.appendChild(img);
            });
        })
        .catch(error => console.error('Error fetching logos:', error));
});

















