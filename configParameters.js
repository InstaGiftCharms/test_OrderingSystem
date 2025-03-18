// Current/configParameters.js
class ConfigParameters {
    static slideshowImages = [
        // Array of image URLs for the slideshow.
        // Example URLs below (replace with your actual image URLs):
        "https://lh3.googleusercontent.com/pw/AP1GczMhUvNEaDbxrcPonTA-Bi2g8Kv9h469BM7QavVE5zEFwbhI2RhFa4Ut8rp0-MogwaYzVThe_5gUJbXcHT96mqQw0TdvNXioPYbZavAJeC5zmubHSShLT3YT48CNaH4-KeA1qyn3BsWRhIKYVVJphX0Xew=w950-h950-s-no-gm?authuser=0",
        "https://lh3.googleusercontent.com/pw/AP1GczOqHOeBqKu_iNl8mKWvRFRsEAXIfQSw1SzKzlbKU0HacDUc8nepvRHzHVXhijx4QVjYOUaimJIccbuZsdakl7N_gqmZ4wZVdLUt3x3qG63LsZwjqplrryTn81cZzwOmoiA0MCmcKAelUI8dt6swXdfFXA=w950-h950-s-no-gm?authuser=0",
        "https://lh3.googleusercontent.com/pw/AP1GczM1V24F4vzVdQuqDhjqT39kb7Q9k1ADHELHA9YG7euWfzuPuLlrtNzBttFbz_Aa_JEeNTHOmelg9jyL01aSflztVKBWXjVlNmQ2hobWXm_m5mhr-Zzl_kZP1zacBVhvWC3NzbM7Bd47YwI9rCziNjID5Q=w950-h950-s-no-gm?authuser=0",
        "https://lh3.googleusercontent.com/pw/AP1GczNoKPXDHc6Qk563FtyV29dE3O3DLi_H18_yB1MF58ijTWsFhLYVh9zvUEwWEpFSSrRXygkjbDI6sm41L-0Im3epBjeVxVgI1CGBMY0D1OD8_RowWan-IKc-mCHSaSQgLSxeBsDp3ceLi_I9xykHRDWcVQ=w950-h950-s-no-gm?authuser=0"
    ];
    static slideshowInterval = 3000; // Time in milliseconds to display each slide (e.g., 3000ms = 3 seconds).
    static requiredFields = [
        // Array of IDs of the input fields that are required for the form submission.
        "firstName",
        "lastName",
        "email",
        "shippingOption",
        "orderDescription"
    ];
    static shippingOptions = [
        // Array of shipping options available to the user.
        // Each object has:
        //   - optionName: The name of the shipping option (string).
        //   - optionCost: The cost of the shipping option (number).
        { optionName: "Pickup via On-Demand Delivery (Lalamove, Grab, etc.)", optionCost: 0 },
        { optionName: "Standard Shipping (within Metro Manila only)", optionCost: 250 }
    ];
    static shippingOptionText = [
        // Array of strings containing paragraphs that explain the shipping options to the user.
        "Please select the most suitable shipping option for your order:",
        "**Pickup via On-Demand Delivery (Lalamove, Grab, etc.):** Choose this to arrange for a service like Lalamove or Grab to collect your order from our store. You book and pay for this service.",
        `**Standard Shipping:** Select this to have your order shipped to your address via our preferred deliver service. Shipping fees and delivery times will apply.`
    ];

    static paymentInstructionText = [
        // Array of strings containing paragraphs with payment instructions for the user.
        "Please send your payment to one of the provided options below",
        "PayMaya: 0915-392-8725",
		"Bank Transfer (BPI): 0446-1872-59",
		"After you have made your payment, kindly email us a screenshot or photo of your payment confirmation. Carefully follow the format below to ensure proper processing of your order in our system.",
		"Email Address: instagiftcharms@gmail.com",
		"Email Subject: PROOF OF PAYMENT [Full Name] [Order Number]"
    ];

