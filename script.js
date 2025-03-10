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


    // --- Total Order Price Display ---
    let totalOrderPrice = 125.50; // Initialize totalOrderPrice variable (example value)
    const totalPriceValueElement = document.getElementById('order-total-price-value');
    const totalPriceAreaElement = document.querySelector('.order-total-area'); // Get the total price area
    const shippingAddressGroup = document.querySelector('.form-group:has(#shippingAddress)'); // Get Shipping Address group

    function updateTotalPriceDisplay() {
        totalPriceValueElement.textContent = `PHP ${totalOrderPrice.toFixed(2)}`; // Format to 2 decimal places and add PHP
    }

    updateTotalPriceDisplay(); // Initial display of total price

    // --- Conditional Display Logic for Shipping Address and Total Price Area ---
    const shippingOptionSelect = document.getElementById('shippingOption');

    if (!shippingAddressGroup) {
        console.error("Shipping Address form group not found.");
    }
    if (!totalPriceAreaElement) {
        console.error("Total Price area form group not found.");
    }


    if (shippingAddressGroup && totalPriceAreaElement) { // Proceed only if both elements are found
        totalPriceAreaElement.style.display = 'block'; // Initially show total price area
        const orderDescriptionGroup = totalPriceAreaElement.nextElementSibling; // Get the Order Description group (next sibling)
        const formElement = totalPriceAreaElement.closest('form'); // Get the form element

        shippingOptionSelect.addEventListener('change', function() {
            const selectedOptionText = shippingOptionSelect.options[shippingOptionSelect.selectedIndex].text;
            const showShippingAddress = selectedOptionText.toLowerCase().includes('shipping');

            if (showShippingAddress) {
                shippingAddressGroup.style.display = 'block';
                if (shippingAddressGroup.nextElementSibling !== totalPriceAreaElement) { // Check if total price area is NOT already after shipping address
                    formElement.insertBefore(totalPriceAreaElement, orderDescriptionGroup); // Move Total Price area below Shipping Address but above Order Description
                }
            } else {
                shippingAddressGroup.style.display = 'none';
                formElement.insertBefore(totalPriceAreaElement, orderDescriptionGroup); // Move Total Price area back to default position (above Order Description) when shipping address is hidden
            }
        });
    }
});
