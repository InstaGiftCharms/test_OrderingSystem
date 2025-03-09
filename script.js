document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 0;
    const slideshowImage = document.getElementById('slideshow-image');
    const slideshowContainer = document.querySelector('.slideshow-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const indicatorsContainer = document.querySelector('.slideshow-indicators'); // Get indicators container
    let slideshowInterval;

    function updateIndicators() {
        indicatorsContainer.innerHTML = ''; // Clear previous indicators
        for (let i = 0; i < listOfImages.length; i++) {
            const indicator = document.createElement('span');
            indicator.addEventListener('click', () => {
                clearInterval(slideshowInterval);
                slideIndex = i;
                changeSlide(0); // Go to clicked slide
                startSlideshow();
            });
            if (i === slideIndex) {
                indicator.classList.add('active'); // Highlight current slide's indicator
            }
            indicatorsContainer.appendChild(indicator);
        }
    }


    function changeSlide(direction) {
        clearInterval(slideshowInterval);

        slideIndex += direction;

        if (slideIndex < 0) {
            slideIndex = listOfImages.length - 1;
        } else if (slideIndex >= listOfImages.length) {
            slideIndex = 0;
        }

        slideshowImage.style.opacity = 0;

        slideshowImage.onload = function() {
            const aspectRatio = slideshowImage.naturalWidth / slideshowImage.naturalHeight;
            slideshowContainer.style.aspectRatio = aspectRatio;
            slideshowImage.style.opacity = 1;
            updateIndicators(); // Update indicators after slide change
        };

        setTimeout(() => {
            slideshowImage.src = listOfImages[slideIndex];
        }, 500);

        startSlideshow();
    }

    function startSlideshow() {
        slideshowInterval = setInterval(() => {
            changeSlide(1);
        }, timeEachSlide);
    }

    prevButton.addEventListener('click', () => {
        changeSlide(-1);
    });

    nextButton.addEventListener('click', () => {
        changeSlide(1);
    });

    updateIndicators(); // Initial indicator creation
    startSlideshow();
    changeSlide(0);
});