/**
 * DynamicForm Class for Generating HTML Forms from Configuration Objects.
 *
 * This class provides static methods to dynamically generate HTML forms based on
 * a configuration object and to extract data from these forms. It supports various
 * form field types including labels, textboxes, quantity inputs, radio buttons,
 * checkboxes, and clickable images with highlight functionality.
 *
 * --- Form Configuration (formConfig Array) ---
 *
 * The `drawform(formConfig)` method accepts an array of `formConfig` objects. Each object in this array
 * defines a form field and has the following common and type-specific properties:
 *
 * Common Properties (for all field types):
 * - type:      {string}  - Type of form field. Supported types are: 'label', 'radio', 'checkbox', 'quantity', 'textbox', 'img'.
 * - id:        {string}  - Unique HTML 'id' attribute for the form field element. This is used to retrieve data using `getFormData`.
 * - value:     {string}  - For 'label', 'textbox', 'quantity', and 'img' types, this is the default text or placeholder.
 * - For 'radio' and 'checkbox' types, this is a semicolon-separated string of options.
 * - responsePrefix: {string, optional} - A string prefix to be added to the value of this form field when data is extracted using `getFormData`.
 * If not provided, no prefix is added (defaults to "").
 *
 * Type-Specific Properties:
 * - For 'img' type:
 * - value:    {string} -  Can be just the image URL (e.g., "images/image.png").
 * -  Or a string with both visible text and URL, formatted as '"Visible Text":"imageURL"' (e.g., '"Red Button":"images/red-button.png"').
 * If the format with visible text is used, the text will be displayed below the image.
 *
 * --- Image Highlighting Behavior (for 'img' type) ---
 *
 * - Clickable Images: Images generated with the 'img' type are clickable.
 * - Toggle Highlight: Clicking an image toggles a highlight effect (thick black border).
 * - Highlight Indication: The highlight visually indicates that the image is selected.
 * - Data Extraction: When `getFormData()` is called, for each 'img' type field that is highlighted, the function will return
 * its associated visible text (if provided in the 'value' property during form configuration) as the field's value.
 * If no visible text was provided, or if the image is not highlighted, no value (or an empty string based on responsePrefix) will be returned for that image field.
 *
 * --- getFormData(formConfig) Method ---
 *
 * The `getFormData(formConfig)` method extracts data from a form generated using `drawform()`.
 *
 * @param {Array<Object>} formConfig - The same form configuration array that was used to generate the form.
 * @returns {Object}                  - An object where keys are the 'id' of each form field from `formConfig`,
 * and values are the user's input or selection for that field, prefixed with the field's 'responsePrefix' (if defined).
 * For 'img' type fields that are highlighted, the value will be the associated visible text (prefixed).
 * For unselected 'radio', 'checkbox', non-highlighted 'img' fields, or empty 'textbox', the value will be just the prefix (or empty string if no prefix).
 */
