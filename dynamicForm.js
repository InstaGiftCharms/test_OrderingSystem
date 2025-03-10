class DynamicForm {
  static drawform(formObjectArray) {
    let formHTML = '<form>';

    for (const formObject of formObjectArray) {
      const type = formObject.type;
      const id = formObject.id;
      const value = formObject.value;

      switch (type) {
        case 'label':
          formHTML += DynamicForm.#createLabel(id, value);
          break;
        case 'textbox':
          formHTML += DynamicForm.#createTextbox(id, value);
          break;
        case 'radio':
          formHTML += DynamicForm.#createRadioButtons(id, value);
          break;
        case 'checkbox':
          formHTML += DynamicForm.#createCheckboxes(id, value);
          break;
        case 'quantity': // New case for quantity
          formHTML += DynamicForm.#createQuantity(id, value);
          break;
        default:
          console.warn(`Unknown form element type: ${type}`);
          break;
      }
    }

    formHTML += '</form>';
    return formHTML;
  }

  static getformData(formObjectArray) {
    let formDataString = '';

    for (const formObject of formObjectArray) {
      const type = formObject.type;
      const id = formObject.id;

      let valueOut = '';

      switch (type) {
        case 'textbox':
        case 'quantity': // Quantity type also gets textbox value
          const textboxElement = document.getElementById(id);
          if (textboxElement) {
            valueOut = textboxElement.value;
          }
          break;
        case 'radio':
          const radioButtons = document.querySelectorAll(`input[name="${id}"]:checked`);
          if (radioButtons.length > 0) {
            valueOut = radioButtons[0].value;
          }
          break;
        case 'checkbox':
          const checkboxes = document.querySelectorAll(`input[name="${id}"]:checked`);
          let checkboxValues = [];
          checkboxes.forEach(checkbox => {
            checkboxValues.push(checkbox.value);
          });
          valueOut = checkboxValues.join(';');
          break;
        // Labels don't have input values, so we skip them in getformData
      }

      if (valueOut !== '') {
        formDataString += `${id}:${valueOut};`;
      }
    }

    if (formDataString.endsWith(';')) {
      formDataString = formDataString.slice(0, -1);
    }

    return formDataString;
  }


  static #createLabel(id, text) {
    return `<label for="${id}">${text}</label><br>`;
  }

  static #createTextbox(id, placeholder) {
    return `<input type="text" id="${id}" name="${id}" placeholder="${placeholder}"><br>`;
  }

  static #createRadioButtons(id, optionsString) {
    let radioHTML = '';
    const options = optionsString.split(';');
    for (const option of options) {
      const radioId = `${id}_${option.replace(/\s/g, '_')}`;
      radioHTML += `
        <input type="radio" id="${radioId}" name="${id}" value="${option}">
        <label for="${radioId}">${option}</label>&nbsp;
      `;
    }
    radioHTML += '<br>';
    return radioHTML;
  }

  static #createCheckboxes(id, optionsString) {
    let checkboxHTML = '';
    const options = optionsString.split(';');
    for (const option of options) {
      const checkboxId = `${id}_${option.replace(/\s/g, '_')}`;
      checkboxHTML += `
        <input type="checkbox" id="${checkboxId}" name="${id}" value="${option}">
        <label for="${checkboxId}">${option}</label>&nbsp;
      `;
    }
    checkboxHTML += '<br>';
    return checkboxHTML;
  }

  // New private method for creating quantity input
  static #createQuantity(id, placeholder) {
    return `<input type="number" id="${id}" name="${id}" placeholder="${placeholder}" value="0"><br>`; // Default value set to 0
  }
}
