// --- Import ConfigParameters if you are using JavaScript modules ---
// import ConfigParameters from './configParameters.js';  // <--- UNCOMMENT THIS LINE IF YOU ARE USING MODULES

// --- Function to Toggle Image Highlight - NOW IN GLOBAL SCOPE ---
function toggleImageHighlight(imageId) {
    const imgElement = document.getElementById(imageId);
    if (imgElement) {
        imgElement.classList.toggle('highlighted-img'); // Toggle CSS class
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration Parameters (if NOT using modules, ConfigParameters is assumed to be globally available from configParameters.js) ---
    const configParameters = ConfigParameters; // <--- ACCESS ConfigParameters CLASS LIKE THIS


    // Slideshow functionality
    let slideIndex = 0;
    const slides = configParameters.slideshowImages; // Access static property using class name
    const slideshowImage = document.getElementById('slideshow-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const indicatorsContainer = document.querySelector('.slideshow-indicators');

    function updateSlide(index) {
        slideshowImage.src = slides[index];
        slideshowImage.alt = `Slide ${index + 1} of ${slides.length}`; // Alt text for accessibility
        updateIndicators(index); // Update indicators to reflect current slide
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        updateSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        updateSlide(slideIndex);
    }

    function createIndicators() {
        slides.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.classList.add('slideshow-indicator');
            indicator.addEventListener('click', () => {
                slideIndex = index;
                updateSlide(slideIndex);
            });
            indicatorsContainer.appendChild(indicator);
        });
        updateIndicators(0); // Highlight the first indicator initially
    }

    function updateIndicators(currentIndex) {
        const indicators = document.querySelectorAll('.slideshow-indicators span');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }


    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Initialize slideshow
    createIndicators();
    updateSlide(slideIndex);
    setInterval(nextSlide, configParameters.slideshowInterval); // Access static property

    // Populate shipping options dynamically
    const shippingOptionDropdown = document.getElementById('shippingOption');
    configParameters.shippingOptions.forEach(option => { // Access static property
        let optionElement = document.createElement('option');
        optionElement.value = option.optionName;
        optionElement.textContent = `${option.optionName} ${option.optionCost > 0 ? '(PHP ' + option.optionCost.toFixed(2) + ')' : ''}`;
        shippingOptionDropdown.appendChild(optionElement);
    });

    // Set Shipping Options Explanation Text
    const shippingExplanation = document.getElementById('shipping-options-explanation');
    let explanationHTML = '';
    configParameters.shippingOptionText.forEach(paragraph => { // Access static property
        explanationHTML += `<p>${paragraph}</p>`;
    });
    shippingExplanation.innerHTML = explanationHTML;


    // --- Function to Calculate and Display Total Order Price ---
    function calculateOrderTotal() {
        let subtotal = 0;

        // --- Get Dynamic Form Data and Calculate Subtotal ---
        const productSelection = document.getElementById('productSelection').value;
        if (productSelection) {
            const selectedProductInfo = configParameters.productInfo.find(product => product.productName === productSelection); // Access static property
            if (selectedProductInfo && selectedProductInfo.productForm) {
                const formData = DynamicForm.getFormData(selectedProductInfo.productForm);
                // --- Basic Subtotal Calculation (needs to be product & form-aware) ---
                // --- Placeholder: Assuming each product has a base price of 100 for now ---
                // subtotal += 100; //  <--- Placeholder subtotal calculation - needs to be dynamic  - REMOVED THIS LINE
                console.log("Form Data:", formData); // Log form data for now
            }
        }


        // --- Shipping Cost ---
        let shippingCost = 0;
        const selectedShippingOption = shippingOptionDropdown.value;
        if (selectedShippingOption) {
            const selectedShipping = configParameters.shippingOptions.find(option => option.optionName === selectedShippingOption); // Access static property
            if (selectedShipping) {
                shippingCost = selectedShipping.optionCost;
            }
        }

        const totalOrderPrice = subtotal + shippingCost;

        // --- Display Order Total ---
        const orderTotalPriceValue = document.getElementById('order-total-price-value');
        orderTotalPriceValue.textContent = `PHP ${totalOrderPrice.toFixed(2)}`;
    }


    // --- Attach calculateOrderTotal to relevant events ---
    shippingOptionDropdown.addEventListener('change', calculateOrderTotal);
    // --- Need to attach calculateOrderTotal to dynamic form changes as well (to be implemented) ---


    // --- Conditional Display Logic for Shipping Address ---
    const shippingAddressField = document.querySelector('.form-group:has(> label[for="shippingAddress"])'); // Selects the form-group containing Shipping Address
    function toggleShippingAddressVisibility() {
        const selectedShippingOption = shippingOptionDropdown.value;
        const pickupOptions = ["Pickup in-person", "Pickup via On-Demand Delivery (Lalamove, Grab, etc.)"]; // Array of pickup options

        if (pickupOptions.includes(selectedShippingOption)) {
            shippingAddressField.style.display = 'none'; // Hide if pickup option is selected
        } else {
            shippingAddressField.style.display = 'block'; // Show otherwise
        }
    }

    shippingOptionDropdown.addEventListener('change', toggleShippingAddressVisibility);
    toggleShippingAddressVisibility(); // Initial call to set correct visibility on page load


    // --- Populate Product Selection Dropdown ---
    const productDropdown = document.getElementById('productSelection');
    configParameters.productInfo.forEach(product => { // Access static property
        let option = document.createElement('option');
        option.value = product.productName;
        option.textContent = product.productName;
        productDropdown.appendChild(option);
    });


    // --- Add to Cart Button Functionality  ---
    const addToCartButton = document.getElementById('add-to-cart-button'); // --- CORRECTED ID to 'add-to-cart-button' to match your code
    addToCartButton.addEventListener('click', function() {
        const selectedProduct = productDropdown.value;
        if (selectedProduct) {
            // --- Get Dynamic Form Data ---
            const selectedProductInfo = configParameters.productInfo.find(product => product.productName === selectedProduct); // Access static property
            if (selectedProductInfo && selectedProductInfo.productForm) {
                const formData = DynamicForm.getFormData(selectedProductInfo.productForm);
                console.log("Form Data for Product: " + selectedProduct, formData);
                // alert(`Form data for product "${selectedProduct}" has been logged to the console.`); // REMOVED ALERT
            } else {
                console.log(`Added to Cart: ${selectedProduct} (No Options - no dynamic form data to collect)`);
                // alert(`Added to Cart: ${selectedProduct} (No Options)`); // REMOVED ALERT
            }
        } else {
            // alert("Please select a product before adding to cart."); // KEPT ALERT - this one is important for user guidance if no product selected
        }
    });


    // --- Dynamic Form Population based on Product Selection ---
    const productSelectionDropdown = document.getElementById('productSelection');
    const dynamicFormArea = document.getElementById('dynamic-form-area');

    productSelectionDropdown.addEventListener('change', function() {
        const selectedProductName = productSelectionDropdown.value;
        dynamicFormArea.innerHTML = ''; // Clear previous form

        if (selectedProductName) {
            const selectedProductInfo = configParameters.productInfo.find(product => product.productName === selectedProductName); // Access static property
            if (selectedProductInfo && selectedProductInfo.productForm) {
                const formHTML = DynamicForm.drawform(selectedProductInfo.productForm);
                dynamicFormArea.innerHTML = formHTML;
            } else {
                dynamicFormArea.innerHTML = '<p>No additional options for this product.</p>'; // Optional message if no form defined
            }
        }
    });


    // ---  Function to put a Cart Item in "Your Cart" area ---
    function putACartItem(inp_Text, inp_Num, inp_imgURL) {
        const cartArea = document.querySelector('#user-cart-area'); // <---- UPDATED SELECTOR to #user-cart-area
        if (!cartArea) {
            console.error("Cart area not found!");
            return;
        }

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item'); // Add a class for styling if needed

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('cart-item-image-container');
        const imageElem = document.createElement('img');
        imageElem.src = inp_imgURL;
        imageElem.alt = "Cart Item Image";
        imageElem.classList.add('cart-item-image');
        imageContainer.appendChild(imageElem);

        const textContainer = document.createElement('div');
        textContainer.classList.add('cart-item-text-container');
        const textElem = document.createElement('p');
        textElem.classList.add('cart-item-text');
        textElem.textContent = inp_Text;
        textContainer.appendChild(textElem);

        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('cart-item-quantity-container');
        const quantityElem = document.createElement('span');
        quantityElem.classList.add('cart-item-quantity');
        quantityElem.textContent = inp_Num + " X";
        quantityContainer.appendChild(quantityElem);

        const removeButton = document.createElement('button');
        removeButton.classList.add('cart-item-remove-button');
        removeButton.textContent = "X"; // Placeholder button text
        // --- Add event listener for remove button functionality later ---
        quantityContainer.appendChild(removeButton);


        cartItemDiv.appendChild(imageContainer);
        cartItemDiv.appendChild(textContainer);
        cartItemDiv.appendChild(quantityContainer);

        cartArea.appendChild(cartItemDiv); // Append the cart item to the cart area
    }


    // --- Test line for putACartItem function ---
    putACartItem("Sample Cart Item Text", 3, "images/charm-red.png"); // Example usage
    putACartItem("Another Item for Cart", 1, "images/charm-blue.png"); // Another example usage


});
