document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 0;
    const slideshowImage = document.getElementById('slideshow-image');
    const slideshowContainer = document.querySelector('.slideshow-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const indicatorsContainer = document.querySelector('.slideshow-indicators');
    let slideshowInterval;

    function updateIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < listOfImages.length; i++) {
            const indicator = document.createElement('span');
            indicator.addEventListener('click', () => {
                clearInterval(slideshowInterval);
                slideIndex = i;
                changeSlide(0);
                startSlideshow();
            });
            if (i === slideIndex) {
                indicator.classList.add('active');
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
            updateIndicators();
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

    updateIndicators();
    startSlideshow();
    changeSlide(0);

    // Form Validation Logic
    const orderForm = document.querySelector('form');
    orderForm.addEventListener('submit', function(event) {
        let isValid = true;
        let errorMessages = [];

        for (const fieldId of requiredFields) {
            const inputField = document.getElementById(fieldId);
            if (!inputField.value.trim()) {
                isValid = false;
                errorMessages.push(inputField.previousElementSibling.textContent.slice(0, -1)); // Get label text (remove colon)
            }
        }

        if (!isValid) {
            event.preventDefault(); // Prevent form submission
            alert("Please fill in the following required fields:\n" + errorMessages.join(", ")); // Display error message
        }
    });

    // Populate Shipping Options Dropdown
    const shippingOptionsDropdown = document.getElementById('shippingOption');

    shippingOptions.forEach(optionText => {
        const optionElement = document.createElement('option');
        optionElement.value = optionText; // Value and text are the same for simplicity
        optionElement.textContent = optionText;
        shippingOptionsDropdown.appendChild(optionElement);
    });
});
