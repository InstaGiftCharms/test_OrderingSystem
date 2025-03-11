/**
 * configParameters.js
 *
 * This file contains the configuration parameters for the web page,
 * including slideshow images, shipping options, and product information
 * with dynamic form configurations.
 */

const ConfigParameters = {
    slideshowImages: [
        'images/slide1.jpg',
        'images/slide2.jpg',
        'images/slide3.jpg'
    ],
    slideshowInterval: 5000, // Slideshow interval in milliseconds (5 seconds)

    shippingOptions: [
        { optionName: 'Standard Delivery', optionCost: 50 },
        { optionName: 'Express Delivery', optionCost: 100 },
        { optionName: 'Pickup in-person', optionCost: 0 },
        { optionName: 'Pickup via On-Demand Delivery (Lalamove, Grab, etc.)', optionCost: 0 }
    ],

    shippingOptionText: [
        "Choose your preferred shipping method.",
        "For pick-up options, please coordinate schedule and pick-up point via chat after placing your order.",
        "On-demand delivery (Lalamove, Grab, etc.) bookings should be initiated and paid for by the customer."
    ],

    productInfo: [
        {
            productName: 'Charm 1',
            productForm: [
                {
                    fieldName: 'charm1Image',
                    fieldType: 'img',
                    fieldLabel: 'Charm Preview',
                    value: '"See Charm 1 up close!":"images/charm1_preview.jpg"'
                },
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
                    fieldOptions: ['Gold', 'Silver', 'Bronze']
                },
                {
                    fieldName: 'charm2Material',
                    fieldType: 'checkbox',
                    fieldLabel: 'Material Options',
                    fieldOptions: ['Shiny', 'Matte']
                },
                {
                    fieldName: 'charm2Quantity',
                    fieldType: 'number',
                    fieldLabel: 'Quantity',
                    fieldPlaceholder: 'Quantity',
                    fieldDefaultValue: 0
                }
            ]
        },
        {
            productName: 'Charm 3 - No Options',
            productForm: [] // Example of a product with no dynamic form options
        },
        // ... more product configurations can be added here ...
    ]
};
