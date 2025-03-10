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
    ConfigParameters.shippingOptions.forEach(option => { // Loop through the object array
        const optionElement = document.createElement('option');
        optionElement.value = option.optionName; // Set value to optionName
        optionElement.textContent = option.optionName; // Set textContent to optionName
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
    let totalOrderPrice = 0; // Initialize total order price
    let previousShippingCost = 0; // Store the cost of the previously selected shipping option

    const totalPriceValueElement = document.getElementById('order-total-price-value');

    function updateTotalPriceDisplay() {
        totalPriceValueElement.textContent = `PHP ${totalOrderPrice.toFixed(2)}`;
    }

    function addPrice(price) {
        totalOrderPrice += price;
        updateTotalPriceDisplay();
    }

    function subtractPrice(price) {
        totalOrderPrice -= price;
        updateTotalPriceDisplay();
    }

    function resetPrice() {
        totalOrderPrice = 0;
        updateTotalPriceDisplay();
    }

    updateTotalPriceDisplay(); // Initial display

    // --- Conditional Display Logic for Shipping Address and Total Price Area ---
    const shippingOptionSelect = document.getElementById('shippingOption');
    const shippingAddressGroup = document.querySelector('.form-group:has(#shippingAddress)');
    const totalPriceAreaElement = document.querySelector('.order-total-area');


    if (!shippingAddressGroup) {
        console.error("Shipping Address form group not found.");
    }
    if (!totalPriceAreaElement) {
        console.error("Total Price area form group not found.");
    }


    if (shippingAddressGroup && totalPriceAreaElement) {
        totalPriceAreaElement.style.display = 'block';
        const orderDescriptionGroup = totalPriceAreaElement.nextElementSibling;
        const formElement = totalPriceAreaElement.closest('form');

        // **--- Initially Hide Shipping Address on Page Load ---**
        shippingAddressGroup.style.display = 'none'; // <----- ADDED: Initial Hide


        shippingOptionSelect.addEventListener('change', function() {
            const selectedOptionName = shippingOptionSelect.value; // Get selected optionName
            let selectedOptionCost = 0; // Default cost if not found

            // Find the selected option's cost from ConfigParameters.shippingOptions
            const selectedOptionData = ConfigParameters.shippingOptions.find(option => option.optionName === selectedOptionName);
            if (selectedOptionData) {
                selectedOptionCost = selectedOptionData.optionCost;
            }

            // Subtract the previous shipping cost
            subtractPrice(previousShippingCost);

            // Add the new shipping cost
            addPrice(selectedOptionCost);

            // Update the previous shipping cost for the next change
            previousShippingCost = selectedOptionCost;


            const showShippingAddress = selectedOptionName.toLowerCase().includes('shipping');

            if (showShippingAddress) {
                shippingAddressGroup.style.display = 'block';
                if (shippingAddressGroup.nextElementSibling !== totalPriceAreaElement) {
                    formElement.insertBefore(totalPriceAreaElement, orderDescriptionGroup);
                }
            } else {
                shippingAddressGroup.style.display = 'none';
                formElement.insertBefore(totalPriceAreaElement, orderDescriptionGroup);
            }
        });
    }
});
