# PayHero Payment Button Integration Guide

This guide provides instructions on how to integrate the PayHero payment button widget into your web application.

## Installation

Include the PayHero SDK script in your HTML file:

```html
<script src="https://raw.githack.com/PAY-HERO-KENYA/payment_button/main/sdk.js"></script>
```

## Usage

To initialize the PayHero payment widget, add the following script to your HTML file. This script configures the payment widget with the necessary parameters.

```html
<script>
    PayHero.init({
        paymentUrl: "https://app.payhero.co.ke/lipwa/5",
        width: "100%",
        height: "100%",
        containerId: "payHero",
        channelID: 100,
        amount: 1,
        phone: "0708344101",
        reference: "somerandomstring",
        buttonName: "Pay Now",
        buttonColor: "#00a884", 
        successUrl: "https://payherokenya.com/",
        failedUrl: "https://payherokenya.com/"
    });
</script>
```

### Parameters

- **paymentUrl**: The URL to initiate the payment process. Your Lipwa Link.
- **width**: The width of the payment widget (e.g., "100%").
- **height**: The height of the payment widget (e.g., "100%").
- **containerId**: The ID of the HTML element where the payment widget will be rendered.
- **channelID**: The payment channel ID to be used for the payment.
- **amount**: The amount to be paid.
- **phone**: The phone number of the payer.
- **reference**: A unique reference string for the payment.
- **buttonName**: The label for the payment button.
- **buttonColor**: The background color of the payment button (in hex format).
- **successUrl**: The URL to redirect to upon successful payment.
- **failedUrl**: The URL to redirect to upon failed payment.

## Example

Here is a complete example of an HTML file integrating the PayHero payment widget:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayHero Integration</title>
</head>
<body>
    <!-- PayHero Payment Container -->
    <div id="payHero"></div>

    <!-- Include PayHero SDK -->
    <script src="https://raw.githack.com/PAY-HERO-KENYA/payment_button/main/sdk.js"></script>

    <!-- Initialize PayHero Payment Widget -->
    <script>
        PayHero.init({
            paymentUrl: "https://app.payhero.co.ke/lipwa/5",//use your own lipwa link here
            width: "100%",
            height: "100%",
            containerId: "payHero",
            channelID: 100,//provide your payment channel ID
            amount: 1,//provide the amount
            phone: "0708344101",//provide the customer phone
            reference: "somerandomstring",//provide payment reference here
            buttonName: "Pay Now",//provide button text
            buttonColor: "#00a884", //provide button color
            successUrl: "https://payherokenya.com/",//url user will be redirected after successfull payment
            failedUrl: "https://payherokenya.com/"//url user will be redirected after failed payment
        });
    </script>
</body>
</html>
```

## Notes

- Ensure that the PayHero SDK script URL is correct and accessible.
- Customize the payment parameters as needed for your specific use case.See comments for guidance
- Make sure the `containerId` corresponds to an existing HTML element where the payment widget will be rendered.

## Support

If you encounter any issues or have questions, please contact PayHero support at [info@payherokenya.com](mailto:info@payherokenya.com).
