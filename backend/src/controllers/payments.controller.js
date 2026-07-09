import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/Payment.model.js';
import Booking from '../models/Booking.model.js';
import Enrollment from '../models/Enrollment.model.js';
import { withId } from '../utils/withId.js';

/**
 * isRazorpayConfigured — true only if both real keys are present. Every
 * payment-creating endpoint below checks this and falls back to an
 * honestly-labeled demo flow if not — see createOrder.
 */
function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getRazorpayClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/** Finds the underlying Booking or Enrollment by its own reference number. */
async function findReference(referenceType, referenceNumber) {
  if (referenceType === 'booking') {
    return Booking.findOne({ referenceNumber });
  }
  if (referenceType === 'enrollment') {
    return Enrollment.findOne({ referenceNumber });
  }
  return null;
}

/**
 * GET /api/payments/lookup?type=booking|enrollment&ref=BK-XXXXXX
 * Public — a visitor following their own "Pay Now" link needs this before
 * any auth exists for them. Returns the amount due (locked in at booking/
 * enrollment time, not re-derived from the service/course's current
 * price — see the note in Booking.model.js) and whether it's already paid.
 */
export async function lookupPayment(req, res) {
  const { type, ref } = req.query;
  if (!type || !ref) {
    return res.status(400).json({ error: 'type and ref are both required.' });
  }

  try {
    const record = await findReference(type, ref);
    if (!record) {
      return res.status(404).json({ error: 'No booking or enrollment found with that reference number.' });
    }

    const existingPayment = await Payment.findOne({ referenceType: type, referenceNumber: ref, status: 'paid' });

    res.json({
      referenceType: type,
      referenceNumber: ref,
      description: record.serviceName || record.courseName,
      amount: record.amount || 0,
      alreadyPaid: !!existingPayment,
      payment: existingPayment ? withId(existingPayment) : null,
    });
  } catch (err) {
    console.error('[payments] lookupPayment failed:', err);
    res.status(500).json({ error: 'Could not look up payment details.' });
  }
}

/**
 * POST /api/payments/create-order
 * body: { referenceType, referenceNumber }
 *
 * The amount is ALWAYS re-derived server-side from the stored Booking/
 * Enrollment record — never trusted from the request body — so a visitor
 * can't tamper with the client to pay less than they owe.
 *
 * Real mode (Razorpay keys configured): creates a real order via
 * Razorpay's API and returns what the frontend needs to open their
 * Checkout widget.
 *
 * Demo mode (no keys configured): creates a local Payment record only,
 * and tells the frontend to show the honest "demo payment" UI instead of
 * a real checkout — see README for why this project doesn't fake a card
 * entry form.
 */
export async function createOrder(req, res) {
  const { referenceType, referenceNumber } = req.body;
  if (!referenceType || !referenceNumber) {
    return res.status(400).json({ error: 'referenceType and referenceNumber are required.' });
  }

  try {
    const record = await findReference(referenceType, referenceNumber);
    if (!record) {
      return res.status(404).json({ error: 'No booking or enrollment found with that reference number.' });
    }

    const amount = record.amount || 0;
    const description = record.serviceName || record.courseName;

    const alreadyPaid = await Payment.findOne({ referenceType, referenceNumber, status: 'paid' });
    if (alreadyPaid) {
      return res.status(409).json({ error: 'This has already been paid.' });
    }

    if (isRazorpayConfigured()) {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency: 'INR',
        receipt: referenceNumber,
      });

      const payment = await Payment.create({
        referenceType, referenceNumber, description, amount,
        currency: 'INR', method: 'razorpay', status: 'created',
        razorpayOrderId: order.id,
      });

      return res.json({
        demoMode: false,
        paymentId: String(payment._id),
        orderId: order.id,
        amount,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        description,
      });
    }

    // Demo mode — no real gateway keys configured.
    const payment = await Payment.create({
      referenceType, referenceNumber, description, amount,
      currency: 'INR', method: 'demo', status: 'created',
    });

    res.json({ demoMode: true, paymentId: String(payment._id), amount, currency: 'INR', description });
  } catch (err) {
    console.error('[payments] createOrder failed:', err);
    res.status(500).json({ error: 'Could not start payment. Please try again.' });
  }
}

/**
 * POST /api/payments/verify
 * body: { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
 *
 * The real security step for Razorpay's flow: recompute the HMAC
 * signature server-side using the secret key (never sent to the
 * frontend) and compare against what Razorpay's checkout handed back.
 * This is what actually confirms the payment is genuine — trusting the
 * frontend's "it succeeded" callback alone would let anyone fake a paid
 * receipt.
 */
export async function verifyPayment(req, res) {
  const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!paymentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ error: 'Missing payment verification fields.' });
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
      return res.status(400).json({ error: 'Payment verification failed. Please contact us if you were charged.' });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'paid', razorpayPaymentId, razorpaySignature },
      { new: true }
    );

    if (!payment) return res.status(404).json({ error: 'Payment record not found.' });
    res.json(withId(payment));
  } catch (err) {
    console.error('[payments] verifyPayment failed:', err);
    res.status(500).json({ error: 'Could not verify payment.' });
  }
}

/**
 * POST /api/payments/demo-confirm
 * body: { paymentId }
 *
 * Demo-mode only — marks a demo payment as "paid" so the rest of the flow
 * (receipt, payment history) can be exercised without a real gateway.
 * Refuses to touch a real Razorpay-method payment, so this can't be used
 * to fake a real transaction.
 */
export async function confirmDemoPayment(req, res) {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: 'paymentId is required.' });

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment record not found.' });
    if (payment.method !== 'demo') {
      return res.status(400).json({ error: 'This payment requires real verification, not demo confirmation.' });
    }

    payment.status = 'paid';
    await payment.save();
    res.json(withId(payment));
  } catch (err) {
    console.error('[payments] confirmDemoPayment failed:', err);
    res.status(500).json({ error: 'Could not confirm demo payment.' });
  }
}

/**
 * GET /api/payments
 * Owner-only. Full payment history for the admin dashboard.
 */
export async function listPayments(req, res) {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments.map(withId));
  } catch (err) {
    console.error('[payments] listPayments failed:', err);
    res.status(500).json({ error: 'Could not load payment history.' });
  }
}
