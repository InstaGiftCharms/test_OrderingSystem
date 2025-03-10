document.addEventListener('DOMContentLoaded', function() {
    // Slideshow functionality
    let slideIndex = 0;
    const slides = ConfigParameters.slideshowImages; // Access static property using class name
    const slideshowImage = document.getElementById('slideshow-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const indicatorsContainer = document.querySelector('.slideshow-indicators');

    function updateSlide(index) {
        slideshowImage.src = slides[index];
        slideshowImage.alt = `Slide ${index + 1}`;

        // Update indicators (if you have them)
        const indicators = indicatorsContainer.querySelectorAll('span');
        indicators.forEach(span => span.classList.remove('active'));
        indicators[index].classList.add('active');
    }

    function createIndicators() {
        slides.forEach((_, index) => {
            const span = document.createElement('span');
            span.addEventListener('click', () => {
                slideIndex = index;
                updateSlide(slideIndex);
            });
            indicatorsContainer.appendChild(span);
        });
    }


    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        updateSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        updateSlide(slideIndex);
    }

    if (slides && slides.length > 0) {
        createIndicators();
        updateSlide(slideIndex); // Initialize to first slide
        setInterval(nextSlide, ConfigParameters.slideshowInterval); // Access static property using class name

        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    } else {
        console.warn("No slideshow images provided in ConfigParameters.js");
        // Consider hiding slideshow or displaying a placeholder image
    }


    // Shipping Options population
    const shippingSelect = document.getElementById('shippingOption');
    ConfigParameters.shippingOptions.forEach(optionText => {
        const optionElement = document.createElement('option');
        optionElement.value = optionText;
        optionElement.textContent = optionText;
        shippingSelect.appendChild(optionElement);
    });

    // Populate Shipping Option Explanation Text
    const shippingExplanationElement = document.getElementById('shipping-options-explanation');
    if (shippingExplanationElement) {
        ConfigParameters.shippingOptionText.forEach(paragraphText => { // Loop through the array
            const pElement = document.createElement('p'); // Create a <p> element for each paragraph
            pElement.innerHTML = paragraphText; // Set innerHTML to handle potential HTML in text (like bolding later if needed)
            shippingExplanationElement.appendChild(pElement); // Append <p> to explanation div
        });
    } else {
        console.error("Shipping explanation element with ID 'shipping-options-explanation' not found in index.html");
    }


    // --- Conditional Display Logic for Shipping Address ---
    const shippingOptionSelect = document.getElementById('shippingOption');
    const shippingAddressGroup = document.querySelector('.form-group:has(#shippingAddress)');

    if (!shippingAddressGroup) {
        console.error("Shipping Address form group not found. Ensure you have a .form-group containing #shippingAddress in your index.html");
    } else {
        shippingAddressGroup.style.display = 'none'; // Initially hide it

        shippingOptionSelect.addEventListener('change', function() {
            const selectedOptionText = shippingOptionSelect.options[shippingOptionSelect.selectedIndex].text;
            const showShippingAddress = selectedOptionText.toLowerCase().includes('shipping');

            if (showShippingAddress) {
                shippingAddressGroup.style.display = 'block';
            } else {
                shippingAddressGroup.style.display = 'none';
            }
        });
    }
});
