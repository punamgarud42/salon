/**
 * loadRazorpayCheckout — dynamically injects Razorpay's hosted Checkout
 * script (only when needed, i.e. real gateway keys are configured — see
 * Payment.jsx). Using their hosted widget rather than a custom card form
 * means card details never touch this codebase at all; Razorpay handles
 * PCI compliance entirely on their end.
 */
export function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment gateway. Please check your connection and try again.'));
    document.body.appendChild(script);
  });
}
