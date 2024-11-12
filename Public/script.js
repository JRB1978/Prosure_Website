document.addEventListener('DOMContentLoaded', () => {
    fetch('/logos')
        .then(response => response.json())
        .then(logos => {
            const carouselInner = document.getElementById('carousel-inner');
            logos.forEach(logo => {
                const img = document.createElement('img');
                img.src = `CompanyLogos/${logo}`;
                img.alt = logo;
                carouselInner.appendChild(img);
            });

            // Clone the first few images and append them to the end for seamless looping
            for (let i = 0; i < 5; i++) {
                const clone = carouselInner.children[i].cloneNode(true);
                carouselInner.appendChild(clone);
            }

            startCarousel(logos.length);
        })
        .catch(error => console.error('Error fetching logos:', error));
});

function startCarousel(totalImages) {
    let currentIndex = 0;
    const carouselInner = document.querySelector('.carousel-inner');
    const imagesToShow = 5;
    const totalItems = totalImages + imagesToShow; // Total items including clones

    function updateCarousel() {
        const offset = currentIndex * -100 / imagesToShow;
        carouselInner.style.transform = `translateX(${offset}%)`;
        carouselInner.style.transition = 'transform 0.5s ease-in-out';
    }

    function nextImage() {
        currentIndex++;
        if (currentIndex === totalItems) {
            currentIndex = imagesToShow; // Reset to the first original image
            carouselInner.style.transition = 'none'; // Disable transition for the reset
            carouselInner.style.transform = `translateX(${currentIndex * -100 / imagesToShow}%)`;
            setTimeout(() => {
                carouselInner.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
            }, 50);
        }
        updateCarousel();
    }

    setInterval(nextImage, 2000); // Change image every 2 seconds
}














