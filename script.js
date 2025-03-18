// Current/script.js
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

    const cartItemsContainer = document.getElementById('cart-items-container'); // Get the container for cart items
    const orderTotalPriceValue = document.getElementById('order-total-price-value'); // Get the element to display total price
    const shippingOptionDropdown = document.getElementById('shippingOption'); // Get the shipping option dropdown
    const emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message'); // Get the empty cart message element
    const orderReferenceInput = document.getElementById('orderReferenceNumber');
    const orderReferenceDisplay = document.getElementById('orderReferenceNumberDisplay');
    const orderDescriptionTextarea = document.getElementById('orderDescription');
    const orderForm = document.querySelector('form');
    const submitButton = orderForm.querySelector('button[type="submit"]'); // Get the submit button
    submitButton.disabled = true; // Disable the submit button on initial load

    // Function to generate order reference number
    function generateOrderReference() {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const year = now.getFullYear().toString().slice(-2);
        const randomNumber = Math.floor(Math.random() * 4096); // 0 to 4095 (0xFFF)
        const hexString = randomNumber.toString(16).toUpperCase().padStart(3, '0');
        return `${month}${day}${year}${hexString}`;
    }

    // Generate and set the order reference number
    const orderReference = generateOrderReference();
    orderReferenceInput.value = orderReference;
    orderReferenceDisplay.textContent = `#${orderReference}`;


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

    // Set Payment Instruction Text
    const paymentInstructionArea = document.getElementById('payment-instruction-area');
    const paymentInstructionTextElement = document.getElementById('payment-instruction-text');
    let paymentInstructionHTML = '';
    configParameters.paymentInstructionText.forEach(paragraph => { // Access static property
        paymentInstructionHTML += `<p>${paragraph}</p>`;
    });

    // Add the two new lines to the payment instruction HTML
    paymentInstructionHTML += `<p id="emailSubjectLine"></p>`;


    paymentInstructionTextElement.innerHTML = paymentInstructionHTML;
    paymentInstructionArea.style.display = 'block'; // Ensure the section is visible

    // Create the payment instruction header
    const paymentHeader = document.createElement('h3');
    paymentHeader.textContent = `Payment Instruction for Order #${orderReference}`;
    paymentHeader.classList.add('payment-instruction-header'); // Add a class for styling

    // Insert the header at the beginning of the payment instruction area
    paymentInstructionArea.insertBefore(paymentHeader, paymentInstructionArea.firstChild);


    // --- Function to calculate the total price of items in the cart ---
    function calculateCartTotal() {
        let cartTotal = 0;
        const cartItems = cartItemsContainer.querySelectorAll('.cart-item');

        if (cartItems.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block'; // Show the empty cart message
            } else {
                cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Please add items using the product selection section of the form.</p>';
            }
            if (submitButton) {
                submitButton.disabled = true; // Disable submit button if cart is empty
            }
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none'; // Hide the empty cart message if items exist
            }
            cartItems.forEach(item => {
                const priceText = item.querySelector('.cart-item-price').textContent;
                const parts = priceText.split(' x ');
                if (parts.length === 2) {
                    const price = parseFloat(parts[0].replace('PHP ', ''));
                    const quantity = parseInt(parts[1]);
                    if (!isNaN(price) && !isNaN(quantity)) {
                        cartTotal += price * quantity;
                    }
                }
            });
            if (submitButton) {
                submitButton.disabled = false; // Enable submit button if cart has items
            }
        }


        // --- Add Shipping Cost ---
        let shippingCost = 0;
        const selectedShippingOption = shippingOptionDropdown.value;
        if (selectedShippingOption) {
            const selectedShipping = configParameters.shippingOptions.find(option => option.optionName === selectedShippingOption); // Access static property
            if (selectedShipping) {
                shippingCost = selectedShipping.optionCost;
            }
        }

        const totalOrderPrice = cartTotal + shippingCost;
        orderTotalPriceValue.textContent = `PHP ${totalOrderPrice.toFixed(2)}`;
    }


    // --- Conditional Display Logic for Shipping Address ---
    const shippingAddressField = document.querySelector('.form-group:has(> label[for="shippingAddress"])'); // Selects the form-group containing Shipping Address
    function toggleShippingAddressVisibility() {
        const selectedShippingOption = shippingOptionDropdown.value;
        // --- MODIFIED CONDITION: Check if the selected option includes "shipping" (case-insensitive) ---
        if (selectedShippingOption.toLowerCase().includes("shipping")) {
            shippingAddressField.style.display = 'block'; // Show if shipping option is selected
        } else {
            shippingAddressField.style.display = 'none'; // Hide otherwise
        }
    }

    shippingOptionDropdown.addEventListener('change', toggleShippingAddressVisibility);
    // --- Call calculateCartTotal when shipping option changes ---
    shippingOptionDropdown.addEventListener('change', calculateCartTotal);
    toggleShippingAddressVisibility(); // Initial call to set correct visibility on page load
    calculateCartTotal(); // Initial call to display empty cart message and total


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
            if (selectedProductInfo) {
                const productName = selectedProductInfo.productName;
                const productImage = selectedProductInfo.productImage;
                const productForm = selectedProductInfo.productForm;
                let quantity = 1; // Default quantity
                let basePrice = 0;
                let formData = {};

                // Extract base price from product name
                const priceMatch = productName.match(/\(([^)]*?)([\d.]+)\sPHP\)/);
                if (priceMatch && priceMatch[2]) {
                    basePrice = parseFloat(priceMatch[2]);
                }

                if (productForm) {
                    formData = DynamicForm.getFormData(productForm);
                    console.log("Form Data for Product: " + selectedProduct, formData); // Console log only - NO ALERT
                    // Extract quantity if it exists in the form data
                    const quantityField = formData['num_itemQuantity'];
                    if (quantityField) {
                        quantity = parseInt(quantityField.split(': ')[1]); // Assuming format '05|Quantity: X'
                        if (isNaN(quantity) || quantity < 1) {
                            quantity = 1; // Ensure quantity is at least 1
                        }
                        delete formData['num_itemQuantity']; // Remove quantity from form data display
                    }
                    // alert(`Form data for product "${selectedProduct}" has been logged to the console.`); // REMOVED ALERT
                } else {
                    console.log(`Added to Cart: ${selectedProduct} (No Options)`); // Console log only - NO ALERT
                    // alert(`Added to Cart: ${selectedProduct} (No Options)`); // REMOVED ALERT
                }

                // --- Calculate total item price ---
                let totalItemPrice = basePrice;
                const formDataValues = Object.values(formData)
                    .sort()
                    .map(value => {
                        const parts = value.split('|');
                        return parts.length > 1 ? parts[1].trim() : value.trim();
                    });

                formDataValues.forEach(detail => {
                    const priceMatch = detail.match(/\(([^)]*?)([\d.]+)\sPHP\)/);
                    if (priceMatch && priceMatch[2]) {
                        totalItemPrice += parseFloat(priceMatch[2]);
                    }
                });


                // --- Add item to the shopping cart ---
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                const img = document.createElement('img');
                img.src = productImage;
                img.alt = productName;

                const itemInfo = document.createElement('div');
                itemInfo.classList.add('cart-item-info');

                const itemName = document.createElement('div');
                itemName.classList.add('cart-item-name');
                itemName.textContent = productName.split('(')[0].trim(); // Display only the name

                const itemPrice = document.createElement('div');
                itemPrice.classList.add('cart-item-price');
                itemPrice.textContent = `PHP ${(totalItemPrice).toFixed(2)} x ${quantity}`;

                itemInfo.appendChild(itemName);
                itemInfo.appendChild(itemPrice);

                // --- Add form data details to cart item ---
                formDataValues.forEach(detail => {
                    const priceMatch = detail.match(/\(([^)]*?)([\d.]+)\sPHP\)/);
                    let displayText = detail;
                    if (priceMatch) {
                        const beforeNumber = detail.substring(0, detail.indexOf(priceMatch[0]));
                        displayText = beforeNumber.trim();
                    }
                    if (displayText) {
                        const detailDiv = document.createElement('div');
                        detailDiv.classList.add('cart-item-detail');
                        detailDiv.textContent = displayText;
                        itemInfo.appendChild(detailDiv);
                    }
                });


                const removeButton = document.createElement('button');
                removeButton.classList.add('cart-item-remove-button');
                removeButton.textContent = 'REMOVE';
                removeButton.addEventListener('click', function() {
                    cartItemsContainer.removeChild(cartItem);
                    calculateCartTotal(); // Recalculate total after removing item
                });

                cartItem.appendChild(img);
                cartItem.appendChild(itemInfo);
                cartItem.appendChild(removeButton);

                cartItemsContainer.appendChild(cartItem);
                calculateCartTotal(); // Calculate total after adding item

                // --- Reset product info area ---
                productDropdown.selectedIndex = 0; // Reset the dropdown to the first option
                dynamicFormArea.innerHTML = ''; // Clear the dynamic form area
                productDropdown.focus(); // Set focus back to the product dropdown
            } else {
                console.error(`Product information not found for: ${selectedProduct}`);
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

    // --- Convert Cart to Text and Add to Order Description before Submit ---
    orderForm.addEventListener('submit', function(event) {
        const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
        let orderDescription = "Order Items:\n";

        if (cartItems.length === 0) {
            orderDescription += "No items in cart.\n";
        } else {
            cartItems.forEach(item => {
                const itemName = item.querySelector('.cart-item-name').textContent;
                const itemPrice = item.querySelector('.cart-item-price').textContent;
                const itemDetails = item.querySelectorAll('.cart-item-detail');
                orderDescription += `- ${itemName}, ${itemPrice}`;
                itemDetails.forEach(detail => {
                    orderDescription += `, ${detail.textContent}`;
                });
                orderDescription += "\n";
            });
        }

        const shippingOption = shippingOptionDropdown.options[shippingOptionDropdown.selectedIndex].text;
        orderDescription += `\nShipping Option: ${shippingOption}\n`;

        const totalPrice = document.getElementById('order-total-price-value').textContent;
        orderDescription += `Total Price: ${totalPrice}\n`;

        orderDescriptionTextarea.value = orderDescription;

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const orderReferenceNumber = document.getElementById('orderReferenceNumber').value;
        const emailSubject = `PROOF OF PAYMENT ${firstName} ${lastName} ${orderReferenceNumber}`;
        document.getElementById('emailSubjectLine').textContent = `Email Subject: ${emailSubject}`;
        // You would typically handle sending this email using a server-side process.
    });

});
