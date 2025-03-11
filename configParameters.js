/**
 * DynamicForm Class for Generating HTML Forms from Configuration Objects.
 *
 * This class provides static methods to dynamically create HTML form sections based on a
 * configuration object. It supports various input types (radio, checkbox, number, text, image)
 * and includes methods to both render the HTML form and extract data from it.
 *
 * Usage:
 *
 * 1. Define Form Configuration:
 *    Create a JavaScript object (e.g., in ConfigParameters.productInfo[].productForm)
 *    that describes the form fields. Each field in the configuration should be an object
 *    with the following properties:
 *
 *    - fieldName (string, required): Unique identifier for the field (used as name and part of ID).
 *    - fieldType (string, required): Type of form field. Supported types:
 *      - "radio": Radio button group (requires 'fieldOptions').
 *          Example:
 *          { fieldName: 'colorPreference', fieldType: 'radio', fieldLabel: 'Color', fieldOptions: ['Red', 'Blue', 'Green'] }
 *      - "checkbox": Checkbox group (requires 'fieldOptions').
 *          Example:
 *          { fieldName: 'interests', fieldType: 'checkbox', fieldLabel: 'Interests', fieldOptions: ['Sports', 'Music', 'Reading'] }
 *      - "number": Number input field.
 *          Example:
 *          { fieldName: 'quantity', fieldType: 'number', fieldLabel: 'Quantity', fieldPlaceholder: 'Enter quantity', fieldDefaultValue: 1 }
 *      - "text": Text input field.
 *          Example:
 *          { fieldName: 'name', fieldType: 'text', fieldLabel: 'Name', fieldPlaceholder: 'Your name' }
 *      - "img": Image display with optional caption.
 *          Example with caption:
 *          { fieldName: 'productImage', fieldType: 'img', fieldLabel: 'Product Image', value: '"Product Preview":"images/product.jpg"' }
 *          Example without caption:
 *          { fieldName: 'logoImage', fieldType: 'img', fieldLabel: 'Company Logo', value: '"logos/company-logo.png"' , id: 'companyLogo' } // Example with custom ID
 *    - fieldLabel (string, required): Label text displayed to the user for this field.
 *    - fieldOptions (array of strings, optional, required for 'radio' and 'checkbox'):
 *      Array of options for radio buttons or checkboxes. Each string is the value and label.
 *    - fieldPlaceholder (string, optional, for 'number' and 'text'): Placeholder text for input fields.
 *    - fieldDefaultValue (number, optional, for 'number'): Default value for number input fields.
 *    - value (string, optional, for 'img'):  Defines the image source and optional caption.
 *      Format:  `"[caption]":"[URL]"` (with caption) or just `"[URL]"` (no caption).
 *      Caption and URL must be enclosed in quotation marks. Example: '"My Image Caption":"images/example.jpg"' or '"images/example.jpg"'.
 *    - id (string, optional, for 'img'): Optional custom ID for the <img> tag. If not provided, a default ID is generated.
 *
 * 2. Render the Form HTML:
 *    Call `DynamicForm.drawform(formConfig)` to generate the HTML string for the form.
 *    Append this HTML string to the desired location in your document (e.g., using innerHTML).
 *
 * 3. Extract Form Data:
 *    Call `DynamicForm.getformData(formConfig)` to retrieve the data entered by the user in the form.
 *    This method returns an object where keys are 'fieldName' values and values are the
 *    user's input for each field (or null if no input for radio/checkbox).
 *
 * 4. CSS Styling:
 *    The class generates HTML elements with the following CSS classes for styling:
 *    - .dynamic-form-label: For labels of all field types.
 *    - .dynamic-form-input: For input elements (text, number, radio, checkbox).
 *    - .radio-checkbox-option: Container for each radio button or checkbox and its label.
 *    - .dynamic-form-img-container: Container for the image and caption (for 'img' type).
 *    - .dynamic-form-img: For the <img> tag itself (for 'img' type).
 *    - .dynamic-form-img-caption: For the caption text (span element below the image for 'img' type).
 *    Use these classes in your CSS to customize the appearance of the dynamic form elements.
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
            } else if (field.fieldType === 'img') {
                // --- Handling the new 'img' field type ---
                if (field.value) {
                    // Parse the value string: "[caption]":"[URL]"
                    const valueParts = field.value.split('":"');
                    let caption = '';
                    let imageURL = '';

                    if (valueParts.length === 2) {
                        caption = valueParts[0].replace('"', ''); // Remove leading quote from caption
                        imageURL = valueParts[1].replace('"', '').replace('"', ''); // Remove quotes from URL
                    } else if (valueParts.length === 1) {
                        imageURL = valueParts[0].replace('"', '').replace('"', ''); // If no caption, assume value is just URL
                    }


                    formHTML += `
                    <div class="dynamic-form-img-container">
                        <img id="${field.id ? field.id : 'dynamic-image-' + field.fieldName}" src="${imageURL}" alt="${caption}" class="dynamic-form-img">
                        ${caption ? `<span class="dynamic-form-img-caption">${caption}</span>` : ''}
                    </div>`;
                } else {
                    formHTML += `<p>Image value not provided for field: ${field.fieldName}</p>`; // Fallback if value is missing
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
     * @returns {Object} An object containing the form data, where keys are field names and values are user inputs.
     */
    static getformData(formConfig) {
        const formData = {};
        formConfig.forEach(field => {
            if (field.fieldType === 'radio' || field.fieldType === 'checkbox') {
                const checkedValue = document.querySelector(`input[name="${field.fieldName}"]:checked`);
                formData[field.fieldName] = checkedValue ? checkedValue.value : null;
            } else if (field.fieldType === 'number' || field.fieldType === 'text') {
                formData[field.fieldName] = document.getElementById(field.fieldName).value;
            }
            // 'img' type is for display only, so no data to get from it in getformData
        });
        return formData;
    }
}