    // --- Product Information ---
    static productInfo = [
        // Array of product objects. Each object contains information about a specific product.
        // Each object has:
        //   - productName: The name of the product (string), including the base price in parentheses.
        //   - productImage: URL of the image for the product (string).
        //   - productForm: An array defining the dynamic form elements for this product (array of objects).
        //     Each object in productForm defines a form field with properties like:
        //       - type: The type of form field ('label', 'textbox', 'quantity', 'radio', 'checkbox', 'img').
        //       - id: Unique ID for the form field (string).
        //       - value: Default value or placeholder text (string). For 'radio' and 'checkbox', it's a semicolon-separated list of options. For 'img', it can be a URL or '"Visible Text":"imageURL"'.
        //       - responsePrefix: Optional prefix to add to the form field value when submitted (string).
        {
            productName: "Solid Letter Name KeyChains (150.00 PHP)",
            productImage: "https://lh3.googleusercontent.com/pw/AP1GczOSbo6onMnXZJ_xqOlDdoH77sfFLLzhMrUyRvFjKPppIn4fOaQgkYSVq4he_hwGC3Gje1hJrgcavyACtYBf3bnZVPymq1LDNxZwzDcbsgG5LsLVpnFdSkKTuv3bXk2v5BoY7jlffRn56nrg2p5qC3Yw4A=w958-h721-s-no-gm?authuser=0", // Placeholder image URL
            productForm: [ // Define form for Charm 1
                { type: 'label', id: 'lbl_01', value: 'Keychain Name (Maximum of 4 letters):'},
                { type: 'textbox', id: 'txt_charmMsg', value: 'Type here', responsePrefix:'00|Keychain Name: ' },
                { type: 'label', id: 'lbl_02', value: '[Need more letters? Select the "Extra Letter" add-on below to make it up to 5 letters.]' },
                { type: 'label', id: 'lbl_03', value: 'Add-ons(Optional):' },
                { type: 'img', id: 'img_charmAddon01', value: '"Extra Letter (+ 10.00 PHP)":"https://lh3.googleusercontent.com/pw/AP1GczNvLiomXal_RfGpMWmPfDG15A5VsyC9xPKw6OJ-5_w-0jtE8BVdu0TWq4di4_7ENNA4WRJjTZWRxnR45a8hzfrOkDw7PqaVDe-bmXJ36s7kFM38gsCg-bFHE1bN008hYljuxunn65CRmgAIRLnUQscbmg=w950-h950-s-no-gm?authuser=0"', responsePrefix:'01|Include ' },
                { type: 'img', id: 'img_charmAddon02', value: '"Big Charms (+ 10.00 PHP)":"https://lh3.googleusercontent.com/pw/AP1GczOpWbdEgyT8O7khI5yCn_BPEm08lGtf638NV0uGfQjWCi7hcPzWoO0CAC40NlxQnRkGCVvW63EjwEDZ5EVDm6CbkZF3uJz9L0-6xioj7u0zQGmbDKqrf6c3_Z9MbVwpICiM1Ak4sWmJ9jXQ2YPLPNOLog=w950-h950-s-no-gm?authuser=0"', responsePrefix:'02|Include ' },
                { type: 'img', id: 'img_charmAddon03', value: '"Small Charms (+ 5.00 PHP)":"https://lh3.googleusercontent.com/pw/AP1GczMzSAY7AZ1WXOvNmIlEqgLMWwkHJFbAECMJDM69oWFz5CVJc26oNA9E8NC0KaYSheRyUTSyKwiOdkHHo2_Z7czmfA6OLY9yqjkePqrdXpEBxlY-qJqtSTpwCxmpaUJGJ_OJt5irorVzwFMYeCgEVKIOnQ=w950-h950-s-no-gm?authuser=0"', responsePrefix:'03|Include ' },
                { type: 'img', id: 'img_charmAddon04', value: '"Phone Hook (+ 25.00 PHP)":"https://lh3.googleusercontent.com/pw/AP1GczPDvOgy8AcJZL3F_lwsK6SZi8yOoQkbmp15v6An7gm4_4mex4eVgYX6FuZkmlXQO1fd8WwxKVe67RSd2mQsOfnXmDv1KuNXW_LHNIsrjKAdXdYen9U-9ezpC9XpRjqcXz2fVCfZf9O4AB_WPaA7asSQZQ=w950-h950-s-no-gm?authuser=0"', responsePrefix:'04|Include ' },
                { type: 'label', id: 'lbl_04', value: 'Additional Order Request:'},
				{ type: 'textbox', id: 'txt_additionalReq', value: 'Type here', responsePrefix:'05|Additional Request: ' },
				{ type: 'quantity', id: 'num_itemQuantity', value: 'Item Quantity', responsePrefix:'06|Quantity: ' }
            ]
        },
    ];
}
