import Safepay from "@sfpy/node-core";


const safepay = new Safepay(process.env.SAFEPAY_SECRET_KEY, 
    {
        authType:'secret',
        host:'https://api.getsafepay.com'
    }
)

export default safepay;

// Contact Support: If, after waiting a reasonable amount of time (e.g., 2-3 hours) and checking your spam folder, you still haven't received anything, then you should contact JazzCash support.
// Look for a "Contact Us" or "Support" link on the JazzCash Sandbox portal.
// Explain that you've signed up for a Sandbox merchant account, initiated the credential generation, and haven't received the confirmation email with the credentials. Provide them with your registered email address and any other details you used during registration