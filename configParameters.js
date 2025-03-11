class ConfigParameters {
    static slideshowImages = [
        // Populate image URLs here. Example URLs below:
        "https://lh3.googleusercontent.com/pw/AP1GczMhUvNEaDbxrcPonTA-Bi2g8Kv9h469BM7QavVE5zEFwbhI2RhFa4Ut8rp0-MogwaYzVThe_5gUJbXcHT96mqQw0TdvNXioPYbZavAJeC5zmubHSShLT3YT48CNaH4-KeA1qyn3BsWRhIKYVVJphX0Xew=w950-h950-s-no-gm?authuser=0",
        "https://lh3.googleusercontent.com/pw/AP1GczOqHOeBqKu_iNl8mKWvRFRsEAXIfQSw1SzKzlbKU0HacDUc8nepvRHzHVXhijx4QVjYOUaimJIccbuZsdakl7N_gqmZ4wZVdLUt3x3qG63LsZwjqplrryTn81cZzwOmoiA0MCmcKAelUI8dt6swXdfFXA=w950-h950-s-no-gm?authuser=0",
        "https://lh3.googleusercontent.com/pw/AP1GczM1V24F4vzVdQuqDhjqT39kb7Q9k1ADHELHA9YG7euWfzuPuLlrtNzBttFbz_Aa_JEeNTHOmelg9jyL01aSflztVKBWXjVlNmQ2hobWXm_m5mhr-Zzl_kZP1zacBVhvWC3NzbM7Bd47YwI9rCziNjID5Q=w950-h950-s-no-gm?authuser=0",
        "https://lh3.googleusercontent.com/pw/AP1GczNoKPXDHc6Qk563FtyV29dE3O3DLi_H18_yB1MF58ijTWsFhLYVh9zvUEwWEpFSSrRXygkjbDI6sm41L-0Im3epBjeVxVgI1CGBMY0D1OD8_RowWan-IKc-mCHSaSQgLSxeBsDp3ceLi_I9xykHRDWcVQ=w950-h950-s-no-gm?authuser=0"
    ];
    static slideshowInterval = 3000; // Time in milliseconds for each slide (3 seconds)
    static requiredFields = [
        "firstName",
        "lastName",
        "email",
        "shippingOption",
        "orderDescription"
    ];
    static shippingOptions = [ // Changed to Javascript object array
        { optionName: "Pickup in-person", optionCost: 0 },
        { optionName: "Pickup via On-Demand Delivery (Lalamove, Grab, etc.)", optionCost: 0 },
        { optionName: "Standard Shipping", optionCost: 250 }
    ];
    static shippingOptionText = [  // Changed to an array of strings
        "Please select the most suitable shipping option for your order:",
        "**Pickup in-person:** Select this if you will pick up your order directly from our store. We will notify you when it's ready for collection.",
        "**Pickup via On-Demand Delivery (Lalamove, Grab, etc.):** Choose this to arrange for a service like Lalamove or Grab to collect your order from our store and deliver to you. You book and pay for this service.",
        `**Standard Shipping:** Select this to have your order shipped to your address via **our preferred deliver service**. Shipping fees and delivery times will apply.`
    ];

    // --- Product Information ---
    static productInfo = [
        {
            productName: "Charm 1",
            productForm: [ // Define form for Charm 1
                { type: 'label', id: 'charm1Label', value: 'Charm 1 Details:' },
                { type: 'textbox', id: 'charm1Text', value: 'Enter your text for Charm 1' },
                { type: 'quantity', id: 'charm1Quantity', value: 'Quantity' },
                { type: 'img', id: 'charm1Image', value: '"' + ConfigParameters.slideshowImages[0] + '"' } // Image for Charm 1 - URL from slideshow, NO caption
            ]
        },
        {
            productName: "Charm 2",
            productForm: [ // Define form for Charm 2
                { type: 'label', id: 'charm2Label', value: 'Charm 2 Options:' },
                { type: 'radio', id: 'charm2Color', value: 'Red;Blue;Green' },
                { type: 'quantity', id: 'charm2Quantity', value: 'Quantity' },
                { type: 'img', id: 'charm2Image', value: '"Charm 2 Preview":"' + ConfigParameters.slideshowImages[1] + '"' } // Image for Charm 2 - URL from slideshow, WITH caption
            ]
        },
        {
            productName: "Charm 3",
            productForm: [ // Define form for Charm 3
                { type: 'label', id: 'charm3Label', value: 'Charm 3 Choices:' },
                { type: 'checkbox', id: 'charm3Features', value: 'Feature A;Feature B;Feature C' },
                { type: 'quantity', id: 'charm3Quantity', value: 'Quantity' },
                { type: 'img', id: 'charm3Image', value: '"":"' + ConfigParameters.slideshowImages[2] + '"' } // Image for Charm 3 - URL from slideshow, NO caption
            ]
        },
        {
            productName: "Charm Set A",
            productForm: [ // Define form for Charm Set A
                { type: 'label', id: 'charmSetALabel', value: 'Charm Set A Customization:' },
                { type: 'textbox', id: 'charmSetAText1', value: 'Enter text for part 1' },
                { type: 'textbox', id: 'charmSetAText2', value: 'Enter text for part 2' },
                { type: 'quantity', id: 'charmSetAQuantity', value: 'Quantity' }
            ]
        },
        {
            productName: "Custom Charm Design",
            productForm: [ // Define form for Custom Charm Design
                { type: 'label', id: 'customCharmLabel', value: 'Custom Charm Design Request:' },
                { type: 'textarea', id: 'customCharmDescription', value: 'Describe your custom charm design' } // Textarea type is missing in DynamicForm, you might want to add it later. For now, using textbox as placeholder
            ]
        }
    ];
}
