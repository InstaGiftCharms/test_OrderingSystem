document.addEventListener('DOMContentLoaded', () => {
    const productSelector = document.getElementById('productSelector');
    const dynamicFormArea = document.getElementById('dynamic-form-area');
    const slideshowImage = document.getElementById('slideshow-image');
    const slideshowIndicators = document.querySelector('.slideshow-indicators');
    const prevSlideButton = document.getElementById('prevSlide');
    const nextSlideButton = document.getElementById('nextSlide');
    const addToCartButton = document.getElementById('addToCartButton'); // <-- GET ADD TO CART BUTTON

    let currentSlideIndex = 0;
    let slideshowIntervalId;

    // --- Slideshow Functionality ---
    function updateSlide(index) {
        slideshowImage.src = ConfigParameters.slideshowImages[index];
        updateIndicators(index);
    }

    function updateIndicators(index) {
        const indicators = slideshowIndicators.querySelectorAll('span');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    function startSlideshow() {
        slideshowIntervalId = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % ConfigParameters.slideshowImages.length;
            updateSlide(currentSlideIndex);
        }, ConfigParameters.slideshowInterval);
    }

    function stopSlideshow() {
        clearInterval(slideshowIntervalId);
    }

    prevSlideButton.addEventListener('click', () => {
        stopSlideshow();
        currentSlideIndex = (currentSlideIndex - 1 + ConfigParameters.slideshowImages.length) % ConfigParameters.slideshowImages.length;
        updateSlide(currentSlideIndex);
        startSlideshow();
    });

    nextSlideButton.addEventListener('click', () => {
        stopSlideshow();
        currentSlideIndex = (currentSlideIndex + 1) % ConfigParameters.slideshowImages.length;
        updateSlide(currentSlideIndex);
        startSlideshow();
    });

    ConfigParameters.slideshowImages.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => {
            stopSlideshow();
            updateSlide(index);
            currentSlideIndex = index;
            startSlideshow();
        });
        slideshowIndicators.appendChild(indicator);
    });

    updateSlide(currentSlideIndex);
    startSlideshow();


    // --- Dynamic Form Generation ---
    function populateProductSelector() {
        ConfigParameters.productInfo.forEach(product => {
            const option = document.createElement('option');
            option.value = product.productName; // Use productName as value
            option.textContent = product.productName;
            productSelector.appendChild(option);
        });
    }

    function updateDynamicForm(selectedProductName) {
        dynamicFormArea.innerHTML = ''; // Clear existing form

        if (selectedProductName) {
            const selectedProduct = ConfigParameters.productInfo.find(product => product.productName === selectedProductName);
            if (selectedProduct) {
                const formHTML = DynamicForm.drawform(selectedProduct.productForm);
                dynamicFormArea.innerHTML = formHTML;
            }
        }
    }

    productSelector.addEventListener('change', (event) => {
        const selectedProductName = event.target.value;
        updateDynamicForm(selectedProductName);
    });

    populateProductSelector();
    updateDynamicForm(productSelector.value); // Initial form on page load


    // --- Add to Cart Button Functionality ---
    addToCartButton.addEventListener('click', () => { // <-- ADD EVENT LISTENER TO BUTTON
        const selectedProductName = productSelector.value; // Get selected product name again
        if (selectedProductName) {
            const selectedProduct = ConfigParameters.productInfo.find(product => product.productName === selectedProductName); // Find product info
            if (selectedProduct) {
                const formData = DynamicForm.getformData(selectedProduct.productForm); // Get form data using productForm
                console.log("Form Data for", selectedProductName + ":", formData); // Log to console
                alert("Form data logged to console for product: " + selectedProductName); // Basic feedback for now
            } else {
                console.warn("Product configuration not found for:", selectedProductName);
            }
        } else {
            console.warn("No product selected.");
        }
    });

});
