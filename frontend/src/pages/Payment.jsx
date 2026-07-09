import { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { apiGet, apiPost } from '../lib/api.js';
import { loadRazorpayCheckout } from '../lib/razorpay.js';
import { downloadTextFile, buildPaymentReceipt } from '../lib/download.js';
import { parseHash } from '../router/useHashRoute.js';
import './Payment.css';

export default function Payment() {
  const { type, ref } = parseHash().params;

  const [lookup, setLookup] = useState(null);
  const [loadingLookup, setLoadingLookup] = useState(true);
  const [lookupError, setLookupError] = useState('');

  const [orderInfo, setOrderInfo] = useState(null); // response from create-order
  const [starting, setStarting] = useState(false);
  const [payError, setPayError] = useState('');

  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (!type || !ref) {
      setLookupError('Missing payment reference. Use the "Pay Now" link from your booking or enrollment confirmation.');
      setLoadingLookup(false);
      return;
    }
    apiGet(`/payments/lookup?type=${type}&ref=${ref}`)
      .then((res) => {
        setLookup(res);
        if (res.alreadyPaid && res.payment) setReceipt(res.payment);
      })
      .catch((err) => setLookupError(err.message))
      .finally(() => setLoadingLookup(false));
  }, [type, ref]);

  async function handleStartPayment() {
    setStarting(true);
    setPayError('');
    try {
      const order = await apiPost('/payments/create-order', { referenceType: type, referenceNumber: ref });
      setOrderInfo(order);

      if (!order.demoMode) {
        await launchRazorpay(order);
      }
    } catch (err) {
      setPayError(err.message);
    } finally {
      setStarting(false);
    }
  }

  async function launchRazorpay(order) {
    try {
      await loadRazorpayCheckout();
    } catch (err) {
      setPayError(err.message);
      return;
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      name: 'Vermé',
      description: order.description,
      theme: { color: '#C9A15A' },
      handler: async (response) => {
        try {
          const verified = await apiPost('/payments/verify', {
            paymentId: order.paymentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          setReceipt(verified);
        } catch (err) {
          setPayError(err.message);
        }
      },
      modal: {
        ondismiss: () => setPayError('Payment window closed before completing. You can try again below.'),
      },
    });

    rzp.open();
  }

  async function handleDemoConfirm() {
    setStarting(true);
    setPayError('');
    try {
      const paid = await apiPost('/payments/demo-confirm', { paymentId: orderInfo.paymentId });
      setReceipt(paid);
    } catch (err) {
      setPayError(err.message);
    } finally {
      setStarting(false);
    }
  }

  function handleDownloadReceipt() {
    downloadTextFile(`receipt-${receipt.referenceNumber}.txt`, buildPaymentReceipt(receipt));
  }

  if (loadingLookup) {
    return <section className="payment-page container"><p>Loading payment details…</p></section>;
  }

  if (lookupError) {
    return (
      <section className="payment-page container">
        <p className="eyebrow">Payment</p>
        <h1>Something's not right</h1>
        <KumkumDivider align="left" />
        <p className="payment-page__error">{lookupError}</p>
        <Button variant="secondary" size="lg" href="#/">Back to Home</Button>
      </section>
    );
  }

  if (receipt) {
    return (
      <section className="payment-page container">
        <Reveal direction="up">
          <div className="payment-receipt">
            <div className="payment-receipt__badge">✓</div>
            <h1>Payment Successful</h1>
            {receipt.method === 'demo' && (
              <p className="payment-page__demo-banner">
                DEMO PAYMENT — no real money was charged. Add real Razorpay keys in the backend's
                .env to accept real payments.
              </p>
            )}
            <KumkumDivider align="center" />
            <dl className="payment-receipt__details">
              <div><dt>Reference</dt><dd>{receipt.referenceNumber}</dd></div>
              <div><dt>For</dt><dd>{receipt.description}</dd></div>
              <div><dt>Amount</dt><dd>₹{Number(receipt.amount).toLocaleString('en-IN')}</dd></div>
              <div><dt>Status</dt><dd>{receipt.status}</dd></div>
            </dl>
            <div className="payment-receipt__actions">
              <Button variant="primary" size="lg" onClick={handleDownloadReceipt}>Download Receipt</Button>
              <Button variant="ghost" size="lg" href="#/">Back to Home</Button>
            </div>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="payment-page container">
      <Reveal direction="up">
        <p className="eyebrow">Payment</p>
        <h1>Complete Your Payment</h1>
        <KumkumDivider align="left" />

        <div className="payment-summary">
          <div><span>Reference</span><strong>{lookup.referenceNumber}</strong></div>
          <div><span>For</span><strong>{lookup.description}</strong></div>
          <div><span>Amount Due</span><strong>₹{Number(lookup.amount).toLocaleString('en-IN')}</strong></div>
        </div>

        {!orderInfo && (
          <Button variant="primary" size="lg" onClick={handleStartPayment} disabled={starting}>
            {starting ? 'Starting…' : `Pay ₹${Number(lookup.amount).toLocaleString('en-IN')}`}
          </Button>
        )}

        {orderInfo?.demoMode && (
          <div className="payment-demo-panel">
            <p className="payment-page__demo-banner">
              No payment gateway is configured yet, so this is an honest demo screen rather than a
              fake card form — no real payment gateway credentials are collected or needed here.
              Add real Razorpay keys in the backend's <code>.env</code> to accept real payments
              instead.
            </p>
            <Button variant="primary" size="lg" onClick={handleDemoConfirm} disabled={starting}>
              {starting ? 'Confirming…' : 'Simulate Successful Payment'}
            </Button>
          </div>
        )}

        {payError && <p className="payment-page__error">{payError}</p>}
      </Reveal>
    </section>
  );
}
