/**
 * DynamicForm Class for Generating HTML Forms from Configuration Objects.
 *
 * This class provides static methods to dynamically create HTML form sections based on a
 * configuration object. It supports various input types (label, textbox, radio, checkbox, quantity, img)
 * and includes methods to both render the HTML form and extract data from it.
 *
 * Usage:
 *
 * 1. Define Form Configuration:
 *    Create a JavaScript object (e.g., in ConfigParameters.productInfo[].productForm)
 *    that describes the form fields. Each field in the configuration should be an object
 *    with the following properties:
 *
 *    - type (string, required): Type of form field. Supported types:
 *      - "label": Display text label. Value is the label text.
 *      - "textbox": Single-line text input. Value is placeholder text.
 *      - "textarea": Multi-line text input. Value is placeholder text. (To be implemented if needed)
 *      - "radio": Radio button group. Value is a semicolon-separated string of options (e.g., "Option1;Option2;Option3").
 *      - "checkbox": Checkbox group. Value is a semicolon-separated string of options (e.g., "OptionA;OptionB;OptionC").
 *      - "quantity": Number input for quantity. Value is placeholder text (e.g., "Quantity").
 *      - "img": Image display with optional caption. Value is in the format: '"[caption]":"[URL]"' or '"[URL]"'.
 *    - id (string, required): Unique identifier for the field.
 *    - value (string, varies based on type - see 'type' description):  Content/options/placeholder for the field.
 *
 * 2. Render the Form HTML:
 *    Call `DynamicForm.drawform(formConfig)` to generate the HTML string for the form.
 *    Append this HTML string to the desired location in your document (e.g., using innerHTML).
 *
 * 3. Extract Form Data:
 *    Call `DynamicForm.getformData(formConfig)` to retrieve the data entered by the user in the form.
 *    This method returns an object where keys are field IDs and values are user inputs.
 *
 * 4. CSS Styling:
 *    The class generates HTML elements with CSS classes for styling (see class comments).
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
                formHTML += `<label id="${field.id}" class="dynamic-form-label">${field.value}</label><br>`; // Label displays 'value' as text
            } else if (field.type !== 'img') { // Add label for all types EXCEPT 'img'
                formHTML += `<label for="${field.id}" class="dynamic-form-label">${field.value}:</label><br>`; // Label for input fields
            }

            if (field.type === 'radio') {
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
                formHTML += `<input type="number" id="${field.id}" name="${field.id}" placeholder="${field.value}" value="0" class="dynamic-form-input"><br>`; // 'value' is placeholder, default value 0
            } else if (field.type === 'textbox') {
                formHTML += `<input type="text" id="${field.id}" name="${field.id}" placeholder="${field.value}" class="dynamic-form-input"><br>`; // 'value' is placeholder
            } else if (field.type === 'img') {
                // --- Handling the 'img' field type - UPDATED PARSING - NO LABEL ---
                if (field.value) {
                    let imageURL = '';
                    let altText = field.altText || `Image for ${field.id}`; // Use altText from config or default

                    // Check if value starts with a quote indicating caption format (even though we are not using caption now, we parse it to get the URL correctly)
                    if (field.value.startsWith('"')) {
                        const valueParts = field.value.split('":"'); // Split by ":" only ONCE after first quote
                        if (valueParts.length === 2) {
                            imageURL = valueParts[1].replace('"', '').slice(0, -1); // Get URL and remove trailing quote
                        } else {
                            // If split fails, assume whole value is URL (no caption) and log error
                            imageURL = field.value.replace(/"/g, ''); // Remove all quotes, treat as URL
                            console.warn(`DynamicForm: Img field value format incorrect for id: ${field.id}. Assuming URL only.`);
                        }
                    } else {
                        // If no starting quote, assume whole value is URL (no caption)
                        imageURL = field.value.replace(/"/g, ''); // Remove any quotes, treat as URL
                    }

                    formHTML += `
                    <div class="dynamic-form-img-container">
                        <img id="${field.id}" src="${imageURL}" alt="${altText}" class="dynamic-form-img">
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
    static getformData(formConfig) {
        const formData = {};
        formConfig.forEach(field => {
            if (field.type === 'radio' || field.type === 'checkbox') {
                const checkedValue = document.querySelector(`input[name="${field.id}"]:checked`);
                formData[field.id] = checkedValue ? checkedValue.value : null;
            } else if (field.type === 'quantity' || field.type === 'textbox') {
                formData[field.id] = document.getElementById(field.id).value;
            }
            // 'img' and 'label' types are for display only, no data to get
        });
        return formData;
    }
}