class DynamicForm {
    /**
     * Generates HTML for a dynamic form based on the provided form configuration.
     *
     * @param {Array<Object>} formConfig - An array of field configuration objects.
     * @returns {string} HTML string representing the form.
     */
    static drawform(formConfig) {
        let formHTML = '';
        formConfig.forEach(field => {
            formHTML += `<div class="form-group" id="dynamic-form-area">`; // OPENING form-group div here for all dynamic elements

            if (field.type === 'label') {
                formHTML += `<label id="${field.id}" class="dynamic-form-label">${field.value}</label>`;
            } else if (field.type !== 'img' && field.type !== 'radio' && field.type !== 'checkbox' && field.type !== 'textbox') { // Exclude 'textbox' from label generation
                formHTML += `<label for="${field.id}" class="dynamic-form-label">${field.value}:</label>`;
            }


            if (field.type === 'radio') {
                // formHTML += `<label for="${field.id}" class="dynamic-form-label">${field.value}:</label><br>`; // REMOVED - unwanted top label
                const options = field.value.split(';'); // Options are semicolon-separated in 'value'
                options.forEach(option => {
                    const optionId = `${field.id}_${option.replace(/\s/g, '')}`; // Create unique ID for each radio option
                    formHTML += `
                    <div class="radio-checkbox-option">
                        <input type="radio" id="${optionId}" name="${field.id}" value="${option}" class="dynamic-form-input">
                        <label for="${optionId}" class="dynamic-form-label">${option}</label>
                    </div>`;
                });
            } else if (field.type === 'checkbox') {
                // formHTML += `<label for="${field.id}" class="dynamic-form-label">${field.value}:</label><br>`; // REMOVED - unwanted top label
                const options = field.value.split(';'); // Options are semicolon-separated in 'value'
                options.forEach(option => {
                    const optionId = `${field.id}_${option.replace(/\s/g, '')}`; // Create unique ID for each checkbox option
                    formHTML += `
                    <div class="radio-checkbox-option">
                        <input type="checkbox" id="${optionId}" name="${field.id}" value="${option}" class="dynamic-form-input">
                        <label for="${optionId}" class="dynamic-form-label">${option}</label>
                    </div>`;
                });
            } else if (field.type === 'quantity') {
                formHTML += `<input type="number" id="${field.id}" name="${field.id}" placeholder="${field.value}" value="0" class="dynamic-form-input">`;
            } else if (field.type === 'textbox') {
                formHTML += `<input type="text" id="${field.id}" name="${field.id}" placeholder="${field.value}" class="dynamic-form-input">`;
            } else if (field.type === 'img') {
                // --- Handling the 'img' field type - WITH VISIBLE TEXT LABEL - AND CLICK HIGHLIGHT ---
                if (field.value) {
                    let imageURL = '';
                    let visibleText = ''; // Text to display next to the image
                    const defaultAltText = `Image for ${field.id}`;
                    let altText = defaultAltText; // Default alt text if no better option


                    // Parse field.value to extract URL and potential caption for visible text
                    if (field.value.startsWith('"')) {
                        const valueParts = field.value.split('":"'); // Split by ":" only ONCE after first quote
                        if (valueParts.length === 2) {
                            visibleText = valueParts[0].replace('"', ''); // Use caption as visible text
                            imageURL = valueParts[1].replace('"', '').slice(0, -1); // Get URL and remove trailing quote
                            altText = visibleText || defaultAltText; // Use caption as altText if available, otherwise default
                        } else {
                            // If split fails, assume whole value is URL (no caption)
                            imageURL = valueParts[1].replace(/"/g, ''); // Remove all quotes, treat as URL
                            visibleText = field.id; // Fallback visible text is field ID
                            altText = defaultAltText; // Default alt text
                            console.warn(`DynamicForm: Img field value format incorrect for id: ${field.id}. Assuming URL only.`);
                        }
                    } else {
                        // If no starting quote, assume whole value is URL (no caption)
                        imageURL = field.value.replace(/"/g, ''); // Remove any quotes, treat as URL
                        visibleText = field.id; // Fallback visible text is field ID
                        altText = defaultAltText; // Default alt text
                    }


                    formHTML += `
                    <div class="dynamic-form-img-container">
                        <img id="${field.id}" src="${imageURL}" alt="${altText}" class="dynamic-form-img" onclick="toggleImageHighlight('${field.id}')">
                        <span class="dynamic-form-img-visible-text">${visibleText}</span>
                    </div>`;
                } else {
                    formHTML += `<p>Image value not provided for field: ${field.id}</p>`; // Fallback if value is missing
                }
            }

            formHTML += `</div>`; // CLOSING form-group div here
        });
        return formHTML;
    }

    /**
     * Extracts form data from the dynamically generated form.
     *
     * @param {Array<Object>} formConfig - The same form configuration array used to generate the form.
     * @returns {Object} An object containing the form data, where keys are field IDs and values are user inputs.
     */
    static getFormData(formConfig) { // <----- REMOVED productResponsePrefix PARAMETER - prefix is now per-field
        const formData = {};
        formConfig.forEach(field => {
            let fieldValue = null; // Initialize to null
            const prefix = field.responsePrefix || ""; // Get responsePrefix from field, default to empty string if not defined <----- GET PREFIX

            if (field.type === 'radio' || field.type === 'checkbox') {
                const checkedValue = document.querySelector(`input[name="${field.id}"]:checked`);
                fieldValue = checkedValue ? checkedValue.value : null;
            } else if (field.type === 'quantity' || field.type === 'textbox') {
                fieldValue = document.getElementById(field.id).value;
            } else if (field.type === 'img') { // --- Check for highlighted images and get their labels ---
                const imgElement = document.getElementById(field.id);
                if (imgElement && imgElement.classList.contains('highlighted-img')) {
                    // Get the visible text (label) from the sibling span element
                    const labelSpan = imgElement.nextElementSibling; // Assuming span is immediately after img
                    fieldValue = labelSpan ? labelSpan.textContent : null; // Get textContent if span exists
                }
            }

            // --- Apply filtering conditions BEFORE adding to formData ---
            if (fieldValue !== null && fieldValue !== "" && !(field.type === 'img' && fieldValue === null)) { // <----- FILTERING LOGIC
                formData[field.id] = prefix + fieldValue; // <----- ADD PREFIX HERE - now using per-field prefix
            }
            // --- If fieldValue is null, empty string, or unhighlighted image, it will NOT be added to formData
        });
        return formData;
    }
}
