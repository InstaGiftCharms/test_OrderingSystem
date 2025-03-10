document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration Parameters (as before) ---
    const ConfigParameters = {
        slideshowImages: [
            'images/slide1.jpg',
            'images/slide2.jpg',
            'images/slide3.jpg'
        ],
        slideshowInterval: 5000, // 5 seconds for slideshow interval
        shippingOptions: [
            { optionName: 'Standard Delivery', optionCost: 50 },
            { optionName: 'Express Delivery', optionCost: 100 },
            { optionName: 'Pickup in-person', optionCost: 0 },
            { optionName: 'Pickup via On-Demand Delivery (Lalamove, Grab, etc.)', optionCost: 0 }
        ],
        shippingOptionText: [
            "Choose your preferred shipping method.  ",
            "For pick-up options, please coordinate schedule and pick-up point via chat after placing your order.",
            "On-demand delivery (Lalamove, Grab, etc.) bookings should be initiated and paid for by the customer."
        ],
        productInfo: [
            {
                productName: 'Charm 1',
                productForm: [
                    {
                        fieldName: 'charm1Color',
                        fieldType: 'radio',
                        fieldLabel: 'Color',
                        fieldOptions: ['Red', 'Blue', 'Green']
                    },
                    {
                        fieldName: 'charm1Quantity',
                        fieldType: 'number',
                        fieldLabel: 'Quantity',
                        fieldPlaceholder: 'Quantity',
                        fieldDefaultValue: 0
                    }
                ]
            },
            {
                productName: 'Charm 2',
                productForm: [
                    {
                        fieldName: 'charm2Engraving',
                        fieldType: 'text',
                        fieldLabel: 'Engraving Text',
                        fieldPlaceholder: 'Enter engraving text'
                    },
                    {
                        fieldName: 'charm2Color',
                        fieldType: 'radio',
                        fieldLabel: 'Color',
                        fieldOptions: ['Red', 'Blue', 'Green']
                    },
                    {
                        fieldName: 'charm2Quantity',
                        fieldType: 'number',
                        fieldLabel: 'Quantity',
                        fieldPlaceholder: 'Quantity',
                        fieldDefaultValue: 0
                    }
                ]
            }
            // ... more products can be added here ...
        ]
    };


    // --- Dynamic Form Class (as before) ---
    class DynamicForm {
        static drawform(formConfig) {
            let formHTML = '';
            formConfig.forEach(field => {
                formHTML += `<div class="form-group" id="dynamic-form-area">`; // OPENING form-group div here for all dynamic elements
                formHTML += `<label for="${field.fieldName}Label" class="dynamic-form-label">${field.fieldLabel}:</label><br>`; // Label outside for better layout

                if (field.fieldType === 'radio' || field.fieldType === 'checkbox') {
                    field.fieldOptions.forEach(option => {
                        formHTML += `
                        <div class="radio-checkbox-option">
                            <input type="${field.fieldType}" id="${field.fieldName}_${option}" name="${field.fieldName}" value="${option}" class="dynamic-form-input">
                            <label for="${field.fieldName}_${option}" class="dynamic-form-label">${option}</label>
                        </div>`;
                    });
                } else if (field.fieldType === 'number') {
                    formHTML += `<input type="number" id="${field.fieldName}" name="${field.fieldName}" placeholder="${field.fieldPlaceholder}" value="${field.fieldDefaultValue}" class="dynamic-form-input"><br>`;
                } else if (field.fieldType === 'text') {
                    formHTML += `<input type="text" id="${field.fieldName}" name="${field.fieldName}" placeholder="${field.fieldPlaceholder}" class="dynamic-form-input"><br>`;
                }
                formHTML += `</div>`; // CLOSING form-group div here
            });
            return formHTML;
        }

         static getformData(formConfig) {
            const formData = {};
            formConfig.forEach(field => {
                if (field.fieldType === 'radio' || field.fieldType === 'checkbox') {
                    const checkedValue = document.querySelector(`input[name="${field.fieldName}"]:checked`);
                    formData[field.fieldName] = checkedValue ? checkedValue.value : null;
                } else if (field.fieldType === 'number' || field.fieldType === 'text') {
                    formData[field.fieldName] = document.getElementById(field.fieldName).value;
                }
            });
            return formData;
        }
    }


    // Slideshow functionality (as before - no changes here)
    let slideIndex = 0;
    const slides = ConfigParameters.slideshowImages;
    const slideshowImage = document.getElementById('slideshow-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const indicatorsContainer = document.querySelector('.slideshow-indicators');

    function updateSlide(index) {
        slideshowImage.src = slides[index];
        slideshowImage.alt = `Slide ${index + 1} of ${slides.length}`;
        updateIndicators(index);
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
        updateIndicators(0);
    }

    function updateIndicators(currentIndex) {
        const indicators = document.querySelectorAll('.slideshow-indicators span');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    createIndicators();
    updateSlide(slideIndex);
    setInterval(nextSlide, ConfigParameters.slideshowInterval);

    // Populate shipping options dynamically (as before - no changes here)
    const shippingOptionDropdown = document.getElementById('shippingOption');
    ConfigParameters.shippingOptions.forEach(option => {
        let optionElement = document.createElement('option');
        optionElement.value = option.optionName;
        optionElement.textContent = `${option.optionName} ${option.optionCost > 0 ? '(PHP ' + option.optionCost.toFixed(2) + ')' : '(FREE)'}`;
        shippingOptionDropdown.appendChild(optionElement);
    });

    // Set Shipping Options Explanation Text (as before - no changes here)
    const shippingExplanation = document.getElementById('shipping-options-explanation');
    let explanationHTML = '';
    ConfigParameters.shippingOptionText.forEach(paragraph => {
        explanationHTML += `<p>${paragraph}</p>`;
    });
    shippingExplanation.innerHTML = explanationHTML;


    // --- Function to Calculate and Display Total Order Price (as before - no changes here) ---
    function calculateOrderTotal() {
        let subtotal = 0;

        const productSelection = document.getElementById('productSelection').value;
        if (productSelection) {
            const selectedProductInfo = ConfigParameters.productInfo.find(product => product.productName === productSelection);
            if (selectedProductInfo && selectedProductInfo.productForm) {
                const formData = DynamicForm.getformData(selectedProductInfo.productForm);
                subtotal += 100;
                console.log("Form Data:", formData);
            }
        }

        let shippingCost = 0;
        const selectedShippingOption = shippingOptionDropdown.value;
        if (selectedShippingOption) {
            const selectedShipping = ConfigParameters.shippingOptions.find(option => option.optionName === selectedShippingOption);
            if (selectedShipping) {
                shippingCost = selectedShipping.optionCost;
            }
        }

        const totalOrderPrice = subtotal + shippingCost;
        const orderTotalPriceValue = document.getElementById('order-total-price-value');
        orderTotalPriceValue.textContent = `PHP ${totalOrderPrice.toFixed(2)}`;
    }


    shippingOptionDropdown.addEventListener('change', calculateOrderTotal);


    // --- Conditional Display Logic for Shipping Address -  REPLACED SECTION - ---
    const shipToDifferentAddressCheckbox = document.getElementById('ship-to-different-address');
    const shippingAddressSection = document.getElementById('shipping-address-section');
    const shippingOptionDropdown = document.getElementById('shippingOption'); // Make sure to get the shippingOptionDropdown

    function toggleShippingAddressVisibility() {
        const selectedShippingOption = shippingOptionDropdown.value;
        const pickupOptions = ["Pickup in-person", "Pickup via On-Demand Delivery (Lalamove, Grab, etc.)"];

        if (pickupOptions.includes(selectedShippingOption) || !shipToDifferentAddressCheckbox.checked) {
            shippingAddressSection.style.display = 'none';
        } else {
            shippingAddressSection.style.display = 'block';
        }
    }

    // --- INITIAL STATE - IMPORTANT: HIDE ON PAGE LOAD ---
    shippingAddressSection.style.display = 'none';

    // --- EVENT LISTENERS ---
    shipToDifferentAddressCheckbox.addEventListener('change', toggleShippingAddressVisibility);
    shippingOptionDropdown.addEventListener('change', toggleShippingAddressVisibility);

    // --- INITIAL CALL TO SET VISIBILITY ON LOAD ---
    toggleShippingAddressVisibility();


    // Populate Product Selection Dropdown (as before - no changes here)
    const productDropdown = document.getElementById('productSelection');
    ConfigParameters.productInfo.forEach(product => {
        let option = document.createElement('option');
        option.value = product.productName;
        option.textContent = product.productName;
        productDropdown.appendChild(option);
    });


    // Add to Cart Button Functionality (Placeholder) (as before - no changes here)
    const addToCartButton = document.getElementById('add-to-cart-button');
    addToCartButton.addEventListener('click', function() {
        const selectedProduct = productDropdown.value;
        if (selectedProduct) {
            const selectedProductInfo = ConfigParameters.productInfo.find(product => product.productName === selectedProduct);
            if (selectedProductInfo && selectedProductInfo.productForm) {
                const formData = DynamicForm.getformData(selectedProductInfo.productForm);
                alert(`Added to Cart: ${selectedProduct}, Options: ${formData || 'None'}`);
            } else {
                alert(`Added to Cart: ${selectedProduct} (No Options)`);
            }
        } else {
            alert("Please select a product before adding to cart.");
        }
    });


    // Dynamic Form Population based on Product Selection (as before - no changes here)
    const productSelectionDropdown = document.getElementById('productSelection');
    const dynamicFormArea = document.getElementById('dynamic-form-area');

    productSelectionDropdown.addEventListener('change', function() {
        const selectedProductName = productSelectionDropdown.value;
        dynamicFormArea.innerHTML = '';

        if (selectedProductName) {
            const selectedProductInfo = ConfigParameters.productInfo.find(product => product.productName === selectedProductName);
            if (selectedProductInfo && selectedProductInfo.productForm) {
                const formHTML = DynamicForm.drawform(selectedProductInfo.productForm);
                dynamicFormArea.innerHTML = formHTML;
            } else {
                dynamicFormArea.innerHTML = '<p>No additional options for this product.</p>';
            }
        }
    });


});
