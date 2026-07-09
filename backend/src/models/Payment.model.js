import mongoose from 'mongoose';

/**
 * Payment — tracks a payment attempt against a booking or enrollment.
 *
 * `method` distinguishes a real Razorpay transaction from the honest demo
 * fallback used when no gateway keys are configured (see
 * controllers/payments.controller.js) — receipts clearly label demo
 * payments as such, since no real money moved.
 */
const paymentSchema = new mongoose.Schema(
  {
    referenceType: { type: String, enum: ['booking', 'enrollment'], required: true },
    referenceNumber: { type: String, required: true }, // Booking/Enrollment's own referenceNumber (e.g. "BK-7F2K9C")
    description: { type: String, required: true },      // service/course name, for the receipt
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['razorpay', 'demo'], required: true },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
